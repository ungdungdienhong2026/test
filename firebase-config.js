const firebaseConfig = {
    apiKey: "AIzaSyALPhwyX453PM31RPyg3ltYYdj46fiMS2A",
    authDomain: "mealapp-web.firebaseapp.com",
    projectId: "mealapp-web",
    storageBucket: "mealapp-web.firebasestorage.app",
    messagingSenderId: "333887687193",
    appId: "1:333887687193:web:711bec27c32ecf8765f888"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Khởi tạo kết nối tới Firestore
const db = firebase.firestore();
