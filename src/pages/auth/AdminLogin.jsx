import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Replace with actual admin authentication logic
    const validAdmin = {
      email: "admin@example.com", // Replace with actual admin email
      password: "admin123", // Replace with actual admin password
    };

    if (formData.email === validAdmin.email && formData.password === validAdmin.password) {
      navigate("/admin-dashboard"); // Redirect to Admin Dashboard
    } else {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#F7CFD8] to-[#A6F1E0]">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-center text-[#73C7C7] mb-4">Admin Login</h2>
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#73C7C7] bg-[#F4F8D3] text-gray-700"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Admin Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#73C7C7] bg-[#F4F8D3] text-gray-700"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 text-white bg-[#73C7C7] rounded-lg font-semibold hover:bg-[#A6F1E0] transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
