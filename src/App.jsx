import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import WallpaperDetail from './components/WallpaperDetail';
import WallpaperPlayer from './components/WallpaperPlayer';
import Loading from './components/Loading';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户登录状态
    const checkAuth = async () => {
      try {
        const savedUserInfo = await window.electronAPI.getUserInfo();
        if (savedUserInfo) {
          setUserInfo(savedUserInfo);
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (loginData) => {
    try {
      // 这里可以添加实际的登录验证逻辑
      const userInfo = {
        id: Date.now(),
        ...loginData,
        loginTime: new Date().toISOString()
      };
      
      await window.electronAPI.saveUserInfo(userInfo);
      setUserInfo(userInfo);
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await window.electronAPI.saveUserInfo(null);
      setUserInfo(null);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // 检查当前路径是否为壁纸播放页面
  const isWallpaperPath = window.location.pathname === '/wallpaper';

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 壁纸播放页面 - 不需要登录检查 */}
          <Route 
            path="/wallpaper" 
            element={<WallpaperPlayer />} 
          />
          
          {/* 其他页面需要登录 */}
          <Route 
            path="/login" 
            element={
              userInfo ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
            } 
          />
          
          <Route 
            path="/" 
            element={
              userInfo ? <Home userInfo={userInfo} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/detail/:id" 
            element={
              userInfo ? <WallpaperDetail userInfo={userInfo} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 