import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaUndo, FaSave, FaTimes } from 'react-icons/fa';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: black;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: calc(100% - 100px);
  object-fit: cover;
`;

const CapturedImage = styled.img`
  width: 100%;
  height: calc(100% - 100px);
  object-fit: cover;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.capture {
    background: white;
    color: black;
  }

  &:hover {
    background: ${props => props.className === 'capture' ? '#e0e0e0' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  font-size: 20px;
`;

function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            // 3秒倒计时后自动拍照
            setCountdown(3);
            const timer = setInterval(() => {
              setCountdown(prev => {
                if (prev <= 1) {
                  clearInterval(timer);
                  handleCapture();
                  return null;
                }
                return prev - 1;
              });
            }, 1000);
          };
        }
      } catch (err) {
        console.error('相机访问失败:', err);
        alert('无法访问相机，请确保已授予相机权限。');
        navigate('/');
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // 确保视频帧已经准备好
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      ctx.drawImage(video, 0, 0);
      // 添加短暂延时确保canvas渲染完成
      setTimeout(() => {
        const imageData = canvas.toDataURL('image/jpeg');
        if (imageData !== 'data:,') {
          setCapturedImage(imageData);
        }
      }, 100);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleSave = () => {
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `photo_${new Date().toISOString()}.jpg`;
    link.click();
  };

  return (
    <Container>
      {!capturedImage ? (
        <>
          <VideoPreview ref={videoRef} autoPlay playsInline />
          {countdown && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '72px',
              fontWeight: 'bold'
            }}>
              {countdown}
            </div>
          )}
        </>
      ) : (
        <CapturedImage src={capturedImage} alt="拍摄的照片" />
      )}
      
      <Controls>
        {!capturedImage ? (
          <Button className="capture" onClick={handleCapture}>
            <FaCamera />
          </Button>
        ) : (
          <>
            <Button onClick={handleRetake}>
              <FaUndo />
            </Button>
            <Button onClick={handleSave}>
              <FaSave />
            </Button>
          </>
        )}
      </Controls>

      <CloseButton onClick={() => navigate('/')}>
        <FaTimes />
      </CloseButton>
    </Container>
  );
}

export default Camera;