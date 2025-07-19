import React, { useEffect, useRef } from 'react';

function WallpaperPlayer() {
  const videoRef = useRef(null);

  useEffect(() => {
    // 从 URL 参数获取视频路径
    const urlParams = new URLSearchParams(window.location.search);
    const videoPath = urlParams.get('video');

    if (videoPath && videoRef.current) {
      videoRef.current.src = videoPath;
      videoRef.current.play().catch(error => {
        console.error('视频播放失败:', error);
      });
    }

    // 监听视频事件
    const video = videoRef.current;
    if (video) {
      const handleError = (e) => {
        console.error('视频播放错误:', e);
      };

      const handleLoadStart = () => {
        console.log('视频开始加载');
      };

      const handleCanPlay = () => {
        console.log('视频可以播放');
        video.play().catch(error => {
          console.error('自动播放失败:', error);
        });
      };

      video.addEventListener('error', handleError);
      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('canplay', handleCanPlay);

      return () => {
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  return (
    <div className="wallpaper-container">
      <video
        ref={videoRef}
        className="wallpaper-video"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1
        }}
      />
    </div>
  );
}

export default WallpaperPlayer; 