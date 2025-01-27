import React from "react";
import style from "./chat.module.css"
import { ShowFriend } from "./ShowFriend";

function Chat() {

  return (
    <>
      {/* <div className={style.navbar}>
          <div className={style.my_detail}>
              <div className={style.my_image} id={style.profile}></div>
              <div id={style.myname}>Hello</div>
          </div>
      </div> */}
      <div className={style.chat_page}>
              <ShowFriend  />
          {/* <div id={style.chat}>

          </div> */}
      </div>
    </>
  )
}

export default Chat;
