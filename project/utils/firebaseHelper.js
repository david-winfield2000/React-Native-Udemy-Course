import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
    // Import the functions you need from the SDKs you need

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyAHBxuVV_SbGCiHFL3KZX0MXt9ZrTKcLLk",
        authDomain: "whatsapp-fdf05.firebaseapp.com",
        projectId: "whatsapp-fdf05",
        storageBucket: "whatsapp-fdf05.appspot.com",
        messagingSenderId: "934136875584",
        appId: "1:934136875584:web:8115d4eed3cc0dfe88ada5",
        measurementId: "G-5FXK9J4P4H",
    };

    // Initialize Firebase
    return initializeApp(firebaseConfig);
};
