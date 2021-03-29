/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-26 15:51:40
 * @Description: 
 */

declare namespace WS {
  type Friend={
    nickname:string
    remark:string
    user_id:number
  }
  type LoginInfo={
    name:string
    user_id:number
  }
  type Friends=Friend[]
  type ReturnMessage<T>={
    data:T
    errCode:number
    status:200|404|500
  }
}
type API='get_msg'|'get_friend_list'

type Func<T=any>=(Message:MessageEvent<string>)=>T
export class WebSocketCollection<T extends API> {
  private taskList:{[key in API]?:WebSocket}={}
  
  private taskManage:{[key in API]?:Func[]}={}
  constructor(...startAPIs:T[]){
    startAPIs.forEach(API=>{
      this.taskList[API]=new WebSocket(`ws://127.0.0.1:6700/${API}`)
      this.taskManage[API]=[]
      this.taskList[API]!.onmessage=(message:MessageEvent<string>)=>{
        this.taskManage[API]?.forEach(func => {
          func(message)
        });
      }
    })
  }
  register<P=any>(API:T,func:Func<P>){
    this.taskManage[API]!.push(func)
  }
}
