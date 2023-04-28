import React, { useState } from "react";
import { firebase } from "./firebase";

const AddNews = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const newsRef = firebase.firestore().collection("news");
    const newNews = {
      title: title,
      description: description,
    };
    newsRef
      .add(newNews)
      .then(() => {
        setTitle("");
        setDescription("");
        console.log("News added successfully!");
      })
      .catch((error) => {
        console.error("Error adding news: ", error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <br />
        <button type="submit">Add News</button>
      </form>
    </div>
  );
};

export default AddNews;
