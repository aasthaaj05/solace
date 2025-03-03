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
        setTimeout(() => navigate("/student-dashboard"), 1000);
      } else if (counsellorSnap.exists()) {
        localStorage.setItem("role", "counsellor");
        setTimeout(() => navigate("/counsellor-dashboard"), 1000);
      } else {
        throw new Error("User role not found. Please contact support.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#F7CFD8] to-[#A6F1E0]">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-center text-[#73C7C7] mb-4">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#73C7C7] bg-[#F4F8D3] text-gray-700"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
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

        {/* Sign Up Options */}
        <p className="text-center text-sm text-gray-600 mt-4">Don't have an account?</p>
        <div className="flex justify-center mt-2 space-x-3">
          <button
            onClick={() => navigate("/signup/student")}
            className="px-4 py-2 text-white bg-[#73C7C7] rounded-lg font-semibold hover:bg-[#A6F1E0] transition-all"
          >
            Sign up as Student
          </button>
          <button
            onClick={() => navigate("/signup/counsellor")}
            className="px-4 py-2 text-white bg-[#73C7C7] rounded-lg font-semibold hover:bg-[#A6F1E0] transition-all"
          >
            Sign up as Counsellor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
