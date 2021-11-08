/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-06 13:48:19
 * @Description: 
 */
import { Model } from "../model";
import { SR } from "@/utils/sr";
import { Message } from "../message/message";


export class Friend extends Model<Friend.Field & Friend.Hidden>{
    protected fillable: Model.Fillable<Friend.Field> = ['nickname', 'remark', 'user_id', 'is_use']

    public messages() {
        return this.hasOne(new Message(), 'user_id', 'id')
    }

}
export namespace Friend {
    export type Field = {
        nickname: string
        remark: string
        user_id: number
        is_use: number
    }
    export type Hidden = {

    }
    export async function getList(isFresh: boolean = false) {
        let needFresh = isFresh
        let friend = new Friend()
        try {
            let friends = await friend.get()
            if (friends.length == 0) {
                needFresh = true
            }
            if (needFresh) {
                let data = await SR.get<CQBaseResult<Friend.Field[]>>("http://127.0.0.1:5700/get_friend_list")
                await friend.created(data.data)
                friends = await friend.get()
            }
            return friends
        } catch (e) {
            return []
        }
    }
    export async function getOne(id: number) {
        try {
            return await new Friend().where('user_id', id).first()
        } catch (e) {
            console.log(e)
        }
    }
    export async function active(id: number) {
        try {
            await new Friend().where('user_id', id).update({ is_use: 1 });
        } catch (e) {
            console.log(e)
        }
    }
}

// (async function () {
//     let t = await new Friend().with('messages').select(['nickname']).first()
    
// })()

