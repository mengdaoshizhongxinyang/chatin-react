/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-25 10:56:24
 * @Description: 
 */
import http from "http";
import { getDB } from "@/utils/db";
import { SR } from "@/utils/sr";
import icon from "iconv-lite";
import { Friend } from "@/model/friends";
interface BaseResult<T> {
    data: T
    retcode: number
    status: string
}

export async function getFriendsList(isFresh: boolean = false) {
    let needFresh = isFresh
    let db = await getDB()
    try {
        let res = await db.all<Friend.Field>('select * from friends')
        if (res.length == 0) {
            needFresh = true
        }
        if (!needFresh && res.length != 0) {
            return res
        }
        if (needFresh) {
            let data = await SR.get<BaseResult<Friend.Field[]>>("http://127.0.0.1:5700/get_friend_list")
            let sql = "INSERT INTO friends(nickname,remark,user_id) values " + data.data.map(item => {
                return `('${item.nickname.replaceAll("'", "''")}','${item.remark}','${item.user_id}')`
            }).join(',')
            sql += ";"
            await db.run(sql)
            db.close()
            return data.data
        } else {
            db.close()
        }
    } catch (e) {
        db.close()
        return []
    }


}