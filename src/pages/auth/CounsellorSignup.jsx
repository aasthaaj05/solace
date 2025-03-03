import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage, createUserWithEmailAndPassword } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

  const [degreeProof, setDegreeProof] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDegreeProof(e.target.files[0]);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log("Signing up user...");
  
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCredential.user.uid;
  
      console.log("User created with ID:", userId);
  
      let degreeProofUrl = "";
      if (degreeProof) {
        const storageRef = ref(storage, `counsellor_degrees/${userId}`);
        await uploadBytes(storageRef, degreeProof);
        degreeProofUrl = await getDownloadURL(storageRef);
        console.log("Degree proof uploaded:", degreeProofUrl);
      }
  
      await setDoc(doc(db, "counsellors", userId), {
        ...formData,
        degreeProofUrl,
        role: "counsellor",
      });
  
      console.log("User document added to Firestore!");
  
      alert("Signup successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login"); // ✅ Ensures navigation happens after alert
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

          <label className="block text-sm font-medium text-gray-600">Degree Proof (Upload Image)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
            onChange={handleFileChange}
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
