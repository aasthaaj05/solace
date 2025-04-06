import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import StudNavbar from "../../student/StudNavbar";
import AnimatedBackground from "../../AnimatedBackground";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 ${className}`}>
    {children}
  </div>
);

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

  const issues = ["Academic & Career Stress", "Family Matters", "Friendship & Social Life"];

  const handleIssueSelection = async (issue) => {
    setSelectedIssue(issue);
    setShowOptions(true);

    const user = auth.currentUser;
    if (user) {
      try {
        const issueCollection = collection(db, issue.replace(/ /g, ""));
        await addDoc(issueCollection, {
          userId: user.uid,
          userName: user.displayName || "Anonymous",
          userEmail: user.email || "",
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Error saving issue selection:", error);
      }
    }
  };

  const handleGroupIndividualSelection = async (choice) => {
    if (choice === "group") {
      const user = auth.currentUser;
      if (user) {
        try {
          const issueCollection = collection(db, selectedIssue.replace(/ /g, ""));
          const q = query(issueCollection, where("userId", "!=", user.uid));
          const snapshot = await getDocs(q);
          const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setGroupMembers(users);
          setShowGroupList(true);
        } catch (error) {
          console.error("Error fetching group members:", error);
        }
      }
    } else {
      navigate("/contact-counsellor-form", { 
        state: { 
          selectedIssue,
          isGroup: false,
          groupMembers: [] 
        } 
      });
    }
  };

  const handleGroupMemberSelection = (user) => {
    setSelectedGroupMembers(prev => 
      prev.includes(user.userId) 
        ? prev.filter(id => id !== user.userId) 
        : [...prev, user.userId]
    );
  };

  const handleGroupFormation = () => {
    navigate("/contact-counsellor-form", { 
      state: { 
        selectedIssue,
        isGroup: true,
        groupMembers: selectedGroupMembers 
      } 
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-r from-[#F7CFD8] to-[#A6F1E0]">
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      <StudNavbar />

      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-6">
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

          {showGroupList && (
            <Card>
              <h2 className="text-2xl font-bold text-[#73C7C7] mb-6">Select users to form a group:</h2>
              <div className="space-y-4">
                {groupMembers.length > 0 ? (
                  <>
                    {groupMembers.map((user) => (
                      <div key={user.id} className="flex items-center gap-4">
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
                      disabled={selectedGroupMembers.length === 0}
                      className={`${selectedGroupMembers.length === 0 ? 'bg-gray-400' : 'bg-[#73C7C7] hover:bg-[#A6F1E0]'} text-white hover:text-black`}
                    >
                      {selectedGroupMembers.length > 0 
                        ? `Group with ${selectedGroupMembers.length} users` 
                        : 'Select at least one user'}
                    </Button>
                  </>
                ) : (
                  <p className="text-center py-4">No other users available for this issue</p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCounsellor;