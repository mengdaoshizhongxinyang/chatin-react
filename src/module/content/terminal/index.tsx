/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-07-14 09:47:23
 * @Description: 
 */
import React, { useEffect, useRef, useState } from "react";
import { spawn } from "child_process";
import { ipcRenderer } from "electron";
import style from "./terminal.module.less";
type Command = {
  code:number
  command: string
  path: String
  commandMsg: string
}  
type CommandMsgs = string[]
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
  const [command, setCommand] = useState("")
  // const [commandMsg, setCommandMsg] = useState<string[]>([])
  let commandMsg:string[]=[]
  const [addPath, setAddPath] = useState("")
  const [path, setPath] = useState("")
  const [isActived, setIsActived] = useState(false)
  const inputDom = useRef<HTMLSpanElement>(null)
  const [action, setAction] = useState(false)
  function keyFn(e: React.KeyboardEvent) {
    if (e.code == "Enter" || e.code == "NumpadEnter") {
      actionCommand()
      e.preventDefault()
    }
  }

  const [handleCommand, setHandleCommand] = useState("")
  function cdCommand(cmd: string) {
    let pathCommand = ''
    if (cmd.startsWith('cd ')) {
      pathCommand = addPath
    } else if (cmd.indexOf(' cd ') !== -1) {
      pathCommand = addPath
    }
    return cmd + pathCommand
  }
  function actionCommand() {
    let cmd = command.trim()
    let clearFlag=isClear(cmd)
    if(clearFlag){
      return
    }
    if (cmd === '') return
    setAction(true)
    const t=cdCommand(cmd)
    setHandleCommand(cdCommand(cmd))
    const ls = spawn(`powershell ${t}`, {
      
      cwd: path, // 执行命令路径
      shell: true, // 使用shell命令
    })
    // 监听命令行执行过程的输出
    ls.stdout.on('data', (data) => {
      const value = data.toString().trim()
      commandMsg.push(value)
    })
    // 错误或详细状态进度报告 比如 git push、 git clone 
    ls.stderr.on('data', (data) => {
      const value = data.toString().trim()
      commandMsg.push(`stderr: ${data}`)
    })
    // 子进程关闭事件 保存信息 更新状态
    ls.on('close', closeCommandAction)
  }
  function closeCommandAction(code:number) {
    // 保存执行信息
    setCommandArr(commandArr.concat([{
      code, // 是否执行成功
      path: path, // 执行路径
      command: command, // 执行命令
      commandMsg: commandMsg.join('\r\n'), // 执行信息
    }]))
    // 清空
    updatePath(handleCommand, code)
    commandFinish()

    setCommand("")
  }
  function updatePath(command:string, code:number) {
    if (code !== 0) return
    
    const isPathChange = command.indexOf(addPath) !== -1
    if (isPathChange) {
      setPath(commandMsg[commandMsg.length-1])
    }
    
  }
  function isClear(command: string) {
    if (command === 'clear') {
      setCommandArr([])
      commandFinish()
      return true
    }
    return false
  }
  function commandFinish() {
    commandMsg=[]
    setCommand('')
    if(inputDom.current?.textContent){
      inputDom.current.textContent=''
    }
    // this.inputDom.textContent = ''
    // this.action = false
    // // 激活编辑器
    // this.$nextTick(() => {
    //   this.focusInput()
    //   this.scrollBottom()
    // })
  }
  useEffect(() => {
    const systemName = getOsInfo()
    if (systemName === 'Mac') {
      setAddPath(' && pwd')
    } else if (systemName === 'Windows') {
      setAddPath(' && chdir')
    }
    setPath(process.cwd())
    ipcRenderer.on('win-focus', (event:any, message:any) => {
      setIsActived(true)
    })
  }, [])
  const commandMsgs: CommandMsgs = []
  return <div className={style['main-class']}>
    {
      commandArr.map((command,index) => {
        return <div key={index}>
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
        contentEditable={'true'}
        onInput={(e: React.ChangeEvent<HTMLSpanElement>) => {setCommand(e.target.textContent || "")}}
        onKeyDown={keyFn}
      ></span>
    </div>
    <div className={style['output-command']}>
      {
        commandMsgs.map((commandMsg,index) => {
          return <div key={index}>{commandMsg}</div>
        })
      }
    </div>
  </div>
}
export default terminal