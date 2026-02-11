const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // 允许 ES 模块和本地文件访问
      webSecurity: false,
      // 允许运行不安全的内容（本地开发）
      allowRunningInsecureContent: true
    }
  })

  // 暂时开启开发者工具，方便用户看到错误信息
  win.webContents.openDevTools()

  // 正确的路径处理
  // __dirname 在打包后指向 resources/app.asar/electron
  // 所以 ../dist 会指向 resources/app.asar/dist
  const indexPath = path.join(__dirname, '../dist/index.html')
  
  console.log('=== Electron 调试信息 ===')
  console.log('是否打包:', app.isPackaged)
  console.log('__dirname:', __dirname)
  console.log('加载路径:', indexPath)
  console.log('========================')

  win.loadFile(indexPath).catch(err => {
    console.error('❌ 加载失败:', err)
  })
  
  // 监听加载错误
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ 页面加载失败!')
    console.error('错误代码:', errorCode)
    console.error('错误描述:', errorDescription)
    console.error('URL:', validatedURL)
  })

  // 监听页面加载完成
  win.webContents.on('did-finish-load', () => {
    console.log('✅ 页面加载完成')
  })

  // 打印控制台消息
  win.webContents.on('console-message', (event, level, message) => {
    console.log(`[浏览器控制台] ${message}`)
  })
  
  // 隐藏菜单栏
  win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
