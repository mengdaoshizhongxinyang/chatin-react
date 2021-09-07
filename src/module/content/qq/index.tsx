/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 11:55:48
 * @Description: 
 */
import React, { useState, useEffect } from "react";
import style from "./qq.module.less";
import Login from "@/components/login";
import Bubble from "@/components/bubble";
import { HTTPRequest } from "@/utils/httpRequest";
import os from "os"

import net from "net";
import { WebSocketCollection } from "@/utils/webSocket";

import { exec } from "child_process";
import { getFriendsList } from "@/api/qqHTTP";
interface BaseMessage {
  post_type: string
  time: number
  self_id: number
}
interface HertType extends BaseMessage {
  interval: number
  meta_event_type: string
  post_type: "meta_event"
  status: { [key in string]: any }
}

interface Sender {
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
interface MessageListItem extends Sender {
  message: string
  time: number
}
type AllMessage = HertType | Message
type MessageInfo<T extends AllMessage['post_type']> = Omit<Extract<AllMessage, { post_type: T }>, 'post_type'>

// let wsc = new WebSocketCollection()
// let wsc = new WebSocket("ws://127.0.0.1:6700")
type Friend = {
  nickname: string
  remark: string
  user_id: number
}
const QQ: React.FC<{}> = () => {
  const [content, setContent] = useState<string>("")
  const [state, setState] = useState(0)
  const [imgurl, setImgurl] = useState("")
  const [messageList, setMessageList] = useState<MessageListItem[]>([{ message: "ssss", user_id: 8786, time: 24, nickname: "5245", age: 0 }])
  const [friends,setFriends]=useState<Friend[]>([])
  const sendMessage = (message: string) => {
    // if (socket.readyState == WebSocket.OPEN) {
    // 	socket.send(message);
    // } else {
    // 	alert("连接没有开启.");
    // }
  }
  const request = new HTTPRequest('8080')
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == 'Enter') {
      sendMessage(content)
    }
  }
  const handleSend = () => {
    // exec('"C:\\Program Files (x86)\\Tencent\\QQ\\Bin\\QQScLauncher.exe"',(err)=>{
    //   console.log(err)
    // })
  }
  async function setFriendsList(){
    let friends=await getFriendsList()
    console.log(friends)
    if(friends){
      setFriends(friends)
    }
    
  }
  useEffect(() => {
    setFriendsList()
    // console.log(os.userInfo())
    // wsc.onmessage = (message: MessageEvent<string>) => {
    //   const msg: AllMessage = JSON.parse(message.data)
    //   // TODO: cq码的处理
    //   if (msg.post_type == "message") {
    //     setMessageList(messageList.concat([{
    //       ...msg.sender,
    //       time: msg.time,
    //       message: msg.message
    //     }]))
    //   }
    // }
  }, [])//{\"interval\":5000,\"meta_event_type\":\"heartbeat\",\"po…st_message_time\":1625210920}},\"time\":1625210920}\n
  // useEffect(() => {
  //   https.get("https://tiebapic.baidu.com/forum/pic/item/e61190ef76c6a7ef46147095eafaaf51f3de6657.jpg", (res) => {
  //     let data = ''
  //     res.setEncoding('binary')
  //     res.on('data', chunk => {
  //       data+= chunk
  //     }).on('end',()=>{
  //       setImgurl('data:image/png;base64,'+btoa(data))
  //     })
  //   })
  // });

  // let socket = new WebSocket("ws://127.0.0.1:6700/get_msg")
  // socket.onmessage = (message: MessageEvent<string>) => {
  //   messageList.push({message:"s",user_id:8786,time:24,nickname:"5245",age:0})
  //   const msg: HertType | Message = JSON.parse(message.data)
  //   // setMessageList(messageList.concat([{message:"s",user_id:8786,time:24,nickname:"5245",age:0}]))
  //   if (msg.post_type=="message") {
  //     setMessageList(messageList.concat([{
  //       ...msg.sender,
  //       time:msg.time,
  //       message:msg.message
  //     }]))
  //   }
  // };
  // socket.onopen = function (event) {
  //   console.log(event)
  // };
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
    <div className={style['chat-contact-list']}>
      {
        friends.map(friend=>{
          return <div className={style['contact-base-info']} key={friend.user_id}>
            <div className={style['avatar']}></div>
            <div className={style['text']}>
              <div className={style['top']}>
                <div className={style['name']}>{`${friend.nickname}${friend.remark?`(${friend.remark})`:''}`}</div>
                <div className={style['time']}></div>
              </div>
              <div className={style['message']}></div>
            </div>
          </div>
        })
      }
    </div>
    <div className={style['chat-border']}>
      <div className={style['chat-border-handle']}></div>
    </div>
    <div className={style['chat-content']}>
      <div className={style['chat-title']}></div>
      <div className={style['chat-window']} style={{ backgroundColor: "rgb(121,157,124)" }}>
        {
          messageList.map((item, index) => {
            return <div
              className={style['chat-raw']}
              key={index}
            >
              <Bubble
                time={"12:01PM"}
                position="right"
                content={item.message}
              >
              </Bubble>
            </div>
          })
        }
      </div>
      <div className={style['chat-enter']}>
        <div className={style['chat-image']}>
          {/* <Icon icon="smile"></Icon> */}
        </div>
        <textarea
          onKeyPress={handleKeyPress}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {
          imgurl ?
            <img src={imgurl} style={{ width: 20 }} alt="" />
            : null
        }

        <button onClick={handleSend}>
          {"发送"}
        </button>
      </div>
    </div>
  </div>
}
export default QQ