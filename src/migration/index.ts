/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-25 11:26:47
 * @Description: 
 */
import { getDB } from "@/utils/db";

import { list } from "./list";
let db = getDB()
type Migration = {
    name: string
    datetime: number
}
db.serialize(() => {
    let temp = db.prepare(`CREATE TABLE IF NOT EXISTS migrations(name varchar(255) NOT NULL,update_time TIMESTAMP default current_timestamp)`)
    temp.run()
    temp.finalize()
    db.all('select * from migrations', (err, res: Migration[]) => {
        let keyValue = Object.fromEntries(res.map(item => {
            return [item.name, true]
        }))
        list.forEach(migration => {
            if (migration.name && !keyValue[migration.name]) {
                db.prepare(migration()).run().finalize()
                db.prepare(`insert into migrations (name) values('${migration.name}')`).run().finalize()
            }
        })
        db.close()
    })
})
