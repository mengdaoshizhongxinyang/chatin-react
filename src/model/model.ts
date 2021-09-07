/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-06 13:44:51
 * @Description: 
 */
import { getDB } from "@/utils/db";
import inflect  from "i";
export class Model<T extends {[key in string]:unknown}>{
    constructor(){
        if(this.tableName==''){
            console.log(inflect())
            this.tableName=inflect().tableize(this.constructor.name)
        }
    }
    protected fillable:Model.Fillable<T>=[]
    protected tableName=''
    private inValue:string[]=[]
    private whereValues:{field:string,option:string,value:unknown}[]=[]

    where(field:string,option:string,value:unknown){
        this.whereValues.push({field,option,value})
        return this
    }

    in(inValue:string[]){
        this.inValue=inValue
        return this
    }

    destroy(){
        
    }

    async get<T =Record<string,unknown>>(number:number|undefined=undefined){
        let db=await getDB()
        console.log(this.selectSql())
        return await db.all<T>(this.selectSql())
    }
    
    first(){
        
    }

    private selectSql(){
        return `select ${this.fillable.join(',')} from ${this.tableName}${this.whereValues.length>0?
            ` where ${this.whereValues.map(where=>`${where.field} ${where.option} ${where.value}`).join(' AND ')}`:''}
        `
    }
    
}
export namespace Model{
    export type Fillable<T extends {[key in string]:unknown}={}>=(keyof T)[]
}