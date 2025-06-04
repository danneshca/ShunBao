import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaComment, FaShare, FaPlay, FaPause } from 'react-icons/fa';
import BackToDesktop from './BackToDesktop';

const Container = styled.div`
  height: 100%;
  background: black;
  position: relative;
  overflow: hidden;
`;

const VideoContainer = styled.div`
  height: 100%;
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const VideoItem = styled.div`
  height: 100%;
  scroll-snap-align: start;
  position: relative;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Controls = styled.div`
  position: absolute;
  right: 10px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  span {
    font-size: 12px;
  }
`;

const PlayPauseButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 48px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s;
`;

const UserInfo = styled.div`
  position: absolute;
  left: 10px;
  bottom: 100px;
  color: white;

  h3 {
    margin: 0;
    font-size: 16px;
  }

  p {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const mockVideos = [
  {
    id: 1,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    author: '用户A',
    description: '美丽的风景 #旅行 #风景',
    likes: 1234,
    comments: 89,
    shares: 45
  },
  {
    id: 2,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    author: '用户B',
    description: '早安 #生活 #日常',
    likes: 892,
    comments: 56,
    shares: 23
  },
  {
    id: 3,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    author: '用户C',
    description: '海边日落 #海洋 #日落',
    likes: 2341,
    comments: 167,
    shares: 89
  },
  {
    id: 4,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    author: '美食达人',
    description: '今日美食分享 #美食 #烹饪',
    likes: 3456,
    comments: 234,
    shares: 156
  },
  {
    id: 5,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    author: '瑜伽教练小美',
    description: '晨练瑜伽 #运动 #健康',
    likes: 2789,
    comments: 198,
    shares: 145
  },
  {
    id: 6,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    author: '城市摄影师',
    description: '城市夜景 #城市 #夜景',
    likes: 4567,
    comments: 345,
    shares: 234
  },
  {
    id: 7,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    author: '咖啡师小王',
    description: '手冲咖啡教程 #咖啡 #生活',
    likes: 1876,
    comments: 145,
    shares: 98
  }
];

function ShortVideo() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.dataset.index);
          setCurrentVideo(index);
          videoRefs.current[index].play();
        } else {
          const index = Number(entry.target.dataset.index);
          videoRefs.current[index].pause();
        }
      });
    }, options);

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video.parentElement);
    });

    return () => {
      videoRefs.current.forEach(video => {
        if (video) observer.unobserve(video.parentElement);
      });
    };
  }, []);

  const togglePlay = (index) => {
    if (videoRefs.current[index].paused) {
      videoRefs.current[index].play();
      setIsPlaying(true);
    } else {
      videoRefs.current[index].pause();
      setIsPlaying(false);
    }
  };

  const handleVideoClick = () => {
    setShowPlayButton(true);
    setTimeout(() => setShowPlayButton(false), 2000);
    togglePlay(currentVideo);
  };

  return (
    <Container>
      <BackToDesktop />
      <VideoContainer>
        {mockVideos.map((video, index) => (
          <VideoItem key={video.id} data-index={index} onClick={handleVideoClick}>
            <Video
              ref={el => videoRefs.current[index] = el}
              src={video.url}
              loop
              playsInline
              webkit-playsinline="true"
            />
            <UserInfo>
              <h3>{video.author}</h3>
              <p>{video.description}</p>
            </UserInfo>
            <Controls>
              <ControlButton>
                <FaHeart />
                <span>{video.likes}</span>
              </ControlButton>
              <ControlButton>
                <FaComment />
                <span>{video.comments}</span>
              </ControlButton>
              <ControlButton>
                <FaShare />
                <span>{video.shares}</span>
              </ControlButton>
            </Controls>
            <PlayPauseButton visible={showPlayButton}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </PlayPauseButton>
          </VideoItem>
        ))}
      </VideoContainer>
    </Container>
  );
}

export default ShortVideo;