import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	UserCredential,
} from "firebase/auth";
import { auth } from "../config/firebase";

// Posts new user to Firebase.
export async function createUser(
	email: string,
	password: string,
): Promise<
	| { success: true; user: UserCredential["user"] }
	| { success: false; error: string }
> {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		console.log("User successfully created: ", userCredential.user);
		return { success: true, user: userCredential.user };
	} catch (error: any) {
		console.error("Error creating user:", error.message);
		return { success: false, error: error.message };
	}
}

// Authenticates user via Firebase.
export async function authenticateUser(
	email: string,
	password: string,
): Promise<
	| { success: true; user: UserCredential["user"] }
	| { success: false; error: string }
> {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);
		console.log("User authentication done: ", userCredential.user);
		return { success: true, user: userCredential.user };
	} catch (error: any) {
		console.error("Error authenticating user:", error.message);
		return { success: false, error: error.message };
	}
}

// Testing Scripts, uncomment all to test code (Reminder: Please change [emailTest, passwordTest] before running test script).
// const emailTest = "testuser@example.com";
// const passwordTest = "testpassword";
// (async () => {
// 	await createUser(emailTest, passwordTest);
// 	await authenticateUser(emailTest, passwordTest);
// })();
