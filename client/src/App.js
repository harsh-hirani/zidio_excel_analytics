// ==== App.js ====
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { PrivateRoute, AdminRoute, LogOut } from './PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register.js';
import Dashboard from './pages/Dashboard.js';
import UserProfile from './pages/UserProfile.js';
import Uploads from './pages/Uploads.js';
import Charts from './pages/Charts.js';
import ChartDetail from './pages/ChartDetail.js';
import UploadDetail from './pages/UploadDetail.js';
import AdminPage from './pages/Admin.js';
import Layout from './Layout.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<LogOut />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/uploads" element={<Uploads />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/chart/:id" element={<ChartDetail labels={['Sales', 'Profit', 'Region', 'Date']} axisCount={2}/>}    />
              <Route path="/upload/:id" element={<UploadDetail />} />
            </Route>
          </Route>

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
