import {Navigate, Outlet} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () =>{
    const {user} = useAuth();

    if(!user){
        return <Navigate to='/login' replace />

    }

    const allowedRoles = ['admin','receptionist'];

    if(!allowedRoles.includes(user.role)){
        return <Navigate to='/login' replace/>

    }
    return <Outlet />
}

export default ProtectedRoute;