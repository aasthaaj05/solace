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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log("Signing up user...");
  
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCredential.user.uid;
  
      console.log("User created with ID:", userId);
  
      // Store Counsellor Data in Firestore (without degree proof)
      await setDoc(doc(db, "counsellors", userId), {
        ...formData,
        role: "counsellor",
      });
  
      console.log("Counsellor document added to Firestore!");

      alert("Signup successful! Redirecting to dashboard...");
      
      setTimeout(() => {
        navigate("/counsellor-dashboard");
      }, 500);
    } catch (error) {
      console.error("Signup failed:", error.message);
      alert("Signup failed: " + error.message);
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

          <button type="submit" className="w-full p-2 text-white bg-[#73C7C7] rounded hover:bg-[#A6F1E0] transition">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default CounsellorSignup;
