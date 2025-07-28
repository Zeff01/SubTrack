import { addDoc, collection, deleteDoc, doc, getDocs, getDoc, updateDoc, query as firestore_query, where  } from "firebase/firestore";
import { db } from "../config/firebase.js";


const getCurrentDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months start at 0
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


export const getUsernameByEmail = async (email) => {
  try {
    const usersCol = collection(db, "users");
    const q = firestore_query(usersCol, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      return {
        success: true,
        username: userData.username || null, // or userData.username depending on your schema
        message: "Email exists and username retrieved.",
      };
    }

    return {
      success: false,
      username:  null, // or userData.username depending on your schema
      message: "No user found with this email.",
    };
  } catch (error) {
    return {
      success: false,
      username:  null, // or userData.username depending on your schema
      error: error.message || "Failed due to a network or server error.",
    };
  }
};


export const checkIfUsernameExists = async (username) => {
  try {
    const usersCol = collection(db, "users");
    const q = firestore_query(usersCol, where("username", "==", username));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return {
        success: true,
        message: "Username already exists.",
      };
    }

    return {
      success: false,
      message: "Username is available.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed due to a network or server error.",
    };
  }


};


export const retrieveSpecificDocumentSubscriptionSpecificUser = async (user_id, sub_id) => {
  try {
    const docRef = doc(db, "subscriptions", sub_id); // sub_id is document ID
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: "Subscription not found.",
        data: [],
      };
    }

    const docData = docSnap.data();

    // Check if the user_id matches
    if (docData.uid !== user_id) {
      return {
        success: false,
        message: "Subscription does not belong to this user.",
        data: [],
      };
    }

    return {
      success: true,
      message: "Subscription document retrieved successfully.",
      data: [{ id: docSnap.id, ...docData }],
    };
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    return {
      success: false,
      error: error.message || "Failed due to a network or server error.",
    };
  }
};



export const retrieveAllDocumentSubscriptionSpecificUser = async (user_id) => {
  try {
    const subscriptionsCol = collection(db, "subscriptions");
    const q = firestore_query(subscriptionsCol, where("uid", "==", user_id));
    const subscriptionsSnapshot = await getDocs(q);

    const data = [];

    if (subscriptionsSnapshot.empty) {
      return {
        success: false,
        message: "No subscriptions found.",
        data: [],
      };
    }

    subscriptionsSnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      success: true,
      message: "All documents successfully retrieved.",
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed due to a network or server error.",
    };
  }
};

export const retrieveAllDocumentSubscription = async () => {
  try {
    const subscriptionsCol = collection(db, "subscriptions");
    const subscriptionsSnapshot = await getDocs(subscriptionsCol);
    const data = [];

    if (subscriptionsSnapshot.empty) {
      return {
        success: false,
        message: "No subscriptions found.",
        data: [],
      };
    }

    subscriptionsSnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(), // merge document fields
      });
    });

    return { 
        success: true,
        message: 'All document successfully retrieved.',
        data: data
    };
  } catch (error) {
    return {
        success: false,
        error: error.message || "Failed due to a network or server error.",
    };
  }
};

export const retrieveAllDocumentUser = async () => {
  try {
    const usersCol = collection(db, "users");
    const usersSnapshot = await getDocs(usersCol);
    const data = [];

    if (usersSnapshot.empty) {
      return {
        success: false,
        message: "No users found.",
        data: [],
      };
    }

    usersSnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(), // merge document fields
      });
    });

    return { 
        success: true,
        message: 'All document successfully retrieved.',
        data: data
    };
  } catch (error) {
    return {
        success: false,
        error: error.message || "Failed due to a network or server error.",
    };
  }
};


export const createDocumentNotification = async (notification_info) => {
  try {
    const notification = await addDoc(collection(db, "notifications"), {
      title: notification_info.title,
      message: notification_info.message,
      date: notification_info.date,
      is_read: notification_info.is_read,
      id: notification_info.id,
      uid: notification_info.uid,
      created_at: getCurrentDateTime()
    });

    return { 
        success: true,
        message: 'Document successfully created.',
        data: notification
    };
  } catch (error) {
    return {
        success: false,
        error: error.message || "Failed due to a network or server error.",
    };
  }
};


export const createDocumentSubscription = async (subscription_info) => {
  try {
    const user = await addDoc(collection(db, "subscriptions"), {
      uid: subscription_info.uid,
      app_name: subscription_info.app_name,
      cost: subscription_info.cost,
      due_date: subscription_info.due_date,
      cycle: subscription_info.cycle,
      remind_me: subscription_info.remind_me,
      selected_color: subscription_info.selected_color,
      payment_status: subscription_info.payment_status,
      created_at: getCurrentDateTime()
    });

    return { 
        success: true,
        message: 'Document successfully created.',
        data: user
    };
  } catch (error) {
    return {
        success: false,
        error: error.message || "Failed due to a network or server error.",
    };
  }
};

export const createDocumentUser = async (user_info) => {
  try {
    const user = await addDoc(collection(db, "users"), {
      uid: user_info.uid,
      email: user_info.email,
      username: user_info.username,
    });

    return { 
        success: true,
        message: 'Document successfully created.',
        data: user
    };
  } catch (error) {
    return {
        success: false,
        error: error.message || "Failed due to a network or server error.",
    };
  }
};



export const updateDocumentSubscription = async (docId, subscription_info) => {
  try {
    const docRef = doc(db, "subscriptions", docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: `Document with ID "${docId}" does not exist.`,        
        data: []
      };
    }

    await updateDoc(docRef, {
      app_name: subscription_info.app_name,
      cost: subscription_info.cost,
      due_date: subscription_info.due_date,
      cycle: subscription_info.cycle,
      remind_me: subscription_info.remind_me,
      payment_status: subscription_info.payment_status,
      selected_color: subscription_info.selected_color,
    });

    return { 
        success: true,
        message: 'Document successfully updated.',
        data: []
    };
  } catch (error) {
    return {
        success: false,
        error: error.message || "Failed due to a network or server error.",
    };
  }
};


export const updateDocumentUserProfileByUid = async (uid, user_info) => {
  try {
    const usersCol = collection(db, "users");
    const q = firestore_query(usersCol, where("uid", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        success: false,
        message: `No user found with uid "${uid}".`,
        data: []
      };
    }

    // assuming uid is unique, take the first matching document
    const userDoc = snapshot.docs[0];
    const docRef = userDoc.ref;

    await updateDoc(docRef, {
     // email: user_info.email,
      username: user_info.username
    });


    return {
      success: true,
      message: "User profile successfully updated.",
      data: []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed due to a network or server error.",
    };
  }
};


export const updateDocumentUser = async (docId, user_info) => {
  try {
    const docRef = doc(db, "users", docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: `Document with ID "${docId}" does not exist.`,        
        data: []
      };
    }

    await updateDoc(docRef, {
      email: user_info.email,
      name: user_info.name,
      phone: user_info.phone,
    });

    //console.log("Document updated");

    return { 
        success: true,
        message: 'Document successfully updated.',
        data: []
    };
  } catch (error) {
    return {
        success: false,
        error: error.message || "Failed due to a network or server error.",
    };
  }
};



export const deleteDocumentSubscription = async (docId) => {
  try {
    const docRef = doc(db, "subscriptions", docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
     // console.log(`Document with ID "${docId}" does not exist.`)
      return {
        success: false,
        message: `Document with ID "${docId}" does not exist.`,
        data: [],
      };
    }
    await deleteDoc(docRef);

    return { 
        success: true,
        message: 'Document successfully deleted.',
        data: []
    };
  } catch (error) {
    return {
        success: false,
        error: error.message || "Failed due to a network or server error.",
    };
  }
};


export const deleteDocumentUser = async (docId) => {
  try {
    const docRef = doc(db, "users", docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: `Document with ID "${docId}" does not exist.`,
        data: [],
      };
    }
    await deleteDoc(docRef);

    return { 
        success: true,
        message: 'Document successfully deleted.',
        data: []
    };
  } catch (error) {
    return {
        success: false,
        error: error.message || "Failed due to a network or server error.",
    };
  }
};

(async () => {

  await retrieveSpecificDocumentSubscriptionSpecificUser("B463Tmk1WSSo2TyJm29ZH5c2MDg2", "bvKdVFEQ2sQuMrKBRY9i");
  // const date_info = {
  //   month: 6,
  //   year: 2025,
  // };

  //await retrieveAllDocumentSubscriptionMonthlySpecificUser('EYeFlZjKQKXBVdYUoPa1SooWa6t1', date_info);

    // const user_info = {
    // email: "pink21@example.com",
    // password: "password",
    // name: "Adrian Manatad",
    // phone: "123456789",
    // };

    // await authenticateUser({ auth, user_info });
   // await createUser(user_info);

 // await updateDocument('6UL0YX5VxDVF94GqiPRF', user_info);
  //await deleteDocument('uusyMnGwpkcQR1BtHpiL');
  //await retrieveAllDocumentUser();
 // await deleteDocumentUser('n8TF8aMcTHqWZZvVqLia');
 })();
