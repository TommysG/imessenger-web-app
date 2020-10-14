import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import db from "./firebase";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import User from "./components/User";
import firebase from "firebase";
import { TextField } from "@material-ui/core";
import "./NewMesage.css";

export default function FormDialog({ open, handleClose }) {
  const [selectedUser, setSelectedUser] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const user = useSelector(selectUser);

  useEffect(() => {
    db.collection("users")
      .where("id", "!=", user.uid)
      .get()
      .then((result) => {
        setUsers(result.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      })
      .catch((error) => {
        alert(error.message);
      });
  }, [user.uid]);

  const createRoom = (e) => {
    e.preventDefault();

    const room = {
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      participants: [
        { id: user.uid, name: user.displayName, photo: user.photo },
        {
          id: selectedUser.id,
          name: selectedUser.name,
          photo: selectedUser.photo,
        },
      ],
      ids: [user.uid, selectedUser.id],
    };

    // db.collection("rooms")
    //   .where("ids", "array-contains", user.uid)
    //   .get()
    //   .then((doc) => {
    //     if (doc.size <= 0) {
    db.collection("rooms")
      .add(room)
      .then((result) => {
        console.log("room created");
      })
      .catch((error) => {
        alert(error.message);
      });
    //   } else {
    //     alert("room is already created");
    //   }
    // })
    // .catch((error) => {
    //   alert(error.message);
    // });

    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Select user to chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a user from the list below, to start a personal conversation.
            The user will be informed.
          </DialogContentText>

          <div className="search__user">
            <TextField
              fullWidth
              autoFocus
              margin="dense"
              type="text"
              placeholder="Search users"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="userlist">
            {users
              .filter((user) =>
                user.data.name.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((user, index) => {
                return (
                  <User
                    onClick={() => setSelectedUser(user.data)}
                    selected={selectedUser}
                    key={index}
                    id={user.id}
                    name={user.data.name}
                    photo={user.data.photo}
                  />
                );
              })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createRoom} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
