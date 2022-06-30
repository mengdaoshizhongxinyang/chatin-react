/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 11:55:48
 * @Description: 
 */
import React, { useEffect, useState } from "react";
import style from "./chatin.module.less";
import Content, { States } from "@/module/content";
import Icon from "@/components/icon";
const IconList: States[] = ['home', 'QQ', 'terminal', 'folder', 'testControl']


const chatin: React.FC<{}> = () => {
  const [state, setState] = useState<States>("home")
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    console.log(e)
  }
  const [imgUrl,setImgUrl]=useState<string[]>([])
  useEffect(() => {


  }, [])
  return <div className={style['main']} onClick={handleClick}>
    <div className={style['app-list']}>
      {
        IconList.map((key) => {
          return <div key={key} onClick={() => setState(key)} className={style['icon']}>
            <Icon iconName={key} width={30} height={30} fill={'#444'}></Icon>
          </div>
        })
      }
    </div>
    <div className={style['content']}>

      <Content state={state}></Content>
    </div>
  </div>
}
export default chatin