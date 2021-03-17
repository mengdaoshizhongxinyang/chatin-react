/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 15:59:33
 * @Description: 
 */
import React from "react";
import style from "./input.module.less";
const Input:React.FC<{}>=()=>{
  return <span className={`${style['chat-input-affix-wrapper']} ${style['chat-input-large']}`}>
    <input className={style['chat-input']} />
  </span>
}
export default Input