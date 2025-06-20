import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function Register() {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form, navigate);
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
            className="border border-green-500 cursor-pointer rounded-lg p-4 bg-green-50 hover:bg-green-100 transition shadow"
          >
            <p className="text-lg font-semibold text-green-800">{user.name}</p>
            <p className="text-sm text-green-600">{user.email}</p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center">
          Already have an account? <a href="/login" className="text-green-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
