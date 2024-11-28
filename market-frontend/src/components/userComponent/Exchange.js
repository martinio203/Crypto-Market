import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";

function ExchangePage() {
    const [userCurrencies, setUserCurrencies] = useState([]);
    const [marketCurrencies, setMarketCurrencies] = useState([]);
    const [filteredUserCurrencies, setFilteredUserCurrencies] = useState([]);
    const [filteredMarketCurrencies, setFilteredMarketCurrencies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [amount, setAmount] = useState("");
    const [fromCurrency, setFromCurrency] = useState("");
    const [toCurrency, setToCurrency] = useState("");
    const [error, setError] = useState("");
    const [rate, setRate] = useState("");
    const [exchangeSuccess, setExchangeSuccess] = useState("");


    const fetchUserCurrencies = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/user/userCurrency", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            const mappedData = data.map((currency) => ({
                name: currency.fullName,
                symbol: currency.currency,
                type: currency.type,
            }));
            setUserCurrencies(mappedData);
            setFilteredUserCurrencies(mappedData);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchMarketCurrencies = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/user/marketCurrency", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            const mappedData = data.map((currency) => ({
                name: currency.fullName,
                symbol: currency.currency,
                type: currency.type,
            }));
            setMarketCurrencies(mappedData);
            setFilteredMarketCurrencies(mappedData);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchExchange = async () => {
        const token = localStorage.getItem("token");
        const exchangeRequest = {
            sellCurrency: fromCurrency.symbol,
            buyCurrency: toCurrency.symbol,
            amount: amount,
        };
        try {
            const response = await fetch("http://localhost:8080/api/v1/user/exchange", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(exchangeRequest),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setExchangeSuccess("");
                setError(errorData.error);
            } else {
                setExchangeSuccess("Exchange successful!");
                setError("");
                setToCurrency("");
                setFromCurrency("");
            }
        } catch (error) {
            setExchangeSuccess("");
            setError("Unknown error occurred");
        }
    };

    const fetchRate = async () => {
        const token = localStorage.getItem("token");
        const from = fromCurrency.symbol;
        const to = toCurrency.symbol;
        try {
            const response = await fetch(`http://localhost:8080/api/v1/market/rate?fromCurrency=${from}&toCurrency=${to}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            setRate(await response.json());
        } catch (error) {
            setError(error.message);
        }
    }

    const handleCalculate = () => {
        const calculate = amount * rate;
        return toCurrency.type === "FIAT" ? calculate.toFixed(2) : calculate.toFixed(8);

    }

    useEffect(() => {
        fetchUserCurrencies();
        fetchMarketCurrencies();
    }, []);

    useEffect(() => {
        if (fromCurrency.length > 0 && toCurrency.length > 0) {
            fetchRate();
        }
    }, [fromCurrency, toCurrency]);

    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        const validInput = /^[0-9]*(?:[.,][0-9]*)?$/.test(inputValue);
        if (validInput) {
            setAmount(inputValue);
            if (inputValue.length === 1) {
                fetchRate();
            }
        }
    };

    const handleFromCurrencyChange = (crypto) => {
        setFromCurrency(crypto);
    };

    const handleToCurrencyChange = (crypto) => {
        setToCurrency(crypto);
    };

    const handleUserSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term === "") {
            setFilteredUserCurrencies(userCurrencies);
        } else {
            const filtered = userCurrencies.filter((crypto) =>
                (crypto.name && crypto.name.toLowerCase().includes(term.toLowerCase())) ||
                (crypto.symbol && crypto.symbol.toLowerCase().includes(term.toLowerCase()))
            );
            setFilteredUserCurrencies(filtered);
        }
    };

    const handleMarketSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term === "") {
            setFilteredMarketCurrencies(marketCurrencies);
        } else {
            const filtered = marketCurrencies.filter((crypto) =>
                (crypto.name && crypto.name.toLowerCase().includes(term.toLowerCase())) ||
                (crypto.symbol && crypto.symbol.toLowerCase().includes(term.toLowerCase()))
            );
            setFilteredMarketCurrencies(filtered);
        }
    };


    return (
        <div className="container">
            <div className="d-flex justify-content-center">
                <div className="card p-4 shadow-sm exchange-card" style={{width: "100%", maxWidth: "500px"}}>
                    <div className="text-center mb-3">
                        <h5>Exchange Currency</h5>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="amount" className="form-label">Amount</label>
                        <div className="d-flex">
                            <input
                                type="text"
                                id="amount"
                                className="form-control"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Enter amount"
                            />
                            <div className="ms-2">
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-from-crypto">
                                        {fromCurrency ? `${fromCurrency.name} (${fromCurrency.symbol})` : "Select currency"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{maxHeight: "160px", overflowY: "auto"}}>
                                        <div className="p-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={searchTerm}
                                                onChange={handleUserSearch}
                                                placeholder="Search..."
                                            />
                                        </div>
                                        {filteredUserCurrencies.map((crypto, index) => (
                                            <Dropdown.Item key={index} onClick={() => handleFromCurrencyChange(crypto)}>
                                                {crypto.name} ({crypto.symbol.toLowerCase()})
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-3">
                        <i className="bi bi-arrow-down-circle-fill" style={{fontSize: "30px"}}></i>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="receiveAmount" className="form-label">You will receive</label>
                        <div className="d-flex">
                            <input
                                type="text"
                                id="receiveAmount"
                                className="form-control"
                                value={`≈ ${handleCalculate()}`}
                                readOnly
                                style={{appearance: "none", MozAppearance: "textfield", WebkitAppearance: "none"}}
                            />
                            <div className="ms-2">
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-to-crypto">
                                        {toCurrency ? `${toCurrency.name} (${toCurrency.symbol})` : "Select currency"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{maxHeight: "160px", overflowY: "auto"}}>
                                        <div className="p-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={searchTerm}
                                                onChange={handleMarketSearch}
                                                placeholder="Search..."
                                            />
                                        </div>
                                        {filteredMarketCurrencies.map((crypto, index) => (
                                            <Dropdown.Item key={index} onClick={() => handleToCurrencyChange(crypto)}>
                                                {crypto.name} ({crypto.symbol.toLowerCase()})
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button className="btn btn-primary w-100" onClick={fetchExchange}>Confirm</button>
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-success">{exchangeSuccess}</span>
                        <span className="text-danger">{error}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExchangePage;