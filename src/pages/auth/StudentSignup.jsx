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
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, "students", userCredential.user.uid), {
        ...formData,
        role: "student",
      });
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Signup failed:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#F7CFD8] to-[#A6F1E0]">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-[#73C7C7] mb-4">Student Signup</h2>

        {Object.keys(formData).map((key) =>
          key !== "password" && key !== "gender" ? (
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

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full p-3 mt-4 text-white bg-[#73C7C7] rounded-lg font-semibold hover:bg-[#A6F1E0] transition-all"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default StudentSignup;
