/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 15:59:33
 * @Description: 
 */
import React, { useState } from "react";
import style from "./input.module.less";

interface Props {
  prefix?: React.ReactNode
  type?: HTMLInputElement['type']
  value?: string
  onEnterPress?: (value: string) => void
  onChange?:(value:string)=>void
  suffix?:React.ReactNode
}
const Input: React.FC<Props> = (props) => {
  const [value, setValue] = useState(props.value || "")
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.code == "NumpadEnter" || e.code == "Enter") {
      if(props.onEnterPress){
        props.onEnterPress(value)
      }
    }
  }
  function handleChange(value:string){
    setValue(value)
    if(props.onChange){
      props.onChange(value)
    }
  }
  return <span className={`${style['chat-input-affix-wrapper']} ${style['chat-input-large']}`}>
    {
      props.prefix ? <span className={style['chat-input-prefix']}>
        {props.prefix}
      </span> : null
    }
    <input
      value={value}
      className={style['chat-input']} 
      type={props.type ? props.type : "text"} 
      onKeyPress={handleKeyPress} 
      onChange={(e) => handleChange(e.target.value)} 
    />
    {
      props.suffix ? <span className={style['chat-input-suffix']}>
        {props.suffix}
      </span> : null
    }
  </span>
}
export default Input