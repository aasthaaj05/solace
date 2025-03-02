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
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold">Student Signup</h2>
        {Object.keys(formData).map((key) => (
          key !== "password" && (
            <input
              key={key}
              type={key === "dob" ? "date" : "text"}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="block w-full p-2 border rounded mt-2"
              required
            />
          )
        ))}
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="block w-full p-2 border rounded mt-2"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded mt-4 w-full">Sign Up</button>
      </form>
    </div>
  );
};

export default StudentSignup;
