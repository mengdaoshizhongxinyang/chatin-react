/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-29 17:10:21
 * @Description: 
 */
import  React from "react";
export function cqcodeHandle(content:string){
  const contentList=content.split(/\[CQ.*?\]/)
  let arr=content.match(/\[CQ.*?\]/)
  const handleds=arr?.map(item=>{
    const type=item.match(/(?<=\[CQ:)(.+?)(?=[,|\]])/)
    return handleFunctions[type![0] as CQcode](item)
  })
  let result=""
  if(handleds){
    handleds.forEach(item=>{
      result+=item
    })
  }
  return result
}
type Props={
  content:string
}
type CQcode='image'//|'reply'|'redbag'|'poke'|'gift'|'forward'|'node'|'video'|'xml'|'json'|'cardimage'|'tts'
const handleFunctions:{[key in CQcode]:(content:string)=>React.ReactNode}={
  image:(content)=>{
    return <img src={content.match(/(?<=\[CQ:image,.+?url=)(.+?)(?=\])/)![0]}></img>
  }
}
const cqcode:React.FC<Props>=(props)=>{
  const contentList=props.content.split(/\[CQ.*?\]/)
  let arr=props.content.match(/\[CQ.*?\]/)
  const handleds=arr?.map(item=>{
    const type=item.match(/(?<=\[CQ:)(.+?)(?=[,|\]])/)
    return handleFunctions[type![0] as CQcode](item)
  })
  let result=""
  if(handleds){
    handleds.forEach(item=>{
      result+=item
    })
  }
  return <div></div>
}
export default cqcode