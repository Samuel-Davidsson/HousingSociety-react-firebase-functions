const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");
const { getAllPosts, addPost, getPost, commentOnPost, likePost, unlikePost, deletePost } = require("./handlers/posts")
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require("./handlers/users");

app.get("/posts", getAllPosts);
app.get("/post/:postId", getPost);
app.get("/post/:postId/like", FBAuth, likePost);
app.get("/post/:postId/unlike", FBAuth, unlikePost);
app.post("/post", FBAuth, addPost);
app.post("/post/:postId/comment", FBAuth, commentOnPost);
app.delete("/post/:postId", FBAuth, deletePost);

app.post("/login", login);
app.post("/signup", signup);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser)

exports.api = functions.region("europe-west1").https.onRequest(app);
