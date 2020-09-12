import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Avatar, IconButton } from "@material-ui/core";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import SendIcon from "@material-ui/icons/Send";
import db from "./firebase";
import "./Chat.css";
import axios from "./axios";
import { useStateValue } from "./StateProvider";
function Chat({ messages }) {
  const [text, setText] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [firebasemessages, setFirebaseMessages] = useState([]);
  const [{ user }] = useStateValue();
  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setFirebaseMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  // use with mongodp api
  // const sendMessage = async (e) => {
  //   e.preventDefault();
  //   await axios.post("messages/new", {
  //     message: text,
  //     name: "celes",
  //     timestamp: new Date().toDateString(),
  //     received: true,
  //   });
  //   setText("");
  // };
  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("rooms").doc(roomId).collection("messages").add({
      name: user.displayName,
      message: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setText("");
  };
  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__headerLeft">
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
          <div className="chat__headerInfo">
            <h2>{roomName}</h2>
            <p className="chat__timestamp">
              {new Date(
                firebasemessages[
                  firebasemessages.length - 1
                ]?.timestamp?.toDate()
              ).toDateString()}
            </p>
          </div>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {firebasemessages.map((message) => (
          <p
            key={Math.random()}
            // ${message.received && "chat__reciever"} use this with mongoose
            className={`chat__message ${
              message.name == user.displayName && "chat__reciever"
            } `}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <IconButton>
          <EmojiEmotionsIcon />
        </IconButton>
        <div className="chat__footerSearch">
          <form className="chat__searchContainer">
            <input
              type="text"
              placeholder="Type a message"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" onClick={sendMessage}>
              Send a message
            </button>
          </form>
        </div>
        <IconButton>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
