import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createDocumentUser } from "./userService.js";
import { auth } from "../config/firebase.js";





export const createUser = async (user_info) => {
  try {
   const userCredential = await createUserWithEmailAndPassword(
		auth,
		user_info.email,
		user_info.password,
	);

    const user = userCredential.user;

    const pass_user_info = {
        uid: user.uid,
        email: user.email,
        name: user_info.name,
        phone: user_info.phone,
    };

    const data = await createDocumentUser(pass_user_info);

    return { 
        success: true,
        message: 'Registration successful! Welcome aboard.',
        data: userCredential.user 
    };
  } catch (error) {
        console.log(error)

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
