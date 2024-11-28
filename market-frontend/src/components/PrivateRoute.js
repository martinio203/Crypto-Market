import {jwtDecode} from "jwt-decode";
import {Navigate} from "react-router-dom";

function isTokenValid(token) {
    try {
        jwtDecode(token);
        return true;
    }
    catch (error) {
        return false;
    }
}
const PrivateRoute = ({children, requiredRole}) => {
    const token = localStorage.getItem("token");
    const isLoggedIn = token && isTokenValid(token);
    const role = token && isTokenValid(token) ? jwtDecode(token).role : null;

    if (!isLoggedIn || (requiredRole && requiredRole !== role)) {
        return <Navigate to="/login" />;
    }

    return children;
}
export default PrivateRoute;