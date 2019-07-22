const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");
const { getAllPosts, addPost, getPost, commentOnPost } = require("./handlers/posts")
const {signup, login, uploadImage, addUserDetails, getAuthenticatedUser} = require("./handlers/users");

app.get("/posts", getAllPosts);
app.get("/post/:postId", getPost);
app.post("/post", FBAuth, addPost);
app.post("/post/:postId/comment", FBAuth, commentOnPost);
//TODO delete
//TODO like a post
//TODO unlike a post


app.post("/login", login);
app.post("/signup", signup);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser)

exports.api = functions.region("europe-west1").https.onRequest(app);
