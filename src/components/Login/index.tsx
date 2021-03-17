/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 16:01:01
 * @Description: 
 */
import React from "react";
import Input from "../Input";
import style from "./login.module.less";
const Login: React.FC<{}> = () => {
  return <div className={style['chat-login']}>
    <div className={style['chat-login-top']}>
      {/* <div className={style['chat-login-top-avatar']}></div>
      <div className={style['wave']}></div> */}
    </div>
    <div className={style['chat-login-form']}>
      <div className={style['chat-login-form-item']}>
        <Input />
      </div>
      <div className={style['chat-login-form-item']}>
        <Input />
      </div>
      <button className={style['chat-login-form-submit']}></button>
    </div>
  </div>
}
export default Login