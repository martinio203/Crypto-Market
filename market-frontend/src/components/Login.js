import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {useLocation, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [failLogin, setFailLogin] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/v1/auth/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            if (response.ok) {
                const token = await response.text();
                setFailLogin("");
                localStorage.setItem("token", token);
                const role = jwtDecode(token).role;
                role === "USER" ? navigate("/home") : navigate("/admin/dashboard");
            } else {
                const errorData = await response.json();
                setFailLogin(errorData.error);
            }
        } catch (error) {
            setFailLogin("Error during authentication");
       }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            localStorage.removeItem("token");
        }
    },[]);

    useEffect(() => {
        if (location.state && location.state.message) {
            setMessage(location.state.message);
        }
    }, [location]);


    return (

            <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <Form className="login-form" onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
                        <h1 className="text-center mb-4">Account Login</h1>
                        {message && <div className="alert alert-success">{message}</div>}
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

                        <div className="text-center mb-3">
                            <span className="me-1">Don't have an account yet?</span>
                            <a href="/register">Sign up!</a>
                        </div>

                        <Button type="submit" className="btn btn-primary w-100">
                            Submit
                        </Button>
                        {failLogin && <div className="text-danger">{failLogin}</div>}
                    </Form>
            </div>
    );

}

export default LoginForm;
