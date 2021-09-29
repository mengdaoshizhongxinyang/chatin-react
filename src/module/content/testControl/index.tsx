/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-16 16:13:04
 * @Description: 
 */
import React, { useRef, useState } from "react";
import { getDB } from "@/utils/db";
const testControl: React.FC<{}> = () => {
    const text = useRef<HTMLTextAreaElement>(null)
    const [arr,setArr]=useState<number[]>([])
    const test = async (e: React.MouseEvent<HTMLButtonElement> | undefined) => {
        try {
            let db = await getDB()
            let res = await db.all(text.current?.value!)
            db.close()
            console.log(res)
        }catch(e){
            console.log(e)
        }
        
    }
    return <>
        <div style={{display:'flex',maxHeight:50,overflow:'autp',flexFlow:'column-reverse'}}>
            {
                arr.map((item,key)=>{
                    return <div key={key}>{item}</div>
                })
            }
        </div>
        <textarea ref={text}></textarea>
        <button onClick={()=>{setArr([arr.length].concat(arr))}}>{'test'}</button>
    </>
}
export default testControl