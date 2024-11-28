import React, { useState } from "react";

function DeleteUser() {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async () => {
        if (!email || !confirmEmail ) {
            setErrorMessage("Please fill out all fields.");
            setSuccessMessage("");
            return;
        }

        if (email !== confirmEmail) {
            setErrorMessage("Emails do not match.");
            setSuccessMessage("");
            return;
        }


        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/deleteUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: email,
                    confirmEmail: confirmEmail,
                }),
            });
            if (response.ok) {
                setSuccessMessage(`User ${email} has been deleted.`);
                setErrorMessage("");
                setEmail("");
                setConfirmEmail("");
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
                        <h5>Delete User</h5>
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
                        <label htmlFor="currency" className="form-label">Confirm User Email</label>
                        <input
                            type="text"
                            id="confirmEmail"
                            className="form-control"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail((e.target.value))}
                            placeholder="Enter email again"
                        />
                    </div>

                    <div className="text-center">
                        <button className="btn btn-primary w-100" onClick={handleSubmit}>Delete user</button>
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

export default DeleteUser;
