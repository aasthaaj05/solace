import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, createUserWithEmailAndPassword } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";

const CounsellorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    costPerHour: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8; // Minimum 8 characters
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(formData.password)) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      console.log("Signing up user...");

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCredential.user.uid;

      console.log("User created with ID:", userId);

      // Store Counsellor Data in Firestore (without password)
      const { password, confirmPassword, ...userDataWithoutPassword } = formData;
      await setDoc(doc(db, "counsellors", userId), {
        ...userDataWithoutPassword,
        role: "counsellor",
      });

      console.log("Counsellor document added to Firestore!");

      alert("Signup successful! Redirecting to dashboard...");

      setTimeout(() => {
        navigate("/counsellor-dashboard");
      }, 500);
    } catch (error) {
      console.error("Signup failed:", error.message);
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already in use. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak. Please use a stronger password.");
      } else {
        alert("Signup failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7CFD8]">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-[#73C7C7]">Counsellor Signup</h2>
        <form onSubmit={handleSignup} className="mt-4 space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
            onChange={handleChange}
            required
          />

          <label className="block text-sm font-medium text-gray-600">Gender</label>
          <select
            name="gender"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>

          <input
            type="number"
            name="costPerHour"
            placeholder="Cost Per Hour"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full p-2 text-white bg-[#73C7C7] rounded hover:bg-[#A6F1E0] transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CounsellorSignup;