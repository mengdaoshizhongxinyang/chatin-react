/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 15:59:33
 * @Description: 
 */
import React from "react";
import style from "./input.module.less";

interface Props {
  prefix?:  React.ReactNode
}
const Input: React.FC<Props> = (props) => {
  return <span className={`${style['chat-input-affix-wrapper']} ${style['chat-input-large']}`}>
    {
      props.prefix ? <span className={style['chat-input-prefix']}>
        {props.prefix}
      </span> : null
    }
    <input className={style['chat-input']} />
  </span>
}
export default Input