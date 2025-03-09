const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Load the JSON file

// Initialize Firebase Admin SDK with explicit credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const setAdminRole = async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: "admin" });

    console.log(`${email} is now an admin.`);
  } catch (error) {
    console.error("Error setting admin role:", error);
  }
};

// Replace with your admin's email
setAdminRole("admin@gmail.com");
