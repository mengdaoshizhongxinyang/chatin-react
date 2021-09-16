/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-16 16:13:04
 * @Description: 
 */
import React, { useRef } from "react";
import { getDB } from "@/utils/db";
const testControl: React.FC<{}> = () => {
    const text = useRef<HTMLTextAreaElement>(null)
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
        <textarea ref={text}></textarea>
        <button onClick={test}>{'test'}</button>
    </>
}
export default testControl