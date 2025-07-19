import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Dropdown, message } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import WallpaperCard from './WallpaperCard';

// 模拟壁纸数据
const mockWallpapers = [
  {
    id: 1,
    title: '星空夜晚',
    description: '美丽的星空夜景，让人心旷神怡',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    category: 'nature',
    duration: '00:30',
    resolution: '1920x1080'
  },
  {
    id: 2,
    title: '海浪拍岸',
    description: '宁静的海浪声，带来内心的平静',
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    category: 'ocean',
    duration: '00:45',
    resolution: '1920x1080'
  },
  {
    id: 3,
    title: '森林晨雾',
    description: '神秘的森林晨雾，充满诗意',
    preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    category: 'forest',
    duration: '01:00',
    resolution: '1920x1080'
  },
  {
    id: 4,
    title: '城市夜景',
    description: '繁华的城市夜景，灯火辉煌',
    preview: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4',
    category: 'city',
    duration: '00:40',
    resolution: '1920x1080'
  },
  {
    id: 5,
    title: '雪山日出',
    description: '壮丽的雪山日出，震撼人心',
    preview: 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    category: 'mountain',
    duration: '00:50',
    resolution: '1920x1080'
  },
  {
    id: 6,
    title: '花海绽放',
    description: '绚丽的花海，春天的气息',
    preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    category: 'flower',
    duration: '00:35',
    resolution: '1920x1080'
  },
  {
    id: 7,
    title: '沙漠日落',
    description: '金色的沙漠日落，温暖而神秘',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    category: 'desert',
    duration: '00:55',
    resolution: '1920x1080'
  },
  {
    id: 8,
    title: '极光舞动',
    description: '梦幻的极光，大自然的奇迹',
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4',
    category: 'aurora',
    duration: '01:10',
    resolution: '1920x1080'
  },
  {
    id: 9,
    title: '瀑布飞流',
    description: '壮观的瀑布，气势磅礴',
    preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    category: 'waterfall',
    duration: '00:42',
    resolution: '1920x1080'
  }
];

function Home({ userInfo, onLogout }) {
  const navigate = useNavigate();
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWallpaper, setCurrentWallpaper] = useState(null);

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setWallpapers(mockWallpapers);
      setLoading(false);
    }, 1000);

    // 获取当前壁纸状态
    const getCurrentWallpaper = async () => {
      try {
        const wallpaper = await window.electronAPI.getCurrentWallpaper();
        setCurrentWallpaper(wallpaper);
      } catch (error) {
        console.error('获取当前壁纸失败:', error);
      }
    };

    getCurrentWallpaper();
  }, []);

  const handleWallpaperClick = (wallpaper) => {
    navigate(`/detail/${wallpaper.id}`);
  };

  const handleApplyWallpaper = async (wallpaper) => {
    try {
      await window.electronAPI.setWallpaper(wallpaper.videoUrl);
      setCurrentWallpaper(wallpaper.videoUrl);
      message.success('壁纸应用成功！');
    } catch (error) {
      message.error('应用壁纸失败，请重试');
    }
  };

  const handleStopWallpaper = async () => {
    try {
      await window.electronAPI.stopWallpaper();
      setCurrentWallpaper(null);
      message.success('壁纸已停止');
    } catch (error) {
      message.error('停止壁纸失败，请重试');
    }
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

  return (
    <div className="home-container">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
            动态壁纸
          </h1>
          {currentWallpaper && (
            <Button 
              type="primary" 
              danger 
              size="small"
              onClick={handleStopWallpaper}
            >
              停止壁纸
            </Button>
          )}
        </div>
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Button type="text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <span>{userInfo.identifier}</span>
          </Button>
        </Dropdown>
      </div>

      <div className="wallpaper-grid">
        {wallpapers.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            onClick={() => handleWallpaperClick(wallpaper)}
            onApply={() => handleApplyWallpaper(wallpaper)}
            isCurrent={currentWallpaper === wallpaper.videoUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default Home; 