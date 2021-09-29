/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-25 22:04:34
 * @Description: 
 */
import { combineReducers } from "redux";
import qqServer, { QQActions } from "./qqServer";
import { useStore as us } from "react-redux";
const rootReducer = combineReducers({
  qqServer
})

export const useStore = () => {
  return us<AppState, AppActions>()
}
export type AppState = ReturnType<typeof rootReducer>
export type AppActions = QQActions
export default rootReducer