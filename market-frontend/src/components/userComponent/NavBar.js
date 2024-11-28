import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {jwtDecode} from "jwt-decode";

function isTokenValid(token) {
    try {
        jwtDecode(token);
        return true;
    }
    catch (error) {
        return false;
    }
}

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const token = localStorage.getItem("token");
    const role = token && isTokenValid(token) ? jwtDecode(token).role : null;

    if (["/login", "/register"].includes(location.pathname) || !token || ["ADMIN"].includes(role)) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand fs-3">Market</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded={!isNavCollapsed ? "true" : "false"}
                    aria-label="Toggle navigation"
                    onClick={handleNavCollapse}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-sm-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/home">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/exchange">Exchange</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/transactions">Transactions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/wallet">Wallet</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">Profile</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-sm-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/login" onClick={handleLogout}>Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
