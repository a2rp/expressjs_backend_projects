const { applicationDefault, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({ credential: applicationDefault() });

const db = getFirestore();
const usersDB = db.collection("users");

module.exports = { db, usersDB };

