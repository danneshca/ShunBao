import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaVideo, FaPhone, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { communications } from '../services/api';
import socketService from '../services/socket';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  position: relative;
`;

const Header = styled.div`
  background-color: #07C160;
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  margin-right: 15px;
`;

const VideoCallButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  
  &:hover {
    opacity: 0.8;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 40%;
  background-color: #000;
  position: relative;
  display: ${props => props.isInCall ? 'block' : 'none'};
`;

const LocalVideo = styled.video`
  width: 120px;
  height: 90px;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 8px;
  object-fit: cover;
  z-index: 2;
  background-color: #333;
`;

const RemoteVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CallControls = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
  z-index: 3;
`;

const Dialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 300px;
  text-align: center;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const DialogButton = styled.button`
  padding: 8px 16px;
  border-radius: 5px;
  border: none;
  background-color: #07C160;
  color: white;
  cursor: pointer;
`;

const CallButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.color || 'rgba(255, 255, 255, 0.2)'};

  &:hover {
    transform: scale(1.1);
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  flex: 1;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  ${props => props.isInCall && 'height: 60%;'}
`;

const Message = styled.div`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  
  ${props => props.isSelf ? `
    align-self: flex-end;
    background-color: #95EC69;
  ` : `
    align-self: flex-start;
    background-color: white;
  `}
`;



function ChatWindow({ friend, onBack, onVideoCall }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState(() => {});

  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const messageListRef = useRef();

  useEffect(() => {
    // 加载聊天历史
    const loadChatHistory = async () => {
      try {
        const history = await communications.getChatHistory(friend.id);
        setMessages(history);
      } catch (error) {
        console.error('加载聊天历史失败:', error);
      }
    };

    loadChatHistory();

    // 加入聊天室
    const roomId = `chat-${friend.id}`;
    socketService.joinRoom(roomId);

    // 设置消息监听
    socketService.onMessage((message) => {
      if (message.senderId === friend.id) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: message.content,
          isSelf: false
        }]);
      }
    });

    // 设置视频通话相关监听
    socketService.onIncomingCall((data) => {
      if (data.callerId === friend.id) {
        setIsInCall(true);
        // 初始化本地视频流
        initLocalStream();
      }
    });

    socketService.onCallAccepted(() => {
      // 初始化对等连接
      initPeerConnection();
    });

    return () => {
      // 清理视频流
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [friend.id]);

  // 自动滚动到最新消息
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScan = (result) => {
    if (result) {
      const scannedText = result?.text || '无法识别的二维码';
      setScanResult(scannedText);
      
      const newMessage = {
        id: messages.length + 1,
        text: `扫描结果: ${scannedText}`,
        isSelf: true,
      };
      
      setMessages([...messages, newMessage]);
    }
  };

  const handleError = (error) => {
    console.error(error);
    setScanResult('扫描出错，请确保允许使用摄像头');
  };

  const handleStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      setIsInCall(true);
      
      // 通知对方来电
      socketService.startCall({
        roomId: `call-${friend.id}`,
        callerId: friend.id
      });
    } catch (error) {
      console.error('获取媒体流失败:', error);
    }
  };

  const handleEndCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsInCall(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await communications.sendMessage(friend.id, newMessage);
      socketService.sendMessage(newMessage, `chat-${friend.id}`);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: newMessage,
        isSelf: true
      }]);
      
      setNewMessage('');
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  const initLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
    } catch (error) {
      console.error('获取本地媒体流失败:', error);
    }
  };

  const initPeerConnection = async () => {
    // 这里需要实现WebRTC的对等连接逻辑
    // 由于实现较为复杂，建议使用专门的WebRTC库
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>
          <FaArrowLeft />
        </BackButton>
        <Title>{friend?.name || '聊天'}</Title>
        <VideoCallButton onClick={handleStartCall}>
          <FaVideo />
        </VideoCallButton>
      </Header>
      
      {showDialog && (
        <Dialog>
          <DialogContent>{dialogContent}</DialogContent>
          <DialogActions>
            <DialogButton onClick={() => {
              setShowDialog(false);
              dialogAction();
            }}>确定</DialogButton>
            <DialogButton onClick={() => setShowDialog(false)}>取消</DialogButton>
          </DialogActions>
        </Dialog>
      )}
      
      <VideoContainer isInCall={isInCall}>
        <RemoteVideo autoPlay playsInline />
        <LocalVideo autoPlay playsInline muted />
        <CallControls>
          <CallButton onClick={toggleMute}>
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </CallButton>
          <CallButton color="#ff3b30" onClick={handleEndCall}>
            <FaPhone />
          </CallButton>
        </CallControls>
      </VideoContainer>
      
      <MessageList isInCall={isInCall}>
        {messages.map(message => (
          <Message key={message.id} isSelf={message.isSelf}>
            {message.text}
          </Message>
        ))}
      </MessageList>
      
      <ScannerContainer>
        <QrReader
          constraints={{
            facingMode: 'environment'
          }}
          onResult={handleScan}
          onError={handleError}
          style={{ width: '100%' }}
        />
        <ScanResult>{scanResult}</ScanResult>
      </ScannerContainer>
    </Container>
  );
}

export default ChatWindow;