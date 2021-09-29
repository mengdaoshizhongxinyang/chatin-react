/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-26 22:26:32
 * @Description: 
 */
import { Schema } from "@/utils/schema"
export default function createQQGroupList210926() {
    return Schema.Create('groups', (table) => {
        table.bigint('group_id')
        table.string('group_name')
        table.string('group_memo')
        table.bigint('group_create_time')
        table.bigint('group_level')
        table.integer('member_count')
        table.integer('max_member_count')
        table.integer('is_use').default(0)
    })
}