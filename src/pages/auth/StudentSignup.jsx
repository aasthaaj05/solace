import React, { useState } from "react";
import { auth, db, createUserWithEmailAndPassword } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    college: "",
    rollNo: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    // Validate email
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Validate password
    if (!validatePassword(formData.password)) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      console.log("Signing up user...");

      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const userId = userCredential.user.uid;

      console.log("User created with ID:", userId);

      // Store student data in Firestore (without password or confirmPassword)
      const { password, confirmPassword, ...userDataWithoutPassword } = formData;
      await setDoc(doc(db, "students", userId), {
        ...userDataWithoutPassword,
        role: "student",
      });

      console.log("Student document added to Firestore!");

      alert("Signup successful! Redirecting to dashboard...");

      // Redirect to student dashboard
      navigate("/student-dashboard");
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#F7CFD8] to-[#A6F1E0]">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-[#73C7C7] mb-4">Student Signup</h2>

        {/* Render form fields dynamically */}
        {Object.keys(formData).map((key) =>
          key !== "password" && key !== "confirmPassword" && key !== "gender" ? (
            <input
              key={key}
              type={key === "dob" ? "date" : "text"}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-[#F4F8D3] focus:outline-none focus:ring-2 focus:ring-[#73C7C7] text-gray-700 mt-2"
              required
            />
          ) : null
        )}

        {/* Gender Dropdown */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg bg-[#F4F8D3] focus:outline-none focus:ring-2 focus:ring-[#73C7C7] text-gray-700 mt-2"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg bg-[#F4F8D3] focus:outline-none focus:ring-2 focus:ring-[#73C7C7] text-gray-700 mt-2"
          required
        />

        {/* Confirm Password Input */}
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg bg-[#F4F8D3] focus:outline-none focus:ring-2 focus:ring-[#73C7C7] text-gray-700 mt-2"
          required
        />

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full p-3 mt-4 text-white bg-[#73C7C7] rounded-lg font-semibold hover:bg-[#A6F1E0] transition-all"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default StudentSignup;