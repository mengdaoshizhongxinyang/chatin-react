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
    }
    export default Inflect
}