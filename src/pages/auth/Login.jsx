import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, signInWithEmailAndPassword } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCredential.user.uid;

      const studentRef = doc(db, "students", userId);
      const counsellorRef = doc(db, "counsellors", userId);

      const studentSnap = await getDoc(studentRef);
      const counsellorSnap = await getDoc(counsellorRef);

      if (studentSnap.exists()) {
        localStorage.setItem("role", "student");
        alert("Login successful! Redirecting to student dashboard...");
        setTimeout(() => navigate("/student-dashboard"), 1500);
      } else if (counsellorSnap.exists()) {
        localStorage.setItem("role", "counsellor");
        alert("Login successful! Redirecting to counsellor dashboard...");
        setTimeout(() => navigate("/counsellor-dashboard"), 1500);
      } else {
        throw new Error("User role not found. Please contact support.");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setError(error.message);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F4F8D3]">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-[#73C7C7]">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full p-2 text-white bg-[#73C7C7] rounded hover:bg-[#A6F1E0] transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
