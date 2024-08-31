import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new FacebookAuthProvider();
provider.addScope("public_profile");
provider.addScope("pages_read_engagement");
provider.addScope("pages_read_user_content");

export { auth, provider, signInWithPopup, FacebookAuthProvider };
