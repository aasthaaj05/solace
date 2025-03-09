import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import StudNavbar from "../../student/StudNavbar";
import AnimatedBackground from "../../AnimatedBackground";

// Reusable Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 ${className}`}>
    {children}
  </div>
);

// Reusable Button Component
const Button = ({ children, onClick, className = "" }) => (
  <button
    className={`w-full font-semibold px-4 py-2 rounded-lg transition duration-200 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

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
    <div className="min-h-screen flex flex-col relative bg-gradient-to-r from-[#F7CFD8] to-[#A6F1E0]">
      {/* Animated Background for the Entire Page */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Navbar */}
      <StudNavbar />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-6">
          {/* Step 1: Select Issue */}
          {!selectedIssue && (
            <Card>
              <h2 className="text-2xl font-bold text-[#73C7C7] mb-6">What type of issue are you facing?</h2>
              <div className="space-y-4">
                {issues.map((issue, index) => (
                  <Button
                    key={index}
                    onClick={() => handleIssueSelection(issue)}
                    className="bg-[#A6F1E0] text-black hover:bg-[#73C7C7] hover:text-white"
                  >
                    {issue}
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {/* Step 2: Group or Individual */}
          {showOptions && !showGroupList && (
            <Card>
              <h2 className="text-2xl font-bold text-[#73C7C7] mb-6">
                Some more users wish to avail counselling for similar issues. Do you wish to avail counselling?
              </h2>
              <div className="space-y-4">
                <Button
                  onClick={() => handleGroupIndividualSelection("group")}
                  className="bg-[#73C7C7] text-white hover:bg-[#A6F1E0] hover:text-black"
                >
                  Group
                </Button>
                <Button
                  onClick={() => handleGroupIndividualSelection("individual")}
                  className="bg-[#A6F1E0] text-black hover:bg-[#73C7C7] hover:text-white"
                >
                  Individual
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Group Member Selection */}
          {showGroupList && (
            <Card>
              <h2 className="text-2xl font-bold text-[#73C7C7] mb-6">Select users to form a group:</h2>
              <div className="space-y-4">
                {groupMembers.map((user, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedGroupMembers.includes(user.userId)}
                      onChange={() => handleGroupMemberSelection(user)}
                      className="w-5 h-5 rounded border-[#73C7C7] focus:ring-[#73C7C7]"
                    />
                    <span className="text-lg">{user.userName}</span>
                  </div>
                ))}
                <Button
                  onClick={handleGroupFormation}
                  className="bg-[#73C7C7] text-white hover:bg-[#A6F1E0] hover:text-black"
                >
                  Group with Selected Users
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCounsellor;