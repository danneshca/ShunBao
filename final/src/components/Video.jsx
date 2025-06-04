import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaComment, FaShare, FaPlay, FaPause } from 'react-icons/fa';
import BackToDesktop from './BackToDesktop';

const Container = styled.div`
  height: 100%;
  background-color: #000;
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

const VideoWrapper = styled.div`
  height: 100%;
  scroll-snap-align: start;
  position: relative;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoControls = styled.div`
  position: absolute;
  right: 10px;
  bottom: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
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

  &:hover {
    opacity: 0.8;
  }
`;

const VideoInfo = styled.div`
  position: absolute;
  bottom: 20px;
  left: 10px;
  color: white;
  padding: 10px;

  h3 {
    margin: 0;
    font-size: 16px;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
  }
`;

const PlayPauseOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 48px;
  opacity: ${props => props.visible ? 0.8 : 0};
  transition: opacity 0.3s;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.3);
  width: 100%;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #ff4040;
  width: ${props => props.progress}%;
`;

function Video() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState([0, 0, 0]);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  const videos = [
    {
      id: 1,
      url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
      title: '可爱的兔子',
      author: '@动物频道'
    },
    {
      id: 2,
      url: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4',
      title: '海底世界',
      author: '@海洋探索'
    },
    {
      id: 3,
      url: 'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
      title: '奇幻冒险',
      author: '@动画世界'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
        if (index !== currentVideoIndex) {
          setCurrentVideoIndex(index);
          setIsPlaying(false);
        }
      }
    };

    containerRef.current?.addEventListener('scroll', handleScroll);
    return () => containerRef.current?.removeEventListener('scroll', handleScroll);
  }, [currentVideoIndex]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.play();
      } else {
        currentVideo.pause();
      }
    }
  }, [isPlaying, currentVideoIndex]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      const handleTimeUpdate = () => {
        const progress = (currentVideo.currentTime / currentVideo.duration) * 100;
        setProgress(progress);
      };
      currentVideo.addEventListener('timeupdate', handleTimeUpdate);
      return () => currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [currentVideoIndex]);

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = (index) => {
    const newLikes = [...likes];
    newLikes[index] += 1;
    setLikes(newLikes);
  };

  return (
    <Container>
      <BackToDesktop />
      <VideoContainer ref={containerRef}>
        {videos.map((video, index) => (
          <VideoWrapper key={video.id}>
            <StyledVideo
              ref={el => videoRefs.current[index] = el}
              src={video.url}
              loop
              onClick={handleVideoClick}
            />
            <PlayPauseOverlay visible={!isPlaying}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </PlayPauseOverlay>
            <VideoControls>
              <ControlButton onClick={() => handleLike(index)}>
                <FaHeart color={likes[index] > 0 ? '#ff4040' : 'white'} />
                <span>{likes[index]}</span>
              </ControlButton>
              <ControlButton>
                <FaComment />
                <span>评论</span>
              </ControlButton>
              <ControlButton>
                <FaShare />
                <span>分享</span>
              </ControlButton>
            </VideoControls>
            <VideoInfo>
              <h3>{video.title}</h3>
              <p>{video.author}</p>
            </VideoInfo>
            <ProgressBar>
              <Progress progress={index === currentVideoIndex ? progress : 0} />
            </ProgressBar>
          </VideoWrapper>
        ))}
      </VideoContainer>
    </Container>
  );
}

export default Video;