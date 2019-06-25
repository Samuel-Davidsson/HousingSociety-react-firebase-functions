const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

admin.initializeApp();

const firebaseConfig = {
    //Insert your config here
  };


const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get("/posts", (req, res) => {
     db
    .collection("posts")
    .orderBy("createdAt","desc")
    .get()
    .then(data => {
        let posts = [];
        data.forEach(doc => {
            posts.push({
                postId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            });
        });
        return res.json(posts);
    })
    .catch(err => console.error(err));
});

app.post("/post", (req, res) => {

    const newPost = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db    
    .collection("posts")
    .add(newPost)
    .then(doc => {
       return res.json({message: `document ${doc.id} created successfully!`})
    })
    .catch(err => {
        res.status(500).json({error: "Something went wrong"});
    })
});

app.post("/signup", (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        handle: req.body.handle
    };

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return res.status(400).json({ handle: 'this handle is already taken' });
        } else {
          return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
      })
      .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
      })
      .then((idToken) => {
        token = idToken;
        const userCredentials = {
          handle: newUser.handle,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
      })
      .then(() => {
        return res.status(201).json({ token });
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          return res.status(400).json({ email: 'Email is already is use' });
        } else {
          return res.status(500).json({ error: err.code });
        }
      });
});

exports.api = functions.region("europe-west1").https.onRequest(app);
