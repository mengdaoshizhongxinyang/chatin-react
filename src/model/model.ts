/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-06 13:44:51
 * @Description: 
 */
import { getDB } from "@/utils/db";
export class Model<T extends {[key in string]:unknown}>{
    constructor(){
        this.tableName=this.constructor.name
    }
    protected fillable:Model.Fillable<T>=[]
    private tableName=''
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
    
    get(number:number){

    }
    
    test(){
        return this.tableName
    }
}
export namespace Model{
    export type Fillable<T extends {[key in string]:unknown}={}>=(keyof T)[]
}