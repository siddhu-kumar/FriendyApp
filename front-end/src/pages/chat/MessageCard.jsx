import React, { useRef, useEffect, useState } from "react";
import style from "./chat.module.css";
import "../css/index.css";

function MessageCard({ message, time, index, chatEndRef, chatLength, order }) {

  return (
    <div>
      <li className={order}>
        <span>{message}</span>
        <span className="timestamp">
          {time ? `${new Date(time).getHours()}:${new Date(time).getMinutes()}` : ""}
        </span>

        {index === chatLength - 1 && <div ref={chatEndRef} />}
      </li>
    </div>
  );
}

export default MessageCard;
