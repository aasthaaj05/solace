import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";

const ContactCounsellor = () => {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showGroupList, setShowGroupList] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const navigate = useNavigate();

  // List of issues
  const issues = ["Academic & Career Stress", "Family Matters", "Friendship & Social Life"];

  // Handle issue selection
  const handleIssueSelection = async (issue) => {
    setSelectedIssue(issue);
    setShowOptions(true);

    // Save the user's issue in Firestore
    const user = auth.currentUser;
    if (user) {
      const issueCollection = collection(db, issue.replace(/ /g, "")); // Remove spaces for collection name
      await addDoc(issueCollection, {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        timestamp: new Date(),
      });
    }
  };

  // Handle group or individual selection
  const handleGroupIndividualSelection = async (choice) => {
    if (choice === "group") {
      // Fetch other users with the same issue (excluding the current user)
      const user = auth.currentUser;
      if (user) {
        const issueCollection = collection(db, selectedIssue.replace(/ /g, ""));
        const q = query(issueCollection, where("userId", "!=", user.uid));
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map((doc) => doc.data());
        setGroupMembers(users);
        setShowGroupList(true);
      }
    } else if (choice === "individual") {
      // Redirect to counsellor contact page
      navigate("/contact-counsellor-form");
    }
  };

  // Handle group member selection
  const handleGroupMemberSelection = (user) => {
    if (selectedGroupMembers.includes(user.userId)) {
      setSelectedGroupMembers((prev) => prev.filter((id) => id !== user.userId));
    } else {
      setSelectedGroupMembers((prev) => [...prev, user.userId]);
    }
  };

  // Handle group formation
  const handleGroupFormation = async () => {
    const user = auth.currentUser;
    if (user) {
      // Save the group in Firestore
      const groupCollection = collection(db, "groups");
      await addDoc(groupCollection, {
        issue: selectedIssue,
        members: [...selectedGroupMembers, user.uid], // Include the current user
        timestamp: new Date(),
      });

      // Redirect to counsellor contact page
      navigate("/contact-counsellor-form");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8D3] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-[#73C7C7] mb-8">Contact a Counsellor</h1>

      {/* Step 1: Select Issue */}
      {!selectedIssue && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold text-[#73C7C7] mb-4">What type of issue are you facing?</h2>
          <div className="space-y-4">
            {issues.map((issue, index) => (
              <button
                key={index}
                className="w-full bg-[#E0F2FE] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#A6F1E0] transition duration-200"
                onClick={() => handleIssueSelection(issue)}
              >
                {issue}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Group or Individual */}
      {showOptions && !showGroupList && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold text-[#73C7C7] mb-4">
            Some more users wish to avail counselling for similar issues. Do you wish to avail counselling?
          </h2>
          <div className="space-y-4">
            <button
              className="w-full bg-[#73C7C7] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#A6F1E0] transition duration-200"
              onClick={() => handleGroupIndividualSelection("group")}
            >
              Group
            </button>
            <button
              className="w-full bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-400 transition duration-200"
              onClick={() => handleGroupIndividualSelection("individual")}
            >
              Individual
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Group Member Selection */}
      {showGroupList && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold text-[#73C7C7] mb-4">Select users to form a group:</h2>
          <div className="space-y-4">
            {groupMembers.map((user, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedGroupMembers.includes(user.userId)}
                  onChange={() => handleGroupMemberSelection(user)}
                />
                <span>{user.userName}</span>
              </div>
            ))}
            <button
              className="w-full bg-[#73C7C7] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#A6F1E0] transition duration-200"
              onClick={handleGroupFormation}
            >
              Group with Selected Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactCounsellor;