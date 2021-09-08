/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-25 10:56:24
 * @Description: 
 */
import http from "http";
import { getDB } from "@/utils/db";
import { SR } from "@/utils/sr";
import icon from "iconv-lite";
import { Friend } from "@/model/friend";
interface BaseResult<T> {
    data: T
    retcode: number
    status: string
}

export async function getFriendsList(isFresh: boolean = false) {
    let needFresh = isFresh
    let db = await getDB()
    let friend = new Friend()
    try {
        let res = await friend.get()
        if (res.length == 0) {
            needFresh = true
        }
        if (!needFresh && res.length != 0) {
            return res
        }
        if (needFresh) {
            let data = await SR.get<BaseResult<Friend.Field[]>>("http://127.0.0.1:5700/get_friend_list")
            await friend.created(data.data)
            return data.data
        }
    } catch (e) {
        db.close()
        return []
    }
}
