/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-06 13:44:51
 * @Description: 
 */
import { getDB } from "@/utils/db";
import inflect from "i";


// class BaseModel<T extends { [key in string]: unknown }>{
//     constructor() { }
//     protected tableName = ''
//     protected fillable: Model.Fillable<T> = []
//     protected hidden: Model.Hidden<Record<string, unknown>> = []
//     protected inValue: string[] = []
//     protected whereValues: { field: string, option: string, value: any }[] = []
//     protected selected: (keyof T)[] = []
//     protected relations: Relations[] = []
//     protected orders: [string, 'asc' | 'desc'][] = []
// }
type HasOneRelation = ['HO', Model<{ [key in string]: unknown }>, string, string]
type HasManyRelation = ['HM', Model<{ [key in string]: unknown }>, string, string]
type HasManyThroughRelation = ['HMT', Model<{ [key in string]: unknown }>, string, string]
type Relations = HasOneRelation | HasManyRelation | HasManyThroughRelation

// type IAction<T extends {[key in string]:unknown},M extends Model<any>=Model<any>>={
//     select<P extends Extract<keyof T, string>[]>(fields: P):IModel<Pick<T, P[number]>,M>
//     first():Promise<T>
//     where<F extends Extract<keyof T, string>>(field: F, option: T[F]): IModel<T,M>;
//     where<F extends Extract<keyof T, string>>(field: F, option: Operators, value: T[F]) : IModel<T,M>
//     with<P extends Exclude<{
//         [key in keyof M]: M[key] extends () => HasOneRelation ? key : never
//     }[keyof M],keyof Model<T>>>(model:P):IModel<T,M>
//     fill(model:Partial<T>): IModel<T,M>
//     update(model: Partial<T>):Promise<void>
// }
type HasOne<T extends Model<any>> = ['HO', T, string, string]
type HasMany<T extends Model<any>> = ['HM', T, string, string]
type HasManyThrough<T extends Model<any>> = ['HMT', T, string, string]
type ReturnRelation<T extends ((() => Relations) | any)> = T extends () => ['HO' | 'HM' | 'HMT', Model<infer R>, string, string] ? R : any;

type ExcludeColumn = {
    select: 'select' | 'fill'
}
type IAction<
    T extends { [key in string]: unknown },
    M extends Model<any> = Model<any>,
    R extends { [key in string]: unknown } = {},
    K extends keyof ExcludeColumn = never
    > = {
        select<P extends Extract<keyof T, string>[]>(fields: P): IModel<Pick<T, P[number]>, M, R, K | 'select'>

        where<F extends Extract<keyof T, string>>(field: F, option: T[F]): IModel<T, M, R, K>;
        where<F extends Extract<keyof T, string>>(field: F, option: Operators, value: T[F]): IModel<T, M, R, K>
        with<P extends Exclude<{
            [key in keyof M]: M[key] extends () => HasOneRelation ? key : never
        }[keyof M], keyof Model<T>>>(model: P): IModel<T, M, R & { [key in P]: ReturnRelation<M[P]> }, K>

        with<P extends Exclude<{
            [key in keyof M]: M[key] extends () => HasManyRelation | HasManyThroughRelation ? key : never
        }[keyof M], keyof Model<T>>>(model: P): IModel<T, M, R & { [key in P]: ReturnRelation<M[P]>[] }, K>

        fill(model: Partial<T>): IModel<T, M, R, K>
        get(): Promise<(T & R)[]>
        first(): Promise<(T & R)>
        update(model?: Partial<T>): Promise<void>
    }
type IModel<T extends { [key in string]: unknown }, M extends Model<any> = Model<any>, R extends { [key in string]: unknown } = {}, K extends keyof ExcludeColumn = never> = {
    [key in Exclude<keyof IAction<T, M, R, K>, ExcludeColumn[K]>]: IAction<T, M, R, K>[key]
}

export class Model<T extends { [key in string]: unknown }> implements IModel<T>{
    protected tableName = ''
    protected fillable: Model.Fillable<T> = []
    protected hidden: Model.Hidden<Record<string, unknown>> = []
    protected inValue: string[] = []
    protected whereValues: { field: string, option: string, value: any }[] = []
    protected selected: (keyof T)[] = []
    protected relations: Relations[] = []
    protected orders: [string, 'asc' | 'desc'][] = []
    constructor() {
        if (this.tableName == '') {
            this.tableName = inflect().tableize(this.constructor.name)
        }
        return this
    }
    //
    //

    private fillModel: Partial<T> = {}
    select<P extends Extract<keyof T, string>[]>(fields: P) {
        this.selected = fields
        return this as unknown as IModel<Pick<T, P[number]>, this, {}, 'select'>
    }


    where<F extends Extract<keyof T, string>>(field: F, option: T[F]): IModel<T, this>;
    where<F extends Extract<keyof T, string>>(field: F, option: Operators, value: T[F]): IModel<T, this>
    where<F extends Extract<keyof T, string>>(field: F, option: Operators | T[F], value?: T[F]) {
        if (value == undefined) {
            this.whereValues.push({ field, option: '=', value: option })
        } else {
            this.whereValues.push({ field, option: option as string, value })
        }
        return this as unknown as IModel<T, this>;
    }

    // in(inValue: string[]) {
    //     this.inValue = inValue
    //     return this
    // }

    destroy() {

    }

    fill(model: Partial<T>) {
        this.fillModel = model
        return this as unknown as IModel<T, this>
    }
    orderBy(column: [string, 'asc' | 'desc'][]): Model<T>
    orderBy(column: Extract<keyof T, string> | [string, 'asc' | 'desc'][], direction: 'desc' | 'asc' = 'asc') {
        if (column instanceof Array) {
            this.orders = column
        } else {
            this.orders.push([column, direction])
        }
        return this
    }

    with<P extends Exclude<{
        [key in keyof this]: this[key] extends () => HasOneRelation ? key : never
    }[keyof this], keyof Model<T>>>(model: P): IModel<T, this, { [key in P]: ReturnRelation<this[P]> }>
    with<P extends Exclude<{
        [key in keyof this]: this[key] extends () => HasManyThroughRelation | HasManyRelation ? key : never
    }[keyof this], keyof Model<T>>>(model: P): IModel<T, this, { [key in P]: ReturnRelation<this[P]>[] }>
    with<P extends Extract<{
        [key in keyof this]: this[key] extends () => Relations ? key : never
    }[keyof this], keyof Model<T>>>(model: P) {
        const relations = (this[model] as () => Relations)()
        if (relations[0] == 'HO') {
            return this as unknown as IModel<T, this, { [key in P]: ReturnRelation<this[P]> }>
        } else {
            return this as unknown as IModel<T, this, { [key in P]: ReturnRelation<this[P]>[] }>
        }
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

    async update(model: Partial<T> = {}) {

        let insertSql = Object.entries(model).map(([key, value]) => {
            return `${key} = ${typeof value == 'string' ? `'${value}'` : value}`
        }).join(',')
        if (insertSql) {
            let db = await getDB()
            await db.run(`UPDATE ${this.tableName} SET ${insertSql} ${this.mergeWhere()}`)
            db.close()
        } else {

        }
    }

    protected hasOne<P extends { [key in string]: unknown }, R extends Model<P>>(
        model: R,
        ownerKey: Extract<keyof T, string>,
        foreignKey: Extract<keyof P, string>
    ) {
        return ['HO', model, ownerKey, foreignKey] as unknown as HasOne<R>
    }

    protected hasMany<P extends { [key in string]: unknown }, R extends Model<P>>(
        model: R,
        ownerKey: Extract<keyof T, string>,
        foreignKey: Extract<keyof P, string>
    ) {
        return ['HM', model, ownerKey, foreignKey] as unknown as HasMany<R>
    }

    private mergeWhere() {
        return this.whereValues.length > 0 ?
            ` where ${this.whereValues.map(where => `${where.field} ${where.option} ${typeof where.value == 'string' ? `'${where.value}'` : where.value}`).join(' AND ')}`
            : ''
    }

    private selectSql() {
        return `select ${this.selected.join(',') || this.fillable.join(',')} from ${this.tableName} ${this.mergeWhere()}`
    }

    private insertSql(model: Partial<T>) {
        let keyValue = Array.from(Object.entries(model))
        let fields = keyValue.map(([key, value]) => {
            return key
        }).join(',')
        let values = keyValue.map(([key, value]) => {
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
        let values = keyValue.map(([key, value]) => {
            if (typeof value == 'string') {
                return `'${value.replaceAll("'", "''")}'`
            }
            return value
        }).join(',')
        let sql = `INSERT OR REPLACE INTO ${this.tableName}(${fields}) values (${values});`
        return sql
    }
}

type Operators = '=' | '<' | '>' | '<=' | '>=' | '<>' | '!=' |
    'like' | 'like binary' | 'not like' | 'between' | 'ilike' |
    '&' | '|' | '^' | '<<' | '>>' |
    'rlike' | 'regexp' | 'not regexp' |
    '~' | '~*' | '!~' | '!~*' | 'similar to' |
    'not similar to' | 'not ilike' | '~~*' | '!~~*'
export namespace Model {
    export type Fillable<T extends object> = (keyof T)[]
    export type Hidden<T extends object> = (keyof T)[]
    export type RelationField<T extends Model<{ [key in string | symbol | number]: unknown }>> = {
        [key in keyof T]: T[key] extends () => T ? key : never
    }[keyof T]
    export type Relation = Relations
}

