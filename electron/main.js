const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  })

  // 加载打包后的文件
  const indexPath = path.join(__dirname, '../dist/index.html')
  win.loadFile(indexPath)
  
  // 隐藏菜单栏
  win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
