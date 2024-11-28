import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {jwtDecode} from "jwt-decode";
import LoginForm from './components/Login';
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import RegisterForm from "./components/Register";
import HomePage from "./components/userComponent/Home";
import ExchangePage from "./components/userComponent/Exchange";
import NavBar from "./components/userComponent/NavBar";
import WalletPage from "./components/userComponent/Wallet";
import ProfilePage from "./components/userComponent/Profile";
import TransactionPage from "./components/userComponent/Transaction";
import AdminDashboard from "./components/adminComponent/AdminDashboard";
import AddBalance from "./components/adminComponent/AddBalance";
import DeleteUser from "./components/adminComponent/DeleteUser";
import AddCurrency from "./components/adminComponent/AddCurrency";
import AddUser from "./components/adminComponent/AddUser";
import PrivateRoute from "./components/PrivateRoute";

function App() {

    return (
        <Router>
                <NavBar />
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                <Route path="/home" element={<PrivateRoute requiredRole={"USER"}> <HomePage/> </PrivateRoute> } />
                <Route path="/exchange" element={<PrivateRoute requiredRole={"USER"}> <ExchangePage/> </PrivateRoute> } />
                <Route path="/transactions" element={<PrivateRoute requiredRole={"USER"}> <TransactionPage/> </PrivateRoute>} />
                <Route path="/wallet" element={<PrivateRoute requiredRole={"USER"}> <WalletPage/> </PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute requiredRole={"USER"}> <ProfilePage/> </PrivateRoute>} />

                <Route path="/admin/dashboard" element={<PrivateRoute requiredRole={"ADMIN"}> <AdminDashboard/> </PrivateRoute>} />
                <Route path="/admin/add-balance" element={<PrivateRoute requiredRole={"ADMIN"}> <AddBalance/> </PrivateRoute>} />
                <Route path="/admin/delete-user" element={<PrivateRoute requiredRole={"ADMIN"}> <DeleteUser/> </PrivateRoute>} />
                <Route path="/admin/add-user" element={<PrivateRoute requiredRole={"ADMIN"}> <AddUser/> </PrivateRoute>} />
                <Route path="/admin/add-currency" element={<PrivateRoute requiredRole={"ADMIN"}> <AddCurrency/> </PrivateRoute>} />

            </Routes>
        </Router>
    );
}

export default App;
