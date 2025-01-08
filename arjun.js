const express = require('express');
const admin = require('firebase-admin');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./path/to/your/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://promptx466.firebaseio.com"  // Your Firebase Realtime Database URL
});

const auth = admin.auth();
const db = admin.database();
const ref = db.ref("users");

app.post('/verifyLogin', (req, res) => {
  const { idToken } = req.body;
  if (idToken) {
    auth.verifyIdToken(idToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        console.log("User ID:", uid);

        ref.child(uid).once("value", function(snapshot) {
          if (snapshot.exists()) {
            console.log("User data:", snapshot.val());
            res.status(200).json({ message: "Login verified successfully!" });
          } else {
            res.status(404).json({ message: "User not found in the database" });
          }
        });
      })
      .catch((error) => {
        console.error("Error verifying ID token:", error);
        res.status(401).json({ message: "Unauthorized" });
      });
  } else {
    res.status(400).json({ message: "ID token missing" });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
