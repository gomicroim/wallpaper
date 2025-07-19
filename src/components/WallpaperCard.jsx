import React from 'react';
import { Button, Tag } from 'antd';
import { PlayCircleOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';

function WallpaperCard({ wallpaper, onClick, onApply, isCurrent }) {
  const handleApplyClick = (e) => {
    e.stopPropagation();
    onApply(wallpaper);
  };

  return (
    <div className="wallpaper-card" onClick={onClick}>
      <div style={{ position: 'relative' }}>
        <img 
          src={wallpaper.preview} 
          alt={wallpaper.title}
          className="wallpaper-preview"
        />
        {isCurrent && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: '#52c41a',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <CheckCircleOutlined />
            当前壁纸
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {wallpaper.duration}
        </div>
      </div>
      
      <div className="wallpaper-info">
        <h3 className="wallpaper-title">{wallpaper.title}</h3>
        <p className="wallpaper-description">{wallpaper.description}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Tag color="blue">{wallpaper.category}</Tag>
          <span style={{ fontSize: '12px', color: '#999' }}>
            {wallpaper.resolution}
          </span>
        </div>
        
        <div className="wallpaper-actions">
          <Button 
            type="primary" 
            icon={<PlayCircleOutlined />}
            onClick={handleApplyClick}
            size="small"
          >
            应用壁纸
          </Button>
          <Button 
            icon={<EyeOutlined />}
            onClick={onClick}
            size="small"
          >
            查看详情
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WallpaperCard; 