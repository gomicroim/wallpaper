import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Avatar, Dropdown, message, Tag, Space } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

// 模拟壁纸数据
const mockWallpapers = {
  1: {
    id: 1,
    title: '星空夜晚',
    description: '美丽的星空夜景，让人心旷神怡。在这个宁静的夜晚，繁星点点，银河横跨天际，仿佛整个宇宙都在为你闪耀。',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    category: 'nature',
    duration: '00:30',
    resolution: '1920x1080',
    fileSize: '15.2 MB',
    author: 'Nature Studio',
    tags: ['星空', '夜晚', '自然', '宁静']
  },
  2: {
    id: 2,
    title: '海浪拍岸',
    description: '宁静的海浪声，带来内心的平静。海浪有节奏地拍打着海岸，白色的浪花在阳光下闪闪发光，让人感受到大海的无限魅力。',
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    category: 'ocean',
    duration: '00:45',
    resolution: '1920x1080',
    fileSize: '28.5 MB',
    author: 'Ocean Films',
    tags: ['海浪', '海洋', '平静', '自然']
  }
  // 可以继续添加更多壁纸数据
};

function WallpaperDetail({ userInfo, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wallpaper, setWallpaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      const data = mockWallpapers[id];
      if (data) {
        setWallpaper(data);
      } else {
        message.error('壁纸不存在');
        navigate('/');
      }
      setLoading(false);
    }, 1000);
  }, [id, navigate]);

  const handleApplyWallpaper = async () => {
    try {
      await window.electronAPI.setWallpaper(wallpaper.videoUrl);
      message.success('壁纸应用成功！');
    } catch (error) {
      message.error('应用壁纸失败，请重试');
    }
  };

  const handlePlayPreview = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    message.info('下载功能开发中...');
  };

  const handleShare = () => {
    message.info('分享功能开发中...');
  };

  const handleFavorite = () => {
    message.info('收藏功能开发中...');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => message.info('个人资料功能开发中...')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => message.info('设置功能开发中...')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: onLogout
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!wallpaper) {
    return null;
  }

  return (
    <div className="detail-container">
      {/* 视频播放区域 */}
      <video
        className="detail-video"
        src={wallpaper.videoUrl}
        autoPlay={isPlaying}
        loop
        muted
        controls={false}
        poster={wallpaper.preview}
      />
      
      {/* 控制按钮 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10
      }}>
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{ background: 'rgba(0, 0, 0, 0.5)', border: 'none', color: 'white' }}
        >
          返回
        </Button>
      </div>

      {/* 用户菜单 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10
      }}>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Button 
            type="text" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              color: 'white'
            }}
          >
            <Avatar size="small" icon={<UserOutlined />} />
            <span>{userInfo.identifier}</span>
          </Button>
        </Dropdown>
      </div>

      {/* 信息覆盖层 */}
      <div className="detail-overlay">
        <div className="detail-title">{wallpaper.title}</div>
        <div className="detail-description">{wallpaper.description}</div>
        
        {/* 标签 */}
        <div style={{ marginBottom: '20px' }}>
          <Space wrap>
            {wallpaper.tags.map((tag, index) => (
              <Tag key={index} color="blue">{tag}</Tag>
            ))}
          </Space>
        </div>

        {/* 壁纸信息 */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '24px',
          fontSize: '14px',
          opacity: 0.8
        }}>
          <span>时长: {wallpaper.duration}</span>
          <span>分辨率: {wallpaper.resolution}</span>
          <span>大小: {wallpaper.fileSize}</span>
          <span>作者: {wallpaper.author}</span>
        </div>

        {/* 操作按钮 */}
        <div className="detail-actions">
          <Button 
            type="primary" 
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleApplyWallpaper}
          >
            应用为壁纸
          </Button>
          
          <Button 
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handlePlayPreview}
          >
            {isPlaying ? '暂停预览' : '播放预览'}
          </Button>
          
          <Button 
            size="large"
            icon={<HeartOutlined />}
            onClick={handleFavorite}
          >
            收藏
          </Button>
          
          <Button 
            size="large"
            icon={<ShareAltOutlined />}
            onClick={handleShare}
          >
            分享
          </Button>
          
          <Button 
            size="large"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            下载
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WallpaperDetail; 