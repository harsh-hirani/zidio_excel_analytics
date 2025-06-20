// ==== PrivateRoute.js ====
import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export function PrivateRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export function AdminRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
export function LogOut (){
  const {logout} = useContext(AuthContext);
  logout();
  return <Navigate to="/login"/>
}