/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-26 17:13:00
 * @Description: 
 */
import React, { createElement } from "react";
import dayjs from 'dayjs'
import style from "./bubble.module.less";
type Props = {
  time?: number | string
  position?: 'left' | 'right'
  type?: keyof typeof colorType
  content: string
}
type CQcode = 'image'//|'reply'|'redbag'|'poke'|'gift'|'forward'|'node'|'video'|'xml'|'json'|'cardimage'|'tts'
const handleFunctions: { [key in CQcode]: (content: string) => React.ReactNode } = {
  image: (content) => {
    // let canvas=document.createElement('canvas')
    // let imgLink=content.match(/(?<=\[CQ:image,.+?url=)(.+?)(?=\])/)![0]
    // let tempImage=new Image()
    // canvas.width = img.width;
    //         canvas.height = img.height;
    //         var ctx = canvas.getContext("2d");
    //         ctx.drawImage(img, 0, 0, img.width, img.height);
    //         var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    //         var dataURL = canvas.toDataURL("image/"+ext);
    //         return dataURL;
    return <img src={content.match(/(?<=\[CQ:image,.+?url=)(.+?)(?=\])/)![0]} style={{ display: "none" }}></img>
  }
}

const colorType = {
  primary: style['bubble-primary'],
  default: ""
}
const bubble: React.FC<Props> = (props) => {
  const contentList = props.content.match(/\[CQ.*?\]/)
  let arr = props.content.split(/\[CQ.*?\]/)
  let result: React.ReactNode[] = [arr[0]]

  const handleds = contentList?.map(item => {
    const type = item.match(/(?<=\[CQ:)(.+?)(?=[,|\]])/)
    return handleFunctions[type![0] as CQcode](item)
  })

  if (handleds) {
    handleds.forEach(item => {
      result.push(item)
    })
  }
  return <div
    data-backcolor="#fff"
    className={`${style['bubble-main']} 
    ${props.position == 'right' ? style['bubble-right'] : style['bubble-left']} ${props.type ? colorType[props.type] : ''}`
    }>{props.children ? props.children : result}<sub className={style['bubble-main-sub']}>{
      props.time ? dayjs(props.time).format("HH:mm") : ''
    }</sub>
  </div>
}
export default bubble