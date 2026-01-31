# 💻 Windows 程序打包教程

## 方案选择

我推荐用 **Electron** 打包，因为：
- ✅ 生成标准的 Windows 安装包
- ✅ 双击安装，自动创建桌面图标
- ✅ 看起来像专业软件
- ✅ 不需要用户安装任何依赖

---

## 🔨 开始打包

### 第 1 步：安装 Electron
```bash
cd /Users/zzcnb123456/Desktop/抽奖机器/choujiang
npm install --save-dev electron electron-builder
```

### 第 2 步：创建 Electron 主程序

创建文件 `electron/main.js`：
```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // 加载打包后的文件
  win.loadFile('dist/index.html')
  
  // 隐藏菜单栏
  win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
```

### 第 3 步：修改 package.json

添加以下配置：
```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron:start": "electron .",
    "electron:build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.choujiang.app",
    "productName": "大连市自贸区税务局年会抽奖",
    "win": {
      "target": "nsis",
      "icon": "electron/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ]
  }
}
```

### 第 4 步：准备图标
- 需要一个 `icon.ico` 文件（256x256）
- 放在 `electron/icon.ico`

### 第 5 步：打包
```bash
npm run electron:build
```

等待 5-10 分钟，会生成：
```
dist-electron/
└── 大连市自贸区税务局年会抽奖 Setup 1.0.0.exe
```

---

## 📦 交付给用户

### 方式 1：只给 .exe 安装包
- 大小约 50-80MB
- 用户双击安装
- 自动创建桌面图标

### 方式 2：制作完整包（推荐）
```
年会抽奖系统/
├── 抽奖系统安装包.exe     # 安装程序
├── 使用说明.pdf           # 图文教程
├── 示例名单.xlsx          # Excel 模板
└── 快速开始.txt           # 简要说明
```

---

## 📝 使用说明.txt

```
【大连市自贸区税务局年会抽奖系统】

=== 安装步骤 ===
1. 双击"抽奖系统安装包.exe"
2. 选择安装位置（建议默认）
3. 点击"安装"
4. 完成后桌面会出现图标

=== 使用步骤 ===
1. 双击桌面图标打开程序
2. 准备 Excel 名单（参考"示例名单.xlsx"）
   - 第一列：姓名
   - 第二列：部门
3. 点击"上传Excel文件"，选择你的名单
4. 设置奖项（如：一等奖1人、二等奖3人）
5. 点击"🎉 开始抽奖 🎉"
6. 按空格键开始滚动
7. 再按空格键停止，显示中奖者
8. 继续按空格键进入下一个奖项

=== 投影仪使用 ===
- 连接投影仪后，按 F11 全屏显示
- 再按 F11 退出全屏

=== 常见问题 ===
Q: 能重新抽奖吗？
A: 点击左上角"← 返回配置"重新开始

Q: 中奖者会重复吗？
A: 不会，已中奖的人不会再参与后续抽奖

Q: 数据保存在哪里？
A: 只保存在本机，关闭程序后自动清除

技术支持：18004113808
```

---

## ⚠️ 注意事项

1. **Windows 防火墙/杀毒软件** 可能会拦截
   - 这是正常的（因为程序没有签名）
   - 点击"仍要运行"即可

2. **代码签名**（可选，需付费）
   - 如果不想被杀毒软件拦截
   - 需要购买代码签名证书（约 $200/年）

3. **体积较大**（50-80MB）
   - 因为包含了完整的浏览器引擎
   - U 盘拷贝或网盘分享都可以
