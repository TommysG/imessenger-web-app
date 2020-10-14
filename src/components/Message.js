import { Avatar } from "@material-ui/core";
import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import "./Message.css";

const Message = forwardRef(
  ({ id, contents: { msg, timestamp, email, photo, uid } }, ref) => {
    const user = useSelector(selectUser);

    return (
      <div
        ref={ref}
        className={`chat__message ${
          user.email === email && "chat__message__sender"
        }`}
      >
        <Avatar className="chat__message__photo" src={photo} />
        <p>{msg}</p>
        <small>{new Date(timestamp?.toDate()).toLocaleString()}</small>
      </div>
    );
  }
);

export default Message;
