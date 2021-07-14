/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-07-14 09:47:23
 * @Description: 
 */
import React, { useEffect, useRef, useState } from "react";

import { ipcRenderer } from "electron";
import style from "./terminal.module.less";
type Command = {
  command: string
  path: String
  commandMsg: string
}
type CommandMsgs=string[]
function getOsInfo() {
  var userAgent = navigator.userAgent.toLowerCase()
  var name = 'Unknown'
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows'
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'iPhone'
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac'
  } else if (
    userAgent.indexOf('x11') > -1 ||
    userAgent.indexOf('unix') > -1 ||
    userAgent.indexOf('sunname') > -1 ||
    userAgent.indexOf('bsd') > -1
  ) {
    name = 'Unix'
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android'
    } else {
      name = 'Linux'
    }
  }
  return name
}


const terminal: React.FC<{}> = () => {
  const [commandArr, setCommandArr] = useState<Command[]>([])
  const [command,setCommand]=useState("")
  const [commandMsg,setCommandMsg]=useState<string[]>([])
  const [addPath,setAddPath]=useState("")
  const [path,setPath]=useState("")
  const [isActived,setIsActived]=useState(false)
  const inputDom=useRef<HTMLSpanElement>(null)
  const [action,setAction]=useState(false)
  function keyFn(e:React.KeyboardEvent) {
    if (e.key == "enter" || e.key=="Numenter") {
      // actionCommand()
      e.preventDefault()
    }
  }
  // function actionCommand() {
  //   const cmd=command.trim()
  //   isClear(command)
  //   if (this.command === '') return
  //   this.action = true
  //   this.handleCommand = this.cdCommand(command)
  //   const ls = spawn(this.handleCommand, {
  //     encoding: 'utf8',
  //     cwd: this.path, // 执行命令路径
  //     shell: true, // 使用shell命令
  //   })
  //   // 监听命令行执行过程的输出
  //   ls.stdout.on('data', (data) => {
  //     const value = data.toString().trim()
  //     this.commandMsg.push(value)
  //     console.log(`stdout: ${value}`)
  //   })
  //   // 错误或详细状态进度报告 比如 git push、 git clone 
  //   ls.stderr.on('data', (data) => {
  //     const value = data.toString().trim()
  //     this.commandMsg.push(`stderr: ${data}`)
  //     console.log(`stderr: ${data}`)
  //   })
  //   // 子进程关闭事件 保存信息 更新状态
  //   ls.on('close', this.closeCommandAction) 
  // }
  function isClear(command:string) {
    if (command === 'clear') {
      setCommandArr([])
      commandFinish()
    }
  }
  function commandFinish() {
    setCommandMsg([])
    setCommand('')
    // this.inputDom.textContent = ''
    // this.action = false
    // // 激活编辑器
    // this.$nextTick(() => {
    //   this.focusInput()
    //   this.scrollBottom()
    // })
  }
  useEffect(()=>{
    const systemName = getOsInfo()
    if(systemName==='Mac'){
      setAddPath(' && pwd')
    }else if(systemName==='Windows'){
      setAddPath(' && chdir')
    }
    setPath(process.cwd())
    ipcRenderer.on('win-focus',(event,message)=>{
      console.log(event,message)
      setIsActived(true)
    })
  },[])
  const commandMsgs:CommandMsgs=[]
  return <div className={style['main-class']}>
    {
      commandArr.map(command => {
        return <div>
          <div className={style['command-action']}>
            <span className={style['command-action-path']}>{command.path}</span>
            <span className={style['command-action-contenteditable']}>{command.command}</span>
          </div>
          <div className={style['output-command']}>{command.commandMsg}</div>
        </div>
      })
    }
    <div className={`${style['command-action']} ${style['command-action-editor']}`}>
      <span className={style['command-action-path']}>{`${path} $`}</span>
      <span 
        ref={inputDom}
        className={style['command-action-contenteditable']}
        contentEditable={action?false:'true'}
        onChange={(e:React.ChangeEvent<HTMLSpanElement>)=>setCommand(e.target.textContent || "")}
      ></span>
    </div>
    <div className={style['output-command']}>
      {
        commandMsgs.map(commandMsg=>{
          return <div>{commandMsg}</div>
        })
      }
    </div>
  </div>
}
export default terminal