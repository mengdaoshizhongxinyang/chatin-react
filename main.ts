/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-06-28 13:56:11
 * @Description: 
 */

import { app, BrowserWindow } from 'electron'

let mainWindow: BrowserWindow | null = null
function createWindow() {

  mainWindow = new BrowserWindow({ width: 800, height: 600,title:"gugugu",icon:"./favicon.ico" })
  mainWindow.setMenu(null)

  mainWindow.loadURL('http://localhost/');

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})