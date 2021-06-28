import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect } from "react";
import "./Chat.css";
import ImageIcon from "@material-ui/icons/Image";
import { Add, Mic } from "@material-ui/icons";
import { useSelector } from "react-redux";
import {
  selectChatId,
  selectChatName,
  selectChatPhoto,
} from "./features/chatSlice";
import { selectUser } from "./features/userSlice";
import db from "./firebase";
import firebase from "firebase";
import Message from "./components/Message";
import FlipMove from "react-flip-move";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import AddMember from "./AddMember";
import MenuIcon from "@material-ui/icons/Menu";

function Chat({ expand }) {
  const chatName = useSelector(selectChatName);
  const chatId = useSelector(selectChatId);
  const chatPhoto = useSelector(selectChatPhoto);
  const user = useSelector(selectUser);
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    db.collection("rooms")
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );

        scrollToBottom();
      });
  }, [chatId]);

  const sendMessage = (e) => {
    e.preventDefault();

    let ref = db.collection("rooms").doc(chatId);

    db.collection("rooms")
      .doc(chatId)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
        photo: user.photo,
        name: user.displayName,
        email: user.email,
        msg: message,
      })
      .then((result) => {
        ref.update({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
      .catch((error) => alert(error.message));

    setMessage("");
  };

  const scrollToBottom = () => {
    const element = document.getElementById("message_list");
    //element.scrollIntoView({ behavior: "smooth" });
    element.scrollTop = element.scrollHeight;
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__user">
          <IconButton onClick={expand} className="sidebar__btn">
            <MenuIcon />
          </IconButton>

          <AvatarGroup>
            {chatPhoto?.map((photo, index) => {
              return <Avatar key={index} src={photo} />;
            })}
          </AvatarGroup>
          <h4>To: {chatName}</h4>
        </div>
        <IconButton
          disabled={chatId !== " " ? false : true}
          onClick={() => setOpen(true)}
        >
          <Add />
        </IconButton>
        <strong>Details</strong>
      </div>

      {open ? (
        <AddMember open={open} handleClose={() => setOpen(false)} />
      ) : (
        <> </>
      )}

      {/* Chat messages */}
      <div className="chat__messages" id="message_list">
        <FlipMove typeName={null}>
          {messages.map((message, index) => {
            return <Message key={index} contents={message.data} />;
          })}
        </FlipMove>
      </div>

      {/* Chat input */}
      <div className="chat__input">
        <form>
          <IconButton>
            <ImageIcon />
          </IconButton>
          <IconButton>
            <Mic />
          </IconButton>
          <input
            type="text"
            placeholder="Type message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            disabled={chatName === " " ? true : false}
          />
          <button className="send" onClick={sendMessage}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
