// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",  // Replace with your Firebase API key
    authDomain: "YOUR_AUTH_DOMAIN",  // Replace with your Firebase Auth Domain
    projectId: "YOUR_PROJECT_ID",  // Replace with your Firebase Project ID
    storageBucket: "YOUR_STORAGE_BUCKET",  // Replace with your Firebase Storage Bucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace with your Firebase Messaging Sender ID
    appId: "YOUR_APP_ID"  // Replace with your Firebase App ID
  };
  
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Logged in successfully, get the ID token
        userCredential.user.getIdToken().then((idToken) => {
          // Send the ID token to the server
          fetch("/verifyLogin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken })
          })
          .then(response => response.json())
          .then(data => {
            console.log("Server response:", data);
            alert("Login successful!");
          })
          .catch(error => {
            console.error("Error sending ID token to server:", error);
          });
        });
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
      });
  });
  