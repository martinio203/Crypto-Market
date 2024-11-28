import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const [adminEmail, setAdminEmail] = useState("");

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
            setAdminEmail(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchUserEmail();
    }, []);

    return (
        <div className="container mt-4">
            <div className="row g-4 d-flex align-items-stretch">
                <div className="col-12">
                    <h1 className="text-center">Admin Dashboard</h1>
                    <h4 className="text-center">Logged in as: <strong>{adminEmail}</strong></h4>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <Link to="/admin/add-balance" className="text-decoration-none">
                        <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center text-center">
                            <div className="card-body">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-wallet2 me-2"></i>Add User Balance
                                </h5>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <Link to="/admin/delete-user" className="text-decoration-none">
                        <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center text-center">
                            <div className="card-body">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-person-dash me-2"></i>Delete User
                                </h5>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <Link to="/admin/add-user" className="text-decoration-none">
                        <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center text-center">
                            <div className="card-body">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-person-plus me-2"></i>Add New User
                                </h5>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <Link to="/admin/add-currency" className="text-decoration-none">
                        <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center text-center">
                            <div className="card-body">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-currency-exchange me-2"></i>Add New Currency
                                </h5>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
