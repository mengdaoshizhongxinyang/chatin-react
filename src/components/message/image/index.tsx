/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-07-09 15:37:23
 * @Description: 
 */
import React, { useEffect, useState } from "react";
import http from "http";
type Props={
  cqcodeObject:CQcodeObjectDetail<'image'>
}
const Image:React.FC<Props>=(props)=>{
  const [url,setUrl]=useState("")
  useEffect(()=>{
    http.get(`http://localhost:5700/get_image/${props.cqcodeObject.url}`,(res)=>{
      let data=''
      res.setEncoding('binary')
      res.on('data',(chunk)=>{
        data+=chunk
      }).on('end',()=>{
        setUrl(data)
      })
    })
  },[props.cqcodeObject.url])
  return <img src={url} />
}
export default Image