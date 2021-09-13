/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-07 16:56:22
 * @Description: 
 */
declare module "i"{
    const Inflect:()=>{
        camelize:(lower_case_and_underscored_word:string,first_letter_in_uppercase:string)=>string
        classify:(table_name:string)=>string
        dasherize:(underscored_word:string)=>string
        tableize:(class_name:string)=>string
        demodulize:(class_name_in_module:string)=>string
        foreign_key:(class_name:string,separate_class_name_id_with_underscore:string)=>string
        inflections:{
            humans:string[]
            plurals:[RegExp,string][]
            singulars:[RegExp,string][]
            uncountables:string[]
        }
        ordinalize:(number:number)=>string
        pluralize:(word:string)=>string
        singularize:(word:string)=>string
        tableize:(class_name:string)=>string
        titleize:(word:string)=>string
        uncountability:(word:string)=>string
        underscore:(camel_cased_word:string)=>string
    }
    export default Inflect
}