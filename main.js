const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require('electron');
const path = require('path');
const Store = require('electron-store');
const ffi = require('ffi-napi');
const ref = require('ref-napi');

// 初始化存储
const store = new Store();

let mainWindow;
let wallpaperWindow;
let isWallpaperActive = false;

// Windows API 函数定义
const user32 = ffi.Library('user32', {
  'FindWindowA': ['long', ['string', 'string']],
  'SetParent': ['long', ['long', 'long']],
  'SetWindowPos': ['int', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
  'GetSystemMetrics': ['int', ['int']],
  'SetWindowLongPtrA': ['long', ['long', 'int', 'long']],
  'GetWindowLongPtrA': ['long', ['long', 'int']],
  'ShowWindow': ['int', ['long', 'int']],
  'UpdateWindow': ['int', ['long']],
  'SetWindowTextA': ['int', ['long', 'string']],
  'GetDesktopWindow': ['long', []],
  'GetWindowRect': ['int', ['long', 'pointer']],
  'MoveWindow': ['int', ['long', 'int', 'int', 'int', 'int', 'int']]
});

const kernel32 = ffi.Library('kernel32', {
  'GetLastError': ['uint', []]
});

// 常量定义
const GWL_EXSTYLE = -20;
const WS_EX_LAYERED = 0x80000;
const WS_EX_TRANSPARENT = 0x20;
const SW_HIDE = 0;
const SW_SHOW = 5;
const HWND_TOP = 0;
const SWP_NOACTIVATE = 0x10;
const SWP_SHOWWINDOW = 0x40;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: '动态壁纸'
  });

  // 开发环境加载本地服务器，生产环境加载构建文件
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createWallpaperWindow(videoPath) {
  if (wallpaperWindow) {
    wallpaperWindow.close();
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  wallpaperWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 设置壁纸窗口为桌面背景
  setWallpaperAsBackground(wallpaperWindow.getNativeWindowHandle());

  // 加载壁纸播放页面
  if (process.env.NODE_ENV === 'development') {
    wallpaperWindow.loadURL(`http://localhost:3000/wallpaper?video=${encodeURIComponent(videoPath)}`);
  } else {
    wallpaperWindow.loadFile(path.join(__dirname, 'dist/index.html'), {
      hash: `/wallpaper?video=${encodeURIComponent(videoPath)}`
    });
  }

  isWallpaperActive = true;
}

function setWallpaperAsBackground(hwnd) {
  try {
    // 获取桌面窗口句柄
    const desktopHwnd = user32.GetDesktopWindow();
    
    // 设置壁纸窗口为桌面的子窗口
    user32.SetParent(hwnd, desktopHwnd);
    
    // 设置窗口样式
    const exStyle = user32.GetWindowLongPtrA(hwnd, GWL_EXSTYLE);
    user32.SetWindowLongPtrA(hwnd, GWL_EXSTYLE, exStyle | WS_EX_LAYERED | WS_EX_TRANSPARENT);
    
    // 设置窗口位置和大小
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    user32.SetWindowPos(hwnd, HWND_TOP, 0, 0, width, height, SWP_NOACTIVATE | SWP_SHOWWINDOW);
    
    // 显示窗口
    user32.ShowWindow(hwnd, SW_SHOW);
    user32.UpdateWindow(hwnd);
    
    console.log('壁纸窗口设置成功');
  } catch (error) {
    console.error('设置壁纸窗口失败:', error);
  }
}

function stopWallpaper() {
  if (wallpaperWindow) {
    wallpaperWindow.close();
    wallpaperWindow = null;
    isWallpaperActive = false;
  }
}

// IPC 事件处理
ipcMain.handle('get-user-info', () => {
  return store.get('userInfo');
});

ipcMain.handle('save-user-info', (event, userInfo) => {
  store.set('userInfo', userInfo);
  return true;
});

ipcMain.handle('get-current-wallpaper', () => {
  return store.get('currentWallpaper');
});

ipcMain.handle('set-wallpaper', (event, videoPath) => {
  store.set('currentWallpaper', videoPath);
  createWallpaperWindow(videoPath);
  return true;
});

ipcMain.handle('stop-wallpaper', () => {
  stopWallpaper();
  store.delete('currentWallpaper');
  return true;
});

ipcMain.handle('is-wallpaper-active', () => {
  return isWallpaperActive;
});

// 应用生命周期事件
app.whenReady().then(() => {
  createMainWindow();

  // 注册全局快捷键
  globalShortcut.register('Ctrl+Shift+W', () => {
    if (isWallpaperActive) {
      stopWallpaper();
    }
  });

  // 应用启动时恢复上次的壁纸
  const lastWallpaper = store.get('currentWallpaper');
  if (lastWallpaper) {
    setTimeout(() => {
      createWallpaperWindow(lastWallpaper);
    }, 2000); // 延迟2秒启动壁纸
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  stopWallpaper();
}); 