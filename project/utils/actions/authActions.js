import { getFirebaseApp } from "../firebaseHelper";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { child, getDatabase, set, ref } from "firebase/database";
import { async } from "validate.js";
import { authenticate, logout } from "../../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "./userActions";

let timer;

export const signUp = (firstName, lastName, email, password) => {
    return async (dispatch) => {
        const app = getFirebaseApp();
        const auth = getAuth(app);

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const { uid, stsTokenManager } = result.user;
            const { accessToken, expirationTime } = stsTokenManager;

            const userData = await createUser(firstName, lastName, email, uid);

            dispatch(authenticate({ token: accessToken, userData }));

            const expirationDate = new Date(expirationTime);
            const timeNow = new Date();
            const millisecondsUntilExpiration = expirationDate - timeNow;

            saveDataToStorage(accessToken, uid, expirationDate);

            timer = setTimeout(() => {
                dispatch(userLogout());
            }, millisecondsUntilExpiration);
        } catch (error) {
            const errorCode = error.code;

            let message = "Something went wrong.";

            if (errorCode === "auth/email-already-in-use") {
                message = "This email is already in use";
            }

            throw new Error(message);
        }
    };
};

export const signIn = (email, password) => {
    return async (dispatch) => {
        const app = getFirebaseApp();
        const auth = getAuth(app);

        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const { uid, stsTokenManager } = result.user;
            const { accessToken, expirationTime } = stsTokenManager;

            const userData = await getUserData(uid);

            dispatch(authenticate({ token: accessToken, userData }));

            const expirationDate = new Date(expirationTime);
            const timeNow = new Date();
            const millisecondsUntilExpiration = expirationDate - timeNow;

            saveDataToStorage(accessToken, uid, expirationDate);

            timer = setTimeout(() => {
                dispatch(userLogout());
            }, millisecondsUntilExpiration);
        } catch (error) {
            const errorCode = error.code;

            let message = "Something went wrong.";

            if (
                errorCode === "auth/wrong-password" ||
                errorCode === "auth/user-not-found"
            ) {
                message = "The username or password was incorrect";
            }

            throw new Error(message);
        }
    };
};

export const userLogout = () => {
    return async (dispatch) => {
        AsyncStorage.clear();
        clearTimeout(timer);
        dispatch(logout());
    };
};

const createUser = async (firstName, lastName, email, userId) => {
    const firstLast = `${firstName} ${lastName}`.toLowerCase();
    const userData = {
        firstName,
        lastName,
        firstLast,
        email,
        userId,
        signUpDate: new Date().toISOString(),
    };

    const dbRef = ref(getDatabase());
    const childRef = child(dbRef, `users/${userId}`);
    await set(childRef, userData);

    return userData;
};

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
        "userData",
        JSON.stringify({
            token,
            userId,
            expirationDate: expirationDate.toISOString(),
        })
    );
};
