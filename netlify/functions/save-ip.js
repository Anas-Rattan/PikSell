// netlify/functions/save-ip.js
const admin = require("firebase-admin");

// Firebase Admin SDK setup
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    // Visitor IP from headers
    const ip =
      event.headers["x-nf-client-connection-ip"] || "unknown";

    // Save to Firestore
    await db.collection("visitors").add({
      ip: ip,
      timestamp: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "IP saved", ip }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
