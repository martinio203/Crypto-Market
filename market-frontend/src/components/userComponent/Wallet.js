import { useEffect, useState } from "react";

function WalletPage() {
    const [error, setError] = useState(null);
    const [wallet, setWallet] = useState([]);
    const [rate, setRate] = useState({});


    const fetchWallet = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/user/getWallet", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setWallet(data);
        } catch (error) {
            setError(error.message);
        }
    }
        const fetchRate = async () => {
            const token = localStorage.getItem("token");
            try {
                const currencies = wallet.map((currency) => currency.currency);

                const responses = await Promise.all(
                    currencies.map((currency) =>
                        fetch(`http://localhost:8080/api/v1/market/rate?fromCurrency=${currency}&toCurrency=usd`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                        })
                    )
                );

                const ratesData = await Promise.all(
                    responses.map((response) => response.json())
                );

                const rates = currencies.reduce((acc, currency, index) => {
                    acc[currency] = ratesData[index];
                    return acc;
                }, {});

                setRate(rates);
            } catch (error) {
                setError(error.message);
            }
        }


        useEffect(() => {
            fetchWallet();
        }, []);


        useEffect(() => {
            if (wallet.length > 0) {
                fetchRate();
            }
        }, [wallet]);

        const calculate = (currency) => {
            const rateForCurrency = rate[currency.currency];
            if (!rateForCurrency) return "Loading...";
            const calculated = currency.amount * rateForCurrency;
            return calculated.toFixed(2);
        };
        
        return (
            <div className="container">
                <table className="table table-bordered text-center">
                    <thead className="table-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Currency Name</th>
                        <th scope="col">Currency Symbol</th>
                        <th scope="col">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {wallet.map((currency, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{currency.fullName}</td>
                            <td>{currency.currency}</td>
                            <td>
                                <div>{currency.amount}</div>
                                <div className="custom-font-size">≈ ${calculate(currency)}</div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );

}
export default WalletPage;
