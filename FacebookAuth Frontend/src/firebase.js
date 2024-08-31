import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyIph6DQSOU6qG65TKGV2FoEzRc59EXtc",
  authDomain: "facebook-login-9fe7b.firebaseapp.com",
  projectId: "facebook-login-9fe7b",
  storageBucket: "facebook-login-9fe7b.appspot.com",
  messagingSenderId: "196590145137",
  appId: "1:196590145137:web:55fa1d769ef874952f15d0",
  measurementId: "G-ZHDZ04854T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new FacebookAuthProvider();
provider.addScope("public_profile");
provider.addScope("pages_read_engagement");
provider.addScope("pages_read_user_content");

export { auth, provider, signInWithPopup, FacebookAuthProvider };
