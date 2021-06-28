import React from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import "./Messenger.css";

function Messenger() {
  const [hidden, setHidden] = React.useState(true);

  return (
    <div className="messenger">
      {/* Sidebar */}
      <Sidebar close={() => setHidden(true)} side={hidden} />

      {/* Chat */}
      <Chat expand={() => setHidden(false)} side={hidden} />
    </div>
  );
}

export default Messenger;
