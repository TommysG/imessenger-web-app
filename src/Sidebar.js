import React, { useEffect } from "react";
import "./Sidebar.css";
import SideMessage from "./SideMessage";
import { Avatar, IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import MessageIcon from "@material-ui/icons/Message";
import CloseIcon from "@material-ui/icons/Close";
import { selectUser } from "./features/userSlice";
import { useSelector } from "react-redux";
import db, { auth } from "./firebase";
import NewMessageDialog from "./NewMessageDialog";
import FlipMove from "react-flip-move";

function Sidebar({ close, side }) {
  const user = useSelector(selectUser);
  const [open, setOpen] = React.useState(false);
  const [rooms, setRooms] = React.useState([]);
  const [searchedMessage, setSearchedMessage] = React.useState("");

  useEffect(() => {
    db.collection("rooms")
      .where("ids", "array-contains", user.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnashot) => {
        setRooms(
          querySnashot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  }, [user.uid]);

  const handleChatName = (room) => {
    if (room.data.ids.length > 2) {
      return "Group";
    } else {
      if (user.displayName === room.data.participants[0].name) {
        return room.data.participants[1].name;
      } else {
        return room.data.participants[0].name;
      }
    }
  };

  const handleChatPhoto = (room) => {
    if (room.data.ids.length > 2) {
      let photos = [];

      room.data.participants
        .filter((par) => user.displayName !== par.name)
        .map((participant) => {
          return photos.push(participant.photo);
        });

      return photos;
    } else {
      if (user.photo === room.data.participants[0].photo) {
        return [room.data.participants[1].photo];
      } else {
        return [room.data.participants[0].photo];
      }
    }
  };

  return (
    <div className={side ? `sidebar close` : `sidebar open`}>
      <div className="sidebar__header">
        <Avatar
          onClick={() => auth.signOut()}
          className="sidebar__avatar"
          src={user.photo}
        />

        <div className="sidebar__input">
          <Search />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchedMessage(e.target.value)}
          ></input>
        </div>

        <IconButton onClick={() => setOpen(!open)}>
          <MessageIcon />
        </IconButton>

        <IconButton onClick={close} className="sidebar__btn">
          <CloseIcon />
        </IconButton>
      </div>

      {open ? (
        <NewMessageDialog open={open} handleClose={() => setOpen(false)} />
      ) : (
        <> </>
      )}

      <div className="sidebar__messages">
        <FlipMove>
          {rooms
            .filter((room) => {
              for (var key in room.data.participants) {
                if (
                  room.data.participants[key].name
                    .toLowerCase()
                    .includes(searchedMessage.toLowerCase()) &&
                  room.data.participants[key].id !== user.uid
                ) {
                  return room.data.participants;
                }
              }

              return null;
            })
            .map((room, index) => {
              return (
                <SideMessage
                  key={index}
                  id={room.id}
                  chatName={handleChatName(room)}
                  photo={handleChatPhoto(room)}
                  members={room.data.ids}
                  close={close}
                />
              );
            })}
        </FlipMove>
      </div>
    </div>
  );
}

export default Sidebar;
