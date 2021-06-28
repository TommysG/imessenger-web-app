import { Avatar } from "@material-ui/core";
import React, { forwardRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setChat } from "./features/chatSlice";
import db from "./firebase";
import "./SideMessage.css";
import * as timeago from "timeago.js";
import AvatarGroup from "@material-ui/lab/AvatarGroup";

const Message = forwardRef(({ id, chatName, photo, members, close }, ref) => {
  const dispatch = useDispatch();
  const [chatInfo, setChatInfo] = React.useState([]);

  useEffect(() => {
    db.collection("rooms")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        setChatInfo(snapshot.docs.map((doc) => doc.data()));
      });
  }, [id]);

  return (
    <div
      ref={ref}
      className="message"
      onClick={() => {
        dispatch(
          setChat({
            chatName: chatName,
            chatId: id,
            chatPhoto: photo,
            chatMembers: members,
          })
        );

        close();
      }}
    >
      <div className="message__avatar">
        <AvatarGroup max={2}>
          {photo.map((p, index) => {
            return <Avatar key={index} src={p} />;
          })}
        </AvatarGroup>
      </div>

      <div className="message__info">
        <h5>{chatName}</h5>
        <p>{chatInfo[chatInfo.length - 1]?.msg}</p>
        <small>
          {timeago.format(
            new Date(chatInfo[chatInfo.length - 1]?.timestamp?.toDate())
          )}
        </small>
      </div>
    </div>
  );
});

export default Message;
