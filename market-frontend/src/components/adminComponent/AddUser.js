import React, { useState } from "react";
import {Dropdown} from "react-bootstrap";

function AddUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async () => {
        if (!email || !password || !confirmPassword || !role) {
            setErrorMessage("Please fill out all fields.");
            setSuccessMessage("");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                    role: role,
                }),
            });
            if (response.ok) {
                setSuccessMessage(`${role.toLowerCase()} ${email} has been added.`);
                setErrorMessage("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setRole("");
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
                <div className="card p-4 shadow-sm" style={{width: "100%", maxWidth: "500px"}}>
                    <div className="text-center mb-3">
                        <h5>Add User</h5>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">User Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter user password"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="currency" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword((e.target.value))}
                            placeholder="Enter email again"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="currency" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword((e.target.value))}
                            placeholder="Enter password again"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Select Role</label>
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" id="dropdown-role">
                                {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Select role"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setRole("USER")}>User</Dropdown.Item>
                                <Dropdown.Item onClick={() => setRole("ADMIN")}>Admin</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="text-center">
                        <button className="btn btn-primary w-100" onClick={handleSubmit}>Add user</button>
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

export default AddUser;
