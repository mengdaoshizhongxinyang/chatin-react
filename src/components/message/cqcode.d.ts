/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-07-09 15:38:03
 * @Description: 
 */
type CQcode = string
type CQcodeObject = CQcodeObjectImage | CQcodeObjectFile
type CQcodeObjectImage = {
  CQ: 'image'
  url: string
  file: String
}
type CQcodeObjectFile = {
  CQ: 'file'
  url: string
  file: String
}
type CQcodeObjectDetail<T extends CQcodeObject['CQ']> = Extract<CQcodeObject, { CQ: T }>