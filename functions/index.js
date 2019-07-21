const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");
const { getAllPosts, addPost } = require("./handlers/posts")
const {signup, login} = require("./handlers/users");

app.get("/posts", getAllPosts);
app.post("/post", FBAuth, addPost);

app.post("/login", login);
app.post("/signup", signup);
// app.post("/user/image", FBAuth, uploadImage);

exports.api = functions.region("europe-west1").https.onRequest(app);
