/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-06 13:44:51
 * @Description: 
 */
import { getDB } from "@/utils/db";
import inflect from "i";
class BaseModel<T extends { [key in string]: unknown }>{
    constructor() { }
    protected tableName = ''
    protected fillable: Model.Fillable<T> = []
    protected hidden: Model.Hidden<Record<string, unknown>> = []
    protected inValue: string[] = []
    protected whereValues: { field: string, option: string, value: any }[] = []
    protected selected: string[] = []
    protected relations: string[] = []
}

export class Model<T extends { [key in string]: unknown }> extends BaseModel<T>{
    constructor() {
        super()
        if (this.tableName == '') {
            this.tableName = inflect().tableize(this.constructor.name)
        }
    }

    private fillModel: Partial<T> = {}
    select(fields: ((Extract<keyof T, string>) | `${Extract<keyof T, string>} as ${string}`)[]) {
        this.selected = fields
        return this
    }


    where<F extends Extract<keyof T, string>>(field: F, option: T[F]): this;
    where<F extends Extract<keyof T, string>>(field: F, option: string, value: T[F]): this
    where<F extends Extract<keyof T, string>>(field: F, option: string | T[F], value?: T[F]) {
        if (value == undefined) {
            this.whereValues.push({ field, option: '=', value: option })
        } else {
            this.whereValues.push({ field, option: option as string, value })
        }
        return this
    }

    in(inValue: string[]) {
        this.inValue = inValue
        return this
    }

    destroy() {

    }

    fill(model: Partial<T>) {
        this.fillModel = model
        return this
    }

    with(model: Exclude<keyof this, keyof Model<T>>) {

    }

    async get(limit: number | undefined = undefined, offset: number = 0) {
        let db = await getDB()
        let data = await db.all<T>(`${this.selectSql()}${limit ? ` limit ${limit} offset ${offset}` : ''}`)
        db.close()
        return data
    }

    async first() {
        let db = await getDB()
        let data = await db.get<T>(this.selectSql())
        db.close()
        return data
    }

    async created(model?: Partial<T> | Partial<T>[]) {
        let insertSql = ''
        if (model instanceof Array) {
            model.forEach(item => {
                insertSql += this.insertSql(item) + '\n';
            })
        } else if (model) {
            insertSql += this.insertSql(model) + '\n';
        } else if (this.fillModel) {
            insertSql += this.insertSql(this.fillModel) + '\n';
        }
        if (insertSql) {
            let db = await getDB()
            await db.exec(insertSql)
            db.close()
        } else {

        }
    }

    async save(model: Partial<T>) {
        let insertSql = ''
        if (model) {
            insertSql += this.insertExitSql(model) + '\n';
        } else if (this.fillModel) {
            insertSql += this.insertExitSql(this.fillModel) + '\n';
        }
        if (insertSql) {
            let db = await getDB()
            await db.run(insertSql)
            db.close()
        } else {

        }
    }

    async update(model: Partial<T>) {
        
        let insertSql=Object.entries(model).map(([key,value])=>{
            return `${key} = ${typeof value=='string'?`'${value}'`:value}`
        }).join(',')
        if (insertSql) {
            let db = await getDB()
            await db.run(`UPDATE ${this.tableName} SET ${insertSql} ${this.mergeWhere()}`)
            db.close()
        } else {

        }
    }

    protected hasOne(model: Model<T>) {
        model['constructor']
        return this
    }

    private mergeWhere(){
        return this.whereValues.length>0?
            ` where ${this.whereValues.map(where => `${where.field} ${where.option} ${typeof where.value == 'string' ? `'${where.value}'` : where.value}`).join(' AND ')}`
        :''
    }

    private selectSql() {
        return `select ${this.selected.join(',') || this.fillable.join(',')} from ${this.tableName} ${this.mergeWhere()}`
    }

    private insertSql(model: Partial<T>) {
        let keyValue = Array.from(Object.entries(model))
        let fields = keyValue.map(([key, value]) => {
            return key
        }).join(',')
        let values = keyValue.map(([key, value]: [string, string]) => {
            if (typeof value == 'string') {
                return `'${value.replaceAll("'", "''")}'`
            }
            return value
        }).join(',')
        let sql = `insert into ${this.tableName}(${fields}) values (${values});`
        return sql
    }

    private insertExitSql(model: Partial<T>) {
        let keyValue = Array.from(Object.entries(model))
        let fields = keyValue.map(([key, value]) => {
            return key
        }).join(',')
        let values = keyValue.map(([key, value]: [string, string]) => {
            if (typeof value == 'string') {
                return `'${value.replaceAll("'", "''")}'`
            }
            return value
        }).join(',')
        let sql = `INSERT OR REPLACE INTO ${this.tableName}(${fields}) values (${values});`
        return sql
    }

}

class FindModel<T extends { [key in string]: unknown }> extends BaseModel<T>{
    constructor(private model: Model<T>, private fillModel: T | null) {
        super()
    }
    fill(model: Partial<T>) {
        Object.assign(this.fillModel, model)
        return new FillModel(this.model, this.fillModel)
    }
}

class FillModel<T extends { [key in string]: unknown }> extends BaseModel<T>{
    constructor(private model: Model<T>, private fillModel: Partial<T> | null) {
        super()
    }
    async save() {
        if (this.fillModel == null) {

        }
    }
}

export namespace Model {
    export type Fillable<T extends { [key in string]: unknown } = {}> = (keyof T)[]
    export type Hidden<T extends { [key in string]: unknown } = {}> = (keyof T)[]
}