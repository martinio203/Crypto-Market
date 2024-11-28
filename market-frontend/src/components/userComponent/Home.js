import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

const HomePage = () => {
    const [topCurrency, setTopCurrency] = useState({});
    const [userCurrency, setUserCurrency] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [lastTransactions, setLastTransactions] = useState([]);
    const [displayLastTransaction, setDisplayLastTransaction] = useState({});
    const [wallet, setWallet] = useState([]);

    const fetchTopCurrency = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/market/assets", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setTopCurrency(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchUserCurrency = async () => {
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
            setUserCurrency(data.slice(0, 3));
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchUserEmail = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/user/userInfo", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.text();
            setUserEmail(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchLastTransaction = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/transaction/userTransactions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setLastTransactions(data);
            setDisplayLastTransaction(data[0]);
        } catch (error) {
            console.error(error.message);
        }
    }

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
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchTopCurrency();
        fetchUserCurrency();
        fetchUserEmail();
        fetchLastTransaction();
        fetchWallet();
    }, []);

    const formatDate = (date) => {
        if (!date) return 'Invalid date';
        const match = date.match(/^\d{4}-\d{2}-\d{2}/);
        return match ? match[0] : 'Invalid date';
    }

    return (
        <div className="container mt-4">
            <div className="row g-4 d-flex align-items-stretch">
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title">
                                    <i className="bi bi-hand-thumbs-up-fill me-1"></i>
                                    Popular Coins
                                </h5>
                            </div>
                            <table className="table table-sm mt-3">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.keys(topCurrency).map((key) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>${topCurrency[key]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title">
                                    <i className="bi bi-coin me-1"></i>
                                    Your Currency
                                </h5>
                                <Link className="text-muted small" to="/wallet">View Details</Link>
                            </div>
                            <table className="table table-sm mt-3">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {userCurrency.map((currency) => (
                                    <tr key={currency.currency}>
                                        <td>{currency.currency}</td>
                                        <td>{currency.amount}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title">
                                    <i className="bi bi-person-circle me-1"></i>
                                    Profile
                                </h5>
                                <Link className="text-muted small" to="/profile">Profile Setting</Link>
                            </div>
                            <p className="mt-3 mb-0">Logged as: <strong>{userEmail}</strong></p>
                            <p className="mt-3 mb-0">Transactions: <strong>{lastTransactions.length}</strong></p>
                            <p  className="mt-3 mb-0">Number of currencies owned <strong>{wallet.length}</strong></p>

                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title">
                                    <i className="bi bi-clock-history me-1"></i>
                                    Last Transaction
                                </h5>
                                <Link className="text-muted small" to="/transactions">View all transactions</Link>
                            </div>
                            <table className="table table-sm mt-3">
                                <thead>
                                <tr>
                                    <th>Sell Currency</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {displayLastTransaction && (
                                    <tr>
                                        <td>{displayLastTransaction.sellCurrency}</td>
                                        <td>{displayLastTransaction.sellAmount}</td>
                                        <td>{formatDate(displayLastTransaction.date)}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
