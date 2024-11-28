import React, { useState } from "react";
import {Dropdown} from "react-bootstrap";

function AddCurrency() {
    const [currency, setCurrency] = useState("");
    const [fullName, setFullName] = useState("");
    const [type, setType] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async () => {
        if (!currency || !fullName || !type) {
            setErrorMessage("Please fill out all fields.");
            setSuccessMessage("");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/addCurrency", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currency: currency,
                    fullName: fullName,
                    type: type,
                }),
            });
            if (response.ok) {
                setSuccessMessage(`${fullName} has been added.`);
                setErrorMessage("");
                setCurrency("");
                setFullName("");
                setType("");
            } else {
                const errorData = await response.json();
                setSuccessMessage("");
                setErrorMessage(errorData.error);
            }
        } catch (error) {
            setSuccessMessage("");
            setErrorMessage("Error occurred while processing the request.");
        }
    };

    const formatCurrencyName = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-center">
                <div className="card p-4 shadow-sm" style={{width: "100%", maxWidth: "500px"}}>
                    <div className="text-center mb-3">
                        <h5>Add New Currency</h5>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Currency Name</label>
                        <input
                            type="text"
                            id="currencyName"
                            className="form-control"
                            value={fullName}
                            onChange={(e) => setFullName(formatCurrencyName(e.target.value))}
                            placeholder="Enter currency name"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="currency" className="form-label">Currency Symbol</label>
                        <input
                            type="text"
                            id="currencySymbol"
                            className="form-control"
                            value={currency}
                            onChange={(e) => setCurrency((e.target.value.toUpperCase()))}
                            placeholder="Enter currency symbol"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">Select Currency Type</label>
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" id="dropdown-type">
                                {type ? type.charAt(0).toUpperCase() + type.slice(1) : "Select type"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setType("CRYPTO")}>Crypto</Dropdown.Item>
                                <Dropdown.Item onClick={() => setType("FIAT")}>Fiat</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="text-center">
                        <button className="btn btn-primary w-100" onClick={handleSubmit}>Add new currency</button>
                    </div>

                    <div className="text-center mt-2">
                        {successMessage && <span className="text-success">{successMessage}</span>}
                        {errorMessage && <span className="text-danger">{errorMessage}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCurrency;
