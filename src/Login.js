import { Button } from "@material-ui/core";
import React from "react";
import "./Login.css";
import { auth, provider } from "./firebase";
import db from "./firebase";

function Login() {
  const signin = () => {
    auth
      .signInWithPopup(provider)
      .then((response) => {
        const user = {
          id: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
          photo: response.user.photoURL,
        };

        db.collection("users")
          .doc(user.id)
          .set(user, { merge: true })
          .then(() => {
            console.log("user successfully added");
          });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <div className="app__icon">
        <img
          alt="logo"
          src="https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/1024/messages-icon.png"
        />
      </div>
      <h1>iMessenger</h1>

      <Button onClick={signin}>Sign in</Button>
    </div>
  );
}

export default Login;
