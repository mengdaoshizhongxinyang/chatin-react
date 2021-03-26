/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 11:55:48
 * @Description: 
 */
import React, { useState } from "react";
import style from "./chatin.module.less";
import Login from "../components/login";
import Bubble from "@/components/bubble";
import { HTTPRequest } from "@/utils/httpRequest";
interface BaseMessage{
  post_type:string
  time:number
  self_id:number
}
interface HertType extends BaseMessage {
  interval: number
  meta_event_type: string
  post_type: "meta_event"
  status: { [key in string]: any }
}

interface Sender{
  age: number,
  nickname: string,
  user_id: number
}
interface Message extends BaseMessage {
  font: number
  message: string
  message_id: number
  post_type: "message"
  raw_message: string
  sender: Sender
  sub_type: string
  user_id: number
}
interface MessageListItem extends Sender{
  message:string
  time:number
}
const chatin: React.FC<{}> = () => {
  const [content, setContent] = useState<string>("")
  const [state, setState] = useState(0)
  const [messageList,setMessageList]=useState<MessageListItem[]>([{message:"s",user_id:8786,time:24,nickname:"5245",age:0}])
  const sendMessage = (message: string) => {
    // if (socket.readyState == WebSocket.OPEN) {
    // 	socket.send(message);
    // } else {
    // 	alert("连接没有开启.");
    // }
  }
  const request = new HTTPRequest('8080')
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      sendMessage(content)
    }
  }

  

  let socket = new WebSocket("ws://127.0.0.1:6700/get_msg")
  socket.onmessage = (message: MessageEvent<string>) => {
    messageList.push({message:"s",user_id:8786,time:24,nickname:"5245",age:0})
    const msg: HertType | Message = JSON.parse(message.data)
    // setMessageList(messageList.concat([{message:"s",user_id:8786,time:24,nickname:"5245",age:0}]))
    if (msg.post_type=="message") {
      setMessageList(messageList.concat([{
        ...msg.sender,
        time:msg.time,
        message:msg.message
      }]))
    }
  };
  socket.onopen = function (event) {
    console.log(event)
  };
  async function handleLogin(info: { user: string, password: string }) {
    let result = await request.login(info)
    console.log(result)
  }
  return <div className={style["chat-body"]}>
    {
      state ? <div className={style["chat-mask"]}>
        <Login onLogin={handleLogin}></Login>
      </div> : null
    }
    <div className={style['chat-contact-list']}></div>
    <div className={style['chat-border']}>
      <div className={style['chat-border-handle']}></div>
    </div>
    <div className={style['chat-content']}>
      <div className={style['chat-title']}></div>
      <div className={style['chat-window']} style={{backgroundColor:"rgb(121,157,124)"}}>
        {
          messageList.map((item,index)=>{
            return <Bubble key={index}>{item.message}</Bubble>
          })
        }
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