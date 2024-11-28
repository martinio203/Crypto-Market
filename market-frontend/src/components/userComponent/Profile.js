import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();

    const fetchUserDetails = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/user/userDetails", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setUserDetails(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchChangePassword = async () => {
        const token = localStorage.getItem("token");
        try {
            await fetch("http://localhost:8080/api/v1/user/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchChangeEmail = async () => {
        const token = localStorage.getItem("token");
        try {
            await fetch("http://localhost:8080/api/v1/user/changeEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    newEmail: newEmail,
                }),
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const handleEmailModalClose = () => {
        setShowEmailModal(false);
        setErrorMessage("");
    };

    const handleEmailModalShow = () => setShowEmailModal(true);


    const handlePasswordModalClose = () => {
        setShowPasswordModal(false);
        setPasswordError("");
    };

    const handlePasswordModalShow = () => setShowPasswordModal(true);


    const handleEmailSubmit = () => {
        const validMail = new RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/).test(newEmail);
        if (newEmail !== confirmEmail) {
            setErrorMessage("Emails do not match");
        } else if (!validMail) {
            setErrorMessage("Invalid email address");
        } else {
            fetchChangeEmail();
            handleEmailModalClose();
            localStorage.removeItem("token");
            navigate("/login", { state: { message: "Email changed successfully! Please log in again" } });
        }
    };

    const handlePasswordSubmit = () => {
        if (newPassword === confirmPassword) {
            fetchChangePassword();
            handlePasswordModalClose();
            localStorage.removeItem("token");
            navigate("/login", { state: { message: "Password changed successfully! Please log in again" } });
        } else {
            setPasswordError("Passwords do not match");
        }
    };

    return (
        <div className="container mt-5">
            <Card className="p-3">
                <h3><i className="bi bi-person me-1"></i>Profile</h3>
                <div className="custom-font-size">User Id: #{userDetails.id}</div>
                <hr/>

                <div className="d-flex justify-content-between align-items-center fs-5">
                    <div>
                        <strong>User Email:</strong> {userDetails.email}
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button variant="primary" onClick={handleEmailModalShow}>
                        Change Email
                    </Button>
                    <Button variant="primary" onClick={handlePasswordModalShow}>
                        Change Password
                    </Button>
                </div>
            </Card>

            <Modal show={showEmailModal} onHide={handleEmailModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewEmail">
                            <Form.Label>New Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter new email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formConfirmEmail">
                            <Form.Label className="mt-3">Confirm Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Confirm new email"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                            />
                        </Form.Group>
                        {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEmailModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEmailSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPasswordModal} onHide={handlePasswordModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formOldPassword">
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter old password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3" controlId="formNewPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3" controlId="formConfirmPassword">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                        {passwordError && <div className="text-danger mt-2">{passwordError}</div>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handlePasswordModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handlePasswordSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProfilePage;