/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-06 13:44:51
 * @Description: 
 */
import { getDB } from "@/utils/db";
import inflect from "i";
class BaseModel<T extends { [key in string]: unknown }>{
    constructor(){}
    protected tableName=''
    protected fillable: Model.Fillable<T> = []
    protected inValue: string[] = []
    protected whereValues: { field: string, option: string, value: unknown }[] = []

}
export class Model<T extends { [key in string]: unknown }> extends BaseModel<T>{
    constructor(){
        super()
        if (this.tableName == '') {
            console.log(inflect())
            this.tableName = inflect().tableize(this.constructor.name)
        }
    }
    
    private fillModel:Partial<T>={}
    where(field: string, option: string, value: unknown) {
        this.whereValues.push({ field, option, value })
        return this
    }

    in(inValue: string[]) {
        this.inValue = inValue
        return this
    }

    destroy() {

    }

    fill(model:Partial<T>){
        this.fillModel=model
        return this
    }

    async get(limit: number | undefined = undefined,offset:number=0) {
        let db = await getDB()
        let data= await db.all<T>(`${this.selectSql()}${limit?` limit ${limit} offset ${offset}`:''}`)
        db.close()
        return data
    }

    async first() {
        let db=await getDB()
        let data= await db.get<T>(this.selectSql())
        db.close()
        return data
    }
    async created(model?:Partial<T>|Partial<T>[]){
        let insertSql=''
        if(model instanceof Array){
            model.forEach(item=>{
                insertSql+=this.insertSql(item)+'\n';
            })
        }else if(model){
            insertSql+=this.insertSql(model)+'\n';
        }else if(this.fillModel){
            insertSql+=this.insertSql(this.fillModel)+'\n';
        }
        if(insertSql){
            let db=await getDB()
            let t=await db.exec(insertSql)
            db.close()
        }else{

        }
    }

    private selectSql() {
        return `select ${this.fillable.join(',')} from ${this.tableName}${this.whereValues.length > 0 ?
            ` where ${this.whereValues.map(where => `${where.field} ${where.option} ${where.value}`).join(' AND ')}` : ''}
        `
    }

    private insertSql(model:Partial<T>) {
        let keyValue=Array.from(Object.entries(model))
        let fields=keyValue.map(([key,value])=>{
            return key
        }).join(',')
        let values=keyValue.map(([key,value]:[string,string])=>{
            return value.replaceAll("'","''")
        }).join(',')
        return `insert into ${this.tableName}(${fields}) values (${values});`
    }

}

class FindModel<T extends { [key in string]: unknown }> extends BaseModel<T>{
    constructor(private model:Model<T>,private fillModel:T|null){
        super()
    }
    fill(model:Partial<T>){
        Object.assign(this.fillModel,model)
        return new FillModel(this.model,this.fillModel)
    }
}

class FillModel<T extends { [key in string]: unknown }> extends BaseModel<T>{
    constructor(private model:Model<T>,private fillModel:Partial<T>|null){
        super()
    }
    async save(){
        if(this.fillModel==null){
            
        }
    }
}

export namespace Model {
    export type Fillable<T extends { [key in string]: unknown } = {}> = (keyof T)[]
}