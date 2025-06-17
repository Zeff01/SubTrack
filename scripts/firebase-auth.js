import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase.js";

// Posts new user to Firebase (NOTE: TEMPORARY VARIABLES [email, password] ARE USED, PLEASE REPLACE.)
export async function createUser() {
	const email = "testuser@example.com";
	const password = "testpassword";

	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		console.log("User successfully created: ", userCredential.user);
	} catch (error) {
		console.error(
			"Something wrong happened while creating user: ",
			error.message,
		);
	}
}

// Authenticates user via Firebase (NOTE: TEMPORARY VARIABLES [email, password] ARE USED, PLEASE REPLACE.)
export async function authenticateUser() {
	const email = "testuser@example.com";
	const password = "testpassword";

	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);
		console.log("User authentication done: ", userCredential.user);
	} catch (error) {
		console.error(
			"Something wrong happened while authenticating user: ",
			error.message,
		);
	}
}

// Testing Scripts, uncomment to test code.
// (async () => {
// 	await createUser();
// 	await authenticateUser();
// })();
