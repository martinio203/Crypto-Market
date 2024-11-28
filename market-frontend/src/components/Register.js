import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            localStorage.removeItem("token");
        }
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                }),
            });
            if (response.ok) {
                setError("");
                navigate("/login", { state: { message: "Account created successfully. Please login." } });
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (error) {
            setError("Error during registration");
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Form className="login-form" onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>

                <h1 className="text-center mb-4">Create an Account</h1>

                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputPassword2">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword2"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="text-center mb-3">
                    <span>Already have an account? </span>
                    <a href="/login">Sign in!</a>
                </div>


                <Button type="submit" className="btn btn-primary w-100">
                    Submit
                </Button>

                {error && <div className="text-danger">{error}</div>}

            </Form>
        </div>
    );
}

export default RegisterForm;