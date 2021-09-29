/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-30 23:34:39
 * @Description: 
 */
export namespace Schema {
    export function Create(table: string, create: (blueprint: CreateBlueprint) => void) {
        let sql = ""
        let blueprint = new CreateBlueprint(table)
        create(blueprint)
        sql = '' + blueprint
        return sql
    }
    export function Update(table: string, create: (blueprint: UpdateBlueprint) => void) {
        let sql = ""
        let blueprint = new UpdateBlueprint(table)
        create(blueprint)
        sql = '' + blueprint
        return sql
    }
    export function Drop(table: string) {
        return `DROP TABLE ${table};`
    }
    export function Rename(from: string, to: string) {
        return `ALTER TABLE ${from} RENAME TO ${to};`
    }
}

class Blueprint {

    protected fields: (Field | string)[] = []
    protected primaryKey:String[]=[]
    constructor(protected table: string) {
        this.table = table
    }

    string(fieldName: string, length: number = 255) {
        let field = new StringField(fieldName, length)
        this.fields.push(field)
        return field
    }
    char(fieldName: string, length: number) {
        let field = new StringField(fieldName, length)
        this.fields.push(field)
        return field
    }
    integer(fieldName: string) {
        let field = new IntegerField(fieldName)
        this.fields.push(field)
        return field
    }
    bigint(fieldName: string) {
        let field = new BigIntegerField(fieldName)
        this.fields.push(field)
        return field
    }
    text(fieldName: string) {
        let field = new TextField(fieldName)
        this.fields.push(field)
        return field
    }
    binary(fieldName: string) {
        let field = new BlobField(fieldName)
        this.fields.push(field)
        return field
    }

    primary(fieldName:string){
        this.primaryKey.push(fieldName)
    }

}
class CreateBlueprint extends Blueprint {
    private valueOf() {
        if(this.primaryKey.length){
            this.fields.push(`PRIMARY KEY ("${this.primaryKey.join('","')}")`)
        }
        return `create table ${this.table}(
    ${this.fields.map(item => {
            return '' + item
        }).join(',\n\t')}
)`
    }
}
class UpdateBlueprint extends Blueprint {
    private valueOf() {

    }
}
namespace Blueprint {
    export type FieldType = 'varchar' | 'text' | 'int' | 'bigint' | 'boolean' |
        'date' | 'datetime' | 'decimal' | 'double' | 'float' | 'blob'
}
function FieldDecorator(type: Blueprint.FieldType): any {
    return function (BaseCLass: { new(...args: any[]): Field }) {
        return class extends BaseCLass {
            protected type = type.toUpperCase()
        }
    }
}
abstract class BaseField {
    protected isNotNull: boolean = false
    protected defaultValue: unknown = ''
    protected length: number | null = null
    protected type: string = 'text'
    protected isChange: boolean = false
    protected isUnique: boolean = false
    constructor(protected field: string) { }
    notNull() {
        this.isNotNull = true
        return this
    }
    setLength(length: number) {
        this.length = length
        return this
    }
    default<T>(value: T) {
        this.defaultValue = value
        return this
    }
    protected valueOf() {
        return `'${this.field}' ${this.type.toUpperCase()}` +
            `${this.length != null ? `(${this.length})` : ''}`+
            `${this.defaultValue?typeof this.defaultValue=='string'?`DEFAULT '${this.defaultValue}'`:`DEFAULT ${this.defaultValue}`:`${this.isNotNull || this.isUnique ? ' NOT NULL' : ''}${this.isUnique ? ' UNIQUE' : ''}`}`
    }
    change() {
        this.isChange = true
    }
    unique() {
        this.isUnique = true
    }
}
class Field extends BaseField { }
@FieldDecorator('varchar')
class StringField extends Field {
    constructor(field: string, protected length: number = 255) {
        super(field)
        this.setLength(length)
    }
}
@FieldDecorator('int')
class IntegerField extends Field { }
@FieldDecorator('bigint')
class BigIntegerField extends Field { }
@FieldDecorator('text')
class TextField extends Field {
    setLength() {
        return this
    }
}
@FieldDecorator('blob')
class BlobField extends Field { }
