import * as Notifications from "expo-notifications";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  query as firestore_query,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import {
  DateInfo,
  Notification,
  ServiceResponse,
  Subscription,
} from "../types";

interface UserData {
  email: string;
  username: string;
  uid: string;
  created_at?: string;
  updated_at?: string;
}

interface ProfileUpdateData {
  email?: string;
  username?: string;
  updated_at?: string;
}

interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, any>;
}

const getCurrentDateTime = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// User Management Functions
export const createDocumentUser = async (
  user_info: UserData
): Promise<ServiceResponse> => {
  try {
    const currentDateTime = getCurrentDateTime();
    const documentData = {
      ...user_info,
      created_at: currentDateTime,
      updated_at: currentDateTime,
    };

    const docRef = await addDoc(collection(db, "users"), documentData);
    return {
      success: true,
      message: "User document created successfully",
      data: { id: docRef.id, ...documentData },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create user document",
    };
  }
};

export const retrieveAllDocumentUser = async (): Promise<
  ServiceResponse<UserData[]>
> => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: UserData[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      users.push({ id: doc.id, ...doc.data() } as UserData);
    });

    return {
      success: true,
      data: users,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to retrieve users",
    };
  }
};

export const updateDocumentUser = async (
  docId: string,
  user_info: Partial<UserData>
): Promise<ServiceResponse> => {
  try {
    const docRef = doc(db, "users", docId);
    const currentDateTime = getCurrentDateTime();

    await updateDoc(docRef, {
      ...user_info,
      updated_at: currentDateTime,
    });

    return {
      success: true,
      message: "User document updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update user document",
    };
  }
};

export const updateDocumentUserProfileByUid = async (
  uid: string,
  user_info: ProfileUpdateData
): Promise<ServiceResponse> => {
  try {
    const q = firestore_query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    const userDoc = querySnapshot.docs[0];
    const currentDateTime = getCurrentDateTime();

    await updateDoc(userDoc.ref, {
      ...user_info,
      updated_at: currentDateTime,
    });

    return {
      success: true,
      message: "User profile updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update user profile",
    };
  }
};

export const deleteDocumentUser = async (
  docId: string
): Promise<ServiceResponse> => {
  try {
    await deleteDoc(doc(db, "users", docId));
    return {
      success: true,
      message: "User document deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete user document",
    };
  }
};

export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  try {
    const q = firestore_query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    return false;
  }
};

export const checkIfUsernameExists = async (
  username: string
): Promise<boolean> => {
  try {
    const q = firestore_query(
      collection(db, "users"),
      where("username", "==", username)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    return false;
  }
};

export const getUsernameByEmail = async (
  email: string
): Promise<string | null> => {
  try {
    if (!email) {
      throw new Error("Email is undefined or empty");
    }

    const q = firestore_query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().username || null;
    }

    return null;
  } catch (error) {
    return null;
  }
};

// Subscription Management Functions
export const createDocumentSubscription = async (
  subscription_info: Omit<Subscription, "id" | "created_at" | "updated_at">
): Promise<ServiceResponse> => {
  try {
    const currentDateTime = getCurrentDateTime();
    const documentData = {
      ...subscription_info,
      created_at: currentDateTime,
      updated_at: currentDateTime,
    };

    const docRef = await addDoc(collection(db, "subscriptions"), documentData);
    return {
      success: true,
      message: "Subscription created successfully",
      data: { id: docRef.id, ...documentData },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create subscription",
    };
  }
};

export const retrieveAllDocumentSubscription = async (): Promise<
  ServiceResponse<Subscription[]>
> => {
  try {
    const querySnapshot = await getDocs(collection(db, "subscriptions"));
    const subscriptions: Subscription[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      subscriptions.push({ id: doc.id, ...doc.data() } as Subscription);
    });

    return {
      success: true,
      data: subscriptions,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to retrieve subscriptions",
    };
  }
};

export const retrieveAllDocumentSubscriptionSpecificUser = async (
  user_id: string
): Promise<ServiceResponse<Subscription[]>> => {
  try {
    const q = firestore_query(
      collection(db, "subscriptions"),
      where("uid", "==", user_id)
    );
    const querySnapshot = await getDocs(q);
    const subscriptions: Subscription[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      subscriptions.push({ id: doc.id, ...doc.data() } as Subscription);
    });

    return {
      success: true,
      data: subscriptions,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to retrieve user subscriptions",
    };
  }
};

export const retrieveAllDocumentSubscriptionMonthlySpecificUser = async (
  user_id: string,
  date_info: DateInfo
): Promise<ServiceResponse<Subscription[]>> => {
  try {
    const q = firestore_query(
      collection(db, "subscriptions"),
      where("user_id", "==", user_id)
    );
    const querySnapshot = await getDocs(q);
    const subscriptions: Subscription[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      const [day, month, year] = data.due_date.split("/").map(Number);

      if (month === date_info.month && year === date_info.year) {
        subscriptions.push({ id: doc.id, ...data } as Subscription);
      }
    });

    return {
      success: true,
      data: subscriptions,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to retrieve monthly subscriptions",
    };
  }
};

export const retrieveSpecificDocumentSubscriptionSpecificUser = async (
  user_id: string,
  doc_id: string
): Promise<ServiceResponse<Subscription[]>> => {
  try {
    const docRef = doc(db, "subscriptions", doc_id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: "Subscription not found.",
        data: [],
      };
    }

    const data = docSnap.data();

    if (data.uid !== user_id) {
      return {
        success: false,
        message: "Subscription does not belong to this user.",
        data: [],
      };
    }

    return {
      success: true,
      message: "Subscription document retrieved successfully.",
      data: [{ id: docSnap.id, ...data } as Subscription],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to retrieve subscription.",
      data: [],
    };
  }
};

export const updateDocumentSubscription = async (
  docId: string,
  subscription_info: Partial<Subscription>
): Promise<ServiceResponse> => {
  try {
    const docRef = doc(db, "subscriptions", docId);
    const currentDateTime = getCurrentDateTime();

    await updateDoc(docRef, {
      ...subscription_info,
      updated_at: currentDateTime,
    });

    return {
      success: true,
      message: "Subscription updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update subscription",
    };
  }
};

export const deleteDocumentSubscription = async (
  docId: string
): Promise<ServiceResponse> => {
  try {
    await deleteDoc(doc(db, "subscriptions", docId));
    return {
      success: true,
      message: "Subscription deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete subscription",
    };
  }
};

// Notification Management Functions
export const schedulePushNotification = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const reminderDates = await getSubscriptionDateTrigger();

    const now = new Date();
    const todayString = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // Remove duplicates
    const uniqueDates = Array.from(new Set(reminderDates));

    for (const reminderDate of uniqueDates) {
      let triggerDate: Date;

      if (reminderDate === todayString) {
        triggerDate = new Date(Date.now() + 5000);
      } else {
        const [year, month, day] = reminderDate.split("-").map(Number);
        const potentialTrigger = new Date(year, month - 1, day, 9, 0, 0);

        triggerDate =
          potentialTrigger < now
            ? new Date(Date.now() + 5000)
            : potentialTrigger;
      }

      const bodyMessage =
        reminderDate === todayString
          ? "You have a subscription due today!"
          : `Upcoming subscription due on ${reminderDate}`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Subscription Reminder",
          body: bodyMessage,
          data: { reminderDate },
        },
        trigger: { type: "date", date: triggerDate },
      });
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message ?? "Failed to schedule notification",
    };
  }
};
