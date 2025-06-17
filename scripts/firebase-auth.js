import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase.js";

// Posts new user to Firebase (NOTE: TEMPORARY VARIABLES [email, password] ARE USED, PLEASE REPLACE.)
async function createUser() {
	const email = "testuser2@example.com";
	const password = "testpassword123";

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
async function authenticateUser() {
	const email = "testuser2@example.com";
	const password = "testpassword123";

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

// Testing Scripts, uncomment to test code (Reminder: Change ).
// (async () => {
// 	await createUser();
// 	await authenticateUser();
// })();
