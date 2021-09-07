/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-25 10:56:24
 * @Description: 
 */
import http from "http";
import { getDB } from "@/utils/db";
import icon from "iconv-lite";
import { Friend } from "@/model/friends";
interface BaseResult<T> {
    data: T
    retcode: number
    status: string
}
type fe = {
    nickname: string
    remark: string
    user_id: number
}
export async function getFriendsList(isFresh: boolean = false) {
    let needFresh = isFresh
    let db =await getDB()
    console.log(db)
    try {

        let res = await db.all<fe>('select * from friends')
        if (res.length == 0) {
            needFresh = true
        }
        if (!needFresh && res.length != 0) {
            return res
        }
        if (needFresh) {
            http.get("http://127.0.0.1:5700/get_friend_list", (res) => {
                let data: BaseResult<fe[]>
                let temp = ''
                res.setEncoding('utf8')
                res.on('data', chunk => {
                    temp += chunk
                }).on('end', async () => {
                    data = JSON.parse(temp)
                    let sql = "INSERT INTO friends(nickname,remark,user_id) values " + data.data.map(item => {
                        return `('${item.nickname.replaceAll("'", "''")}','${item.remark}','${item.user_id}')`
                    }).join(',')
                    sql += ";"
                    await db.run(sql)
                    db.close()
                    return data.data
                })
            })
        } else {
            db.close()
        }
    } catch (e) {
        db.close()
        return []
    }


}