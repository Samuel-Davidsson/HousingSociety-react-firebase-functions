const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

admin.initializeApp();

const firebaseConfig = {
      //Insert config here!
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

const IsEmpty = (string) => {
  if(string.trim() === "") return true;
  else return false;
}

const IsEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email.match(emailRegEx)) return true;
  else return false;
}

app.post("/signup", (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        handle: req.body.handle
    };
    let errors = {};
    if(IsEmpty(newUser.email)) {
      errors.email = "Email can´t be empty";
    }
    else if(!IsEmail(newUser.email)) {
      errors.email = "Must be a valid email address";
    }

    if(IsEmpty(newUser.password)) errors.password = "Must not be empty";
    if(newUser.password !== newUser.confirmpassword) errors.confirmpassword = "Passwords must match";
    if(IsEmpty(newUser.handle)) errors.handle = "Must not be empty";

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

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

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  let errors = {};

  if(IsEmpty(user.email)) errors.email = "Must not be empty";
  if(IsEmpty(user.password)) errors.password = "Must not be empty";

  if(Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(data => {
    return data.user.getIdToken();
  })
  .then(token => {
    return res.json({token})
  })
  .catch(err => {
    console.error(err);
    if(err.code = "auth/wrong-password") {
      return res.status(403).json({general: "Wrong credentials, please try again."})
    }
    return res.status(500).json({errors: err.code});
  })
})

exports.api = functions.region("europe-west1").https.onRequest(app);
