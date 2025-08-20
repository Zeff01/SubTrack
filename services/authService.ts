import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  signOut,
  updateEmail,
  sendEmailVerification,
  User
} from "firebase/auth";
import { createDocumentUser, checkIfUsernameExists, updateDocumentUserProfileByUid } from "./userService";
import { auth } from "../config/firebase";
import { AuthResponse, ServiceResponse } from "../types";

interface ProfileInfo {
  email?: string;
  username?: string;
}

interface RegisterInfo {
  email: string;
  password: string;
  username: string;
}

interface LoginInfo {
  email: string;
  password: string;
}

export const changeProfile = async (current_user: User | null, user_info: ProfileInfo): Promise<ServiceResponse> => {
  try {
    const user = auth.currentUser;

    if (!current_user || !user) {
      throw new Error("No authenticated user found.");
    }

    await updateDocumentUserProfileByUid(current_user.uid, user_info);
    //await updateEmail(user, user_info.email);
    //await signOut(auth);

    return {
      success: true,
      message: "Profile successfully updated.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update profile.",
    };
  }
};

export const changePassword = async (current_user: User | null, newPassword: string): Promise<ServiceResponse> => {
  try {
    const user = auth.currentUser;

    if (!current_user || !user) {
      throw new Error("No authenticated user found.");
    }

    await updatePassword(user, newPassword);
    await signOut(auth);

    return {
      success: true,
      message: "Password successfully updated. Please log in again.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update password.",
    };
  }
};

export const registerUser = async (user_info: RegisterInfo): Promise<AuthResponse> => {
  try {
    // Check if the username already exists
    const usernameExists = await checkIfUsernameExists(user_info.username);
    if (usernameExists) {
      throw new Error("Username already exists. Please choose a different username.");
    }

    // Firebase user creation
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      user_info.email, 
      user_info.password
    );

    if (userCredential.user) {
      // Create user profile in Firestore
      const userData = {
        email: user_info.email,
        username: user_info.username,
        uid: userCredential.user.uid,
      };

      // Create user document in Firestore
      await createDocumentUser(userData);
      await signOut(auth);
    }

    return { 
      success: true, 
      message: 'User successfully registered',
      data: userCredential.user
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Registration failed due to a network or server error.",
    };
  }
};

export const loginUser = async ({ email, password }: LoginInfo): Promise<AuthResponse> => {
  try {
    // Debug log to see what's received
    //console.log('authService received:', { email, password: !!password });
    
    // Validate inputs before sending to Firebase
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }
    if (!password) {
      throw new Error('Password is required');
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { 
        success: true, 
        message: 'User successfully logged in',        
        data: userCredential.user 
    };
  } catch (error: any) {
    console.log('Firebase auth error:', error);
    return {
        success: false,
        error: error.message || "Login failed due to a network or server error.",
    };
  }
};

// Aliases for backward compatibility
export const createUser = registerUser;
export const authenticateUser = loginUser;

// Test credentials have been removed - do not add test data in production files