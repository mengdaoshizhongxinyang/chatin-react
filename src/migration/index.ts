/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-25 11:26:47
 * @Description: 
 */
import { getDB } from "@/utils/db";

import { list } from "./list";

type Migration = {
    name: string
    datetime: number
}
(async () => {
    let db =await getDB()
    try {
        await db.run(`CREATE TABLE IF NOT EXISTS migrations(name varchar(255) NOT NULL,update_time TIMESTAMP default current_timestamp)`)
        let migrations = await db.all<Migration>('select * from migrations')
        let keyValue = Object.fromEntries(migrations.map(item => {
            return [item.name, true]
        }))
        list.forEach(migration => {
            if (migration.name && !keyValue[migration.name]) {
                db.run(migration())
                db.run(`insert into migrations (name) values('${migration.name}')`)
            }
        })
        db.close()
    } catch (e) {
        db.close()
    }
})()

