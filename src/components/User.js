 
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
});

const db = firebase.firestore();

// Function to create a new user and set their role
const createUserWithRole = async (email, password, role) => {
  try {
    // Create a new user with email and password
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Set custom claims for the user to indicate their role
    if (role === 'admin') {
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    } else if (role === 'journalist') {
      await admin.auth().setCustomUserClaims(user.uid, { journalist: true });
    }

    // Add the user to the "users" collection in Cloud Firestore
    await db.collection('users').doc(user.uid).set({ role });

    return user;
  } catch (error) {
    console.error(error);
  }
};

// Function to get the current user's role
const getUserRole = async () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const userDoc = await db.collection('users').doc(user.uid).get();
    return userDoc.data().role;
  }
};

// Function to check if the current user is an admin
const isAdmin = async () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims.admin === true;
  }
};
