/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-30 23:34:39
 * @Description: 
 */
export class Schema {
    private sql=""
    constructor(table: string, option: Blueprint.Option, create: (blueprint: Blueprint) => void) {
        let blueprint = new Blueprint(table, option)
        create(blueprint)
        this.sql= '' + blueprint
    }
    get(){
        return this.sql
    }
}
class Blueprint {
    private fields: Field[] = []
    constructor(private table: string, private option: Blueprint.Option) {
        this.table = table
    }
    string(fieldName: string) {
        let field = new StringField(fieldName)
        this.fields.push(field)
        return field
    }
    integer(fieldName:string){
        let field=new IntegerField(fieldName)
        this.fields.push(field)
        return field
    }
    bigint(fieldName:string){
        let field=new BigIntegerField(fieldName)
        this.fields.push(field)
        return field
    }
    text(fieldName:string){
        let field=new TextField(fieldName)
        this.fields.push(field)
        return field
    }
    private valueOf() {
        return `create table ${this.table}(
    ${this.fields.map(item => {
            return '' + item
        }).join(',\n\t')}
)`
    }
}
namespace Blueprint {
    export type Option = 'create' | 'update'
    export type FieldType='string' | 'text' | 'integer' | 'bigint'
}
class Field {
    protected isNotNull: boolean = false
    protected defaultValue: string = ''
    protected length: number|null = null
    protected type: string = ''
    constructor(protected field: string) { }
    notNull() {
        this.isNotNull = true
        return this
    }
    setLength(length: number) {
        this.length = length
        return this
    }
    protected valueOf() {
        return `'${this.field}' ${this.type}${this.length!=null?`(${this.length})`:''}${this.isNotNull ? ' NOT NULL' : ''}`
    }
}
class StringField extends Field {
    protected length = 255
    protected type = 'varchar'
}
class IntegerField extends Field {
    protected type = 'int'
}
class BigIntegerField extends Field {
    protected type = 'bigint'
}
class TextField extends Field {
    protected type = 'text'
    setLength(){
        return this
    }
}