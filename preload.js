const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 用户相关
  getUserInfo: () => ipcRenderer.invoke('get-user-info'),
  saveUserInfo: (userInfo) => ipcRenderer.invoke('save-user-info', userInfo),
  
  // 壁纸相关
  getCurrentWallpaper: () => ipcRenderer.invoke('get-current-wallpaper'),
  setWallpaper: (videoPath) => ipcRenderer.invoke('set-wallpaper', videoPath),
  stopWallpaper: () => ipcRenderer.invoke('stop-wallpaper'),
  isWallpaperActive: () => ipcRenderer.invoke('is-wallpaper-active'),
  
  // 系统相关
  platform: process.platform,
  isDev: process.env.NODE_ENV === 'development'
}); 