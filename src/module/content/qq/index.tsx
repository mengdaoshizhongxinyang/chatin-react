/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 11:55:48
 * @Description: 
 */
import React, { useState, useEffect } from "react";
import style, { message } from "./qq.module.less";
import Login from "@/components/login";
import Bubble from "@/components/bubble";
import { HTTPRequest } from "@/utils/httpRequest";
import os from "os"
import { qqHelper } from "@/helper/qq";
import net from "net";
import { WebSocketCollection } from "@/utils/webSocket";
import { useStore } from "@/reducer";
import { exec } from "child_process";
import { Friend } from "@/model";
import { Message } from "@/model/message";
import { reactive, ref } from "@/utils/reactUpdate";
const myQQ = 729403918

// let wsc = new WebSocketCollection()
const QQ: React.FC<{}> = () => {
  const [content, setContent] = useState<string>("")
  const [state, setState] = useState(0)
  const [imgurl, setImgurl] = useState("")
  const [messageList, setMessageList] = useState(qqHelper.messageObj)
  const [friends, setFriends] = useState(qqHelper.friends)
  const [groups, setGroups] = useState(qqHelper.groups)
  const [selected, setSelected] = useState<{ type: Extract<Message, { post_type: 'message' }>['message_type'], key: number } | {}>({})
  // const friends=qqHelper.friends
  const showKey = ref("")
  const data = reactive({ showKey: "" })

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
    const info=getInfo()
    if(info){
      if(info.type=='group'){
        qqHelper.sendGroup({group_id:info.id,message:content})
      }
      if(info.type=='private'){
        qqHelper.sendPrivate({user_id:info.id,message:content})
      }
    }
  }

  useEffect(() => {
    qqHelper.setMessages = (msg) => { setMessageList(msg) }
  }, [])

  function getInfo() {
    let [key, type] = showKey.value.split('_')
    if (type == 'group') {
      let temp = groups.filter(item => {
        return item.group_id == Number(key)
      })[0]
      return {
        name: temp.group_name,
        id: temp.group_id,
        type: 'group'
      } as const
    }
    if (type == 'private') {
      let temp = friends.filter(item => {
        return item.user_id == Number(key)
      })[0]
      return {
        name: temp.nickname,
        id: temp.user_id,
        type: 'private'
      } as const
    }
    return undefined
  }

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
        Object.entries(messageList).map(([key, value]) => {
          return <div className={style['contact-base-info']} key={value.senderId} onClick={() => { showKey.value = key }}>
            <div className={style['avatar']}></div>
            <div className={style['text']}>
              <div className={style['top']}>
                <div className={style['name']}>{`${value.senderName}:''`}</div>
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
      <div className={style['chat-title']}>
        {getInfo() ? getInfo()?.name : ''}
      </div>
      <div className={style['chat-window']} style={{ backgroundColor: "rgb(121,157,124)" }}>
        <div className={style['chat-window-content']}>
          {
            messageList[showKey.value]?.message.map((item, index) => {
              return <div
                className={style['chat-raw']}
                key={item.message_id}
              >
                <Bubble
                  time={item.time}
                  position={item.sender.user_id == 729403918 ? 'right' : 'left'}
                  content={item.raw_message}
                >
                </Bubble>
              </div>
            })
          }
        </div>
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