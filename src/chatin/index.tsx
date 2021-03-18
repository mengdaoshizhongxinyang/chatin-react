/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 11:55:48
 * @Description: 
 */
import React, { useState } from "react";
import style from "./chatin.module.less";
import Login from "../components/login";
const chatin: React.FC<{}> = () => {
  const [content, setContent] = useState<string>("")
  const [state,setState]=useState(0)
  const sendMessage = (message: string) => {
    // if (socket.readyState == WebSocket.OPEN) {
    // 	socket.send(message);
    // } else {
    // 	alert("连接没有开启.");
    // }
  } 
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      sendMessage(content)
    }
  }
  function handleLogin(info:{user:string,password:string}){
    console.log(info)
  }
  return <div className={style["chat-body"]}>
    {
      state?<div className={style["chat-mask"]}>
        <Login onLogin={handleLogin}></Login>
      </div>:null
    }
    <div className={style['chat-contact-list']}></div>
    <div className={style['chat-border']}>
      <div className={style['chat-border-handle']}></div>
    </div>
    <div className={style['chat-content']}>
      <div className={style['chat-title']}></div>
      <div className={style['chat-window']}>

      </div>
      <div className={style['chat-enter']}>
        <div className={style['chat-image']}>
          {/* <Icon icon="smile"></Icon> */}
        </div>
        <input 
          type="text" 
          onKeyPress={handleKeyPress} 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
      </div>
    </div>
  </div>
}
export default chatin