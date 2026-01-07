import React, { useRef, useEffect } from "react";
import style from "./chat.module.css";

function MessageCard({ message, index, chatEndRef,  chatLength, order}) {
 
  return (
    <div>
      <li className={order}>
        {message}
        { index === chatLength - 1 && (<div ref={chatEndRef} />) }
      </li>
    </div>
  );
}

export default MessageCard;
