import { Avatar } from "@material-ui/core";
import React from "react";
import "./User.css";

function User({ id, name, photo, selected, onClick }) {
  const isSelected = id === selected.id;
  return (
    <div className={isSelected ? `user selected` : `user`} onClick={onClick}>
      <Avatar className="user__photo" src={photo} />
      <div className="user__name">
        <h4>{name}</h4>
      </div>
    </div>
  );
}

export default User;
