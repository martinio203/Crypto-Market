import React, { useState } from "react";

function AddBalance() {
    const [email, setEmail] = useState("");
    const [currency, setCurrency] = useState("");
    const [amount, setAmount] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async () => {
        if (!email || !currency || !amount) {
            setErrorMessage("Please fill out all fields.");
            setSuccessMessage("");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/addUserBalance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: email,
                    currency: currency,
                    amount: amount,
                }),
            });

            if (response.ok) {
                setSuccessMessage("Balance successfully added!");
                setErrorMessage("");
                setEmail("");
                setCurrency("");
                setAmount("");
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

    return (
        <div className="container">
            <div className="d-flex justify-content-center">
                <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "500px" }}>
                    <div className="text-center mb-3">
                        <h5>Add User Balance</h5>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">User Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter user email"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="currency" className="form-label">Currency</label>
                        <input
                            type="text"
                            id="currency"
                            className="form-control"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                            placeholder="Enter currency"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="amount" className="form-label">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            className="form-control"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                        />
                    </div>

                    <div className="text-center">
                        <button className="btn btn-primary w-100" onClick={handleSubmit}>Add Balance</button>
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

export default AddBalance;