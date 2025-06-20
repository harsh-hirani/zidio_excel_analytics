import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function Login() {
  const { login, user } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form, navigate, location);
  };

  const redirectToHome = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
        
        {user && (
          <div
            onClick={redirectToHome}
            className="border border-blue-500 cursor-pointer rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition shadow"
          >
            <p className="text-lg font-semibold text-blue-800">{user.name}</p>
            <p className="text-sm text-blue-600">{user.email}</p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center text-gray-800">Login to Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
