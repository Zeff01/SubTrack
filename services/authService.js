import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  signOut,
  updateEmail,
  sendEmailVerification
} from "firebase/auth";
import { createDocumentUser, checkIfUsernameExists, updateDocumentUserProfileByUid } from "./userService.js";
import { auth } from "../config/firebase.js";



export const changeProfile = async (current_user, user_info) => {
  try {
    const user = auth.currentUser;

    if (!current_user) {
      throw new Error("No authenticated user found.");
    }

    await updateDocumentUserProfileByUid(current_user.uid, user_info)
    //await updateEmail(user, user_info.email);
    //await signOut(auth);

    return {
      success: true,
      message: "Profile successfully updated.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to update profile.",
    };
  }
};


export const changePassword = async (current_user, newPassword) => {
  try {
    const user = auth.currentUser;

    if (!current_user) {
      throw new Error("No authenticated user found.");
    }

    await updatePassword(user, newPassword);
    await signOut(auth);

    return {
      success: true,
      message: "Password successfully updated.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to update password.",
    };
  }
};



export const createUser = async (user_info) => {
  try {
    const result = await checkIfUsernameExists(user_info.username);

    if (result.success) {
      return {
        success: false,
        error: result.message || "Registration failed due to username already exist.",
      };
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      user_info.email,
      user_info.password,
	  );

    const user = userCredential.user;

    const pass_user_info = {
        uid: user.uid,
        email: user.email,
        username: user_info.username
    };

    const data = await createDocumentUser(pass_user_info);

    return { 
        success: true,
        message: 'Registration successful! Welcome aboard.',
        data: userCredential.user 
    };
  } catch (error) {
    return {
        success: false,
        error: error.message || "Registration failed due to a network or server error.",
    };
  }
};

export const authenticateUser = async (user_info) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      user_info.email,
      user_info.password,
    );

    return { 
        success: true,
        message: 'User successfully logged in',        
        data: userCredential.user 
    };
  } catch (error) {
      console.log(error)
    return {
        success: false,
        error: error.message || "Login failed due to a network or server error.",
    };
  }
};


 //(async () => {

    // const user_info = {
    // email: "red32111@example.com",
    // password: "password",
    // name: "Adrian Manatad",
    // phone: "123456789",
    // };

    // await authenticateUser({ auth, user_info });
    //await createUser(auth, user_info);

 // await updateDocument('6UL0YX5VxDVF94GqiPRF', user_info);
  //await deleteDocument('uusyMnGwpkcQR1BtHpiL');
  //await readAllDocument();
 //})();
