const { app, BrowserWindow, session } = require('electron')
const path = require('node:path')

const isDev = process.env.NODE_ENV === 'development'

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#0e1420',
    autoHideMenuBar: true,
    show: false, // 콘텐츠 준비 전에 흰 화면이 잠깐 보이는 걸 방지 (ready-to-show 때 표시)
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    clearTimeout(forceShowTimer)
  })

  // ready-to-show가 어떤 이유로든(로딩 실패 등) 안 오면 창이 영원히 안 보이는 걸 방지.
  const forceShowTimer = setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.show()
    }
  }, 3000)

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error('페이지 로딩 실패:', errorCode, errorDescription)
    if (isDev) {
      // 보통 Vite 개발 서버가 아직 안 떠서 생기는 경우라 잠깐 뒤 재시도.
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.loadURL('http://localhost:5173')
      }, 1000)
    }
  })

  // 카메라(getUserMedia) 권한 자동 허용
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true)
    } else {
      callback(false)
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
