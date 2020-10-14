import React, { useEffect } from "react";
import "./App.css";

import { useDispatch, useSelector } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import Messenger from "./Messenger";
import Login from "./Login";
import { auth } from "./firebase";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //is logged in
        dispatch(
          login({
            uid: authUser.uid,
            photo: authUser.photoURL,
            email: authUser.email,
            displayName: authUser.displayName,
          })
        );
      } else {
        // is not
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return <div className="App">{user ? <Messenger /> : <Login />}</div>;
}

export default App;
