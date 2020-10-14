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
import { selectChatId, selectChatMembers } from "./features/chatSlice";

export default function AddMember({ open, handleClose }) {
  const [selectedUser, setSelectedUser] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const user = useSelector(selectUser);
  const chatMembers = useSelector(selectChatMembers);
  const chatId = useSelector(selectChatId);

  useEffect(() => {
    db.collection("users")
      .where("id", "not-in", chatMembers)
      .get()
      .then((result) => {
        setUsers(result.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      })
      .catch((error) => {
        alert(error.message);
      });
  }, [user.uid, chatMembers]);

  const addMember = () => {
    db.collection("rooms")
      .doc(chatId)
      .update({
        ids: firebase.firestore.FieldValue.arrayUnion(selectedUser.id),

        participants: firebase.firestore.FieldValue.arrayUnion({
          name: selectedUser.name,
          photo: selectedUser.photo,
        }),
      });

    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add new member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a user from the list below, to add him to your conversation.
            Beware that the user will be able to see all the messages.
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
          <Button onClick={addMember} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
