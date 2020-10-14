import React from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import "./Messenger.css";

function Messenger() {
  return (
    <div className="messenger">
      {/* Sidebar */}
      <Sidebar />

      {/* Chat */}
      <Chat />
    </div>
  );
}

export default Messenger;
