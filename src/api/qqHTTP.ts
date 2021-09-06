/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-25 10:56:24
 * @Description: 
 */
import http from "http";
import { getDB } from "@/utils/db";
import icon from "iconv-lite";
interface BaseResult<T> {
    data: T
    retcode: number
    status: string
}
type Friend = {
    nickname: string
    remark: string
    user_id: number
}
export function getFriendsList(callBack: (data: Friend[]) => unknown, isFresh: boolean = false) {
    let needFresh = isFresh

    let db = getDB()
    db.serialize(() => {
        db.all('select * from friends', (err, res) => {
            console.log(res.length)
            if(res.length==0){
                needFresh=true
            }
            if(!needFresh && res.length!=0){
                callBack(res)
            }
            if (needFresh) {
                http.get("http://127.0.0.1:5700/get_friend_list", (res) => {
                    let data: BaseResult<Friend[]>
                    let temp = ''
                    res.setEncoding('utf8')
                    res.on('data', chunk => {
                        temp += chunk
                    }).on('end', () => {

                        console.log(temp)
                        data = JSON.parse(temp)
                        
                        let sql="INSERT INTO friends(nickname,remark,user_id) values "+data.data.map(item=>{
                            return `('${item.nickname.replaceAll("'","''")}','${item.remark}','${item.user_id}')`
                        }).join(',')
                        sql+=";"
                        console.log(sql)
                        db.run(sql,[],()=>{
                            db.close()
                        })
                        callBack(data.data)
                    })
                })
            }else{
                db.close()
            }
        })
    })

}