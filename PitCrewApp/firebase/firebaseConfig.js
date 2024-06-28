import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCNBbeSAjEotRaCHU8_XXTnZI4nmvvzoTo",
  authDomain: "pitcrew-3e592.firebaseapp.com",
  databaseURL: 'https://console.firebase.google.com/u/0/project/pitcrew-3e592/firestore/databases/-default-/data/~2F',
  projectId: "pitcrew-3e592",
  storageBucket: "pitcrew-3e592.appspot.com",
  messagingSenderId: "1:212460218817:android:d10a339265e45ee4dd2740",
  appId: "1:212460218817:android:d10a339265e45ee4dd2740",
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export { firebase };