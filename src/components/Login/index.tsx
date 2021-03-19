/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 16:01:01
 * @Description: 
 */
import React, { useState } from "react";
import Input from "../input";
import style from "./login.module.less";
import Icon from "../icon";
interface Props{
  user?:string
  password?:string
  onLogin?:(info:{user:string,password:string})=>void
  loading?:boolean
}
const Login: React.FC<Props> = (props) => {
  const [user,setUser]=useState(props.user || "")
  const [password,setPassword]=useState(props.password || "")
  function handleEnterPress(){
    if(props.onLogin && !props.loading){
      props.onLogin({user,password})
    }
  }
  return <div className={style['chat-login']}>
    <div className={style['chat-login-top']}>
    </div>
    <div className={style['chat-login-form']}>
      <div className={style['chat-login-form-item']}>
        <Input value={user} prefix={<Icon iconName={'User'} width={"1em"} height={"1em"} />} onChange={setUser}/>
      </div>
      <div className={style['chat-login-form-item']}>
        <Input 
          value={password} 
          type="password" 
          prefix={<Icon iconName={'Password'} width={"1em"} height={"1em"} />}
          onChange={setPassword}
          onEnterPress={handleEnterPress}
        />
      </div>
      <button className={style['chat-login-form-submit']} onClick={handleEnterPress}>
        登录
      </button>
    </div>
  </div>
}
export default Login