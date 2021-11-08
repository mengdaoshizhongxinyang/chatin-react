/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-26 22:15:55
 * @Description: 
 */
import { Model } from "../model";
import { SR } from "@/utils/sr";

export class Group extends Model<Group.Field & Group.Hidden>{
    protected fillable: Model.Fillable<Group.Field> = [
        'group_create_time', 'group_id', 'group_level', 'group_memo',
        'group_name', 'max_member_count', 'member_count', 'is_use'
    ]

}
export namespace Group {
    export type Field = {
        group_id: number
        group_name: string
        group_memo: string
        group_create_time: number
        group_level: number
        member_count: number
        max_member_count: number
        is_use: number
    }
    export type Hidden = {

    }
    export async function getList(isFresh: boolean = false) {
        let needFresh = isFresh
        let group = new Group()
        try {

            let groups = await group.get()
            if (groups.length == 0) {
                needFresh = true
            }
            if (needFresh) {
                let data = await SR.get<CQBaseResult<Group.Field[]>>("http://127.0.0.1:5700/get_group_list")
                await group.created(data.data)
                groups = await group.get()
            }
            return groups
        } catch (e) {
            console.log(e)
            return []
        }
    }
    export async function getOne(id: number) {
        let group = new Group()
        try {
            return await group.where('group_id', id).first();
        } catch (e) {
            console.log(e)
        }
    }
    export async function active(id: number) {
        try {
            await new Group().where('group_id', id).update({ is_use: 1 });
        } catch (e) {
            console.log(e)
        }
    }
}
