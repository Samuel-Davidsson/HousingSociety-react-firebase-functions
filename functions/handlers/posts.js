const { db } = require("../util/admin");

exports.getAllPosts = (req, res) => {
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
               createdAt: doc.data().createdAt,
               commentCount: doc.data().commentCount,
               likeCount: doc.data().likeCount
           });
       });
       return res.json(posts);
   })
   .catch((err) => {
    console.err(err);
    res.status(500).json({error: err.code});
   });
};

exports.addPost =  (req, res) => {
    if(req.body.body.trim() === "") {
      return res.status(400).json({body: "Body must not be empty."})
    } 
      const newPost = {
          body: req.body.body,
          userHandle: req.user.handle,
          createdAt: new Date().toISOString()
      };
  
      db    
      .collection("posts")
      .add(newPost)
      .then(doc => {
         return res.json({message: `document ${doc.id} created successfully!`})
      })
      .catch((err) => {
          res.status(500).json({error: "Something went wrong"});
      });
  };
  