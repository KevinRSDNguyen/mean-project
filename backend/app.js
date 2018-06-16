const express = require("express");
const app = express();

app.use("/api/posts", (req, res, next) => {
  const posts = [
    { id: "sdsf", title: "First server side post", content: "Meow" },
    { id: "sdczxcsf", title: "2nd server side post", content: "Moo" }
  ];
  res.status(200).json({
    message: "Posts fetched successfully",
    posts
  });
});

module.exports = app;
