/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-19 11:29:42
 * @Description: 
 */
import axios, { AxiosError, AxiosInstance, AxiosPromise } from "axios";
declare namespace HTTPRequest {
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

export class HTTPRequest {
  private request: AxiosInstance;

  constructor(port: string|number) {
    this.request = axios.create({
      baseURL: `http://localhost:${port}`,
      timeout: 6000
    })
    this.request.interceptors.request.use(config => {
      return config
    }, ()=>{})
    this.request.interceptors.response.use((response) => {
      return response.data
    }, ()=>{})
  }
  login(data:{user:string,password:string}):AxiosPromise<HTTPRequest.ReturnMessage<HTTPRequest.Friends>>{
    return this.request({
      url:"login",
      method:"post",
      data:data
    })
  }
  getFriendsList():AxiosPromise<HTTPRequest.ReturnMessage<HTTPRequest.Friends>>{
    
    return this.request({
      url: '/get_friend_list',
      method: 'get'
    })
  }
}