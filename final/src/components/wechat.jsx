import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPhone, FaVideo, FaMicrophone, FaMicrophoneSlash, FaUser, FaComment, FaArrowLeft } from 'react-icons/fa';
import ChatWindow from './ChatWindow';
import { useNavigate, useLocation } from 'react-router-dom';
import BackToDesktop from './BackToDesktop';
import { auth, friends, communications } from '../services/api';
import socketService from '../services/socket';

const Container = styled.div`
  height: 100%;
  background-color: #f8f8f8;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  h1 {
    font-size: 24px;
    color: #333;
    margin: 0;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
`;

const Greeting = styled.div`
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
`;

const QuickAccess = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
`;

const QuickAccessItem = styled.div`
  background: white;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  span {
    font-size: 16px;
    color: #333;
  }
`;

const HistorySection = styled.div`
  flex: 1;
  overflow-y: auto;
  
  h2 {
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
  }
`;

const HistoryItem = styled.div`
  background: white;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 10px;
  
  h3 {
    font-size: 16px;
    color: #333;
    margin: 0 0 5px 0;
  }
  
  p {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
  
  span {
    font-size: 12px;
    color: #999;
    float: right;
  }
`;

const InputSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: #f8f8f8;
  display: flex;
  gap: 10px;
`;

const VoiceButton = styled.button`
  background: #07C160;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  flex: 1;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const TextButton = styled.button`
  background: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
`;


const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover, &:active {
    background-color: #f0f0f0;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  
  svg {
    font-size: 20px;
    color: #666;
  }
`;

const FriendInfo = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const LastMessage = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MessageText = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageTime = styled.span`
  font-size: 12px;
  color: #999;
  margin-left: 10px;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000;
  position: absolute;
  top: 0;
  left: 0;
`;

const LocalVideo = styled.video`
  width: 120px;
  height: 160px;
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 10px;
  object-fit: cover;
  z-index: 2;
  background-color: #333;
`;

const RemoteVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  z-index: 3;
`;

const Button = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const AcceptButton = styled(Button)`
  background-color: #07C160;
`;

const DeclineButton = styled(Button)`
  background-color: #ff3b30;
`;

const ControlButton = styled(Button)`
  background-color: rgba(255, 255, 255, 0.2);
`;

const CallInfo = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  z-index: 3;

  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    opacity: 0.8;
  }
`;

function WeChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  
  const [state, setState] = useState({
    view: 'list',
    selectedFriend: null,
    callStatus: 'incoming',
    isMuted: false,
    callDuration: 0,
    currentUser: null,
    friendsData: [],
    isLoading: false,
    error: null,
    history: [
      {
        title: '坐公交车去医院',
        description: '北京大学人民医院，37路公交车',
        time: '今日 9:45'
      },
      {
        title: '我想在医院挂个号',
        description: '去北京大学人民医院骨科门诊看腿',
        time: '今日 9:45'
      },
      {
        title: '给儿子打视频',
        description: '',
        time: '今日 9:45'
      }
    ]
  });
  
  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };
  
  // 获取好友列表数据
  useEffect(() => {
    const loadFriends = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 设置加载状态
        setFriendsData([{id: 'loading', name: '加载中...', lastMessage: {text: '正在获取好友列表', time: ''}}]);
        
        const friendsList = await friends.getFriendList();
        
        if (!Array.isArray(friendsList)) {
          throw new Error('好友列表数据格式不正确');
        }
        
        if (friendsList.length > 0) {
          const friendsWithMessages = await Promise.all(
            friendsList.map(async (friend) => {
              try {
                const lastMessage = await communications.getLastMessage(friend.id);
                return {
                  ...friend,
                  lastMessage: lastMessage || { text: '暂无消息', time: '' }
                };
              } catch (error) {
                console.error(`获取好友 ${friend.id} 的最后消息失败:`, error);
                return {
                  ...friend,
                  lastMessage: { text: '暂无消息', time: '' }
                };
              }
            })
          );
          setFriendsData(friendsWithMessages);
        } else {
          setFriendsData([{id: 'no-friends', name: '暂无好友', lastMessage: {text: '添加好友开始聊天', time: ''}}]);
        }
      } catch (error) {
        console.error('获取好友列表失败:', error);
        setError(error.message);
        setFriendsData([{id: 'error', name: '加载失败', lastMessage: {text: `加载失败: ${error.message}`, time: ''}}]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFriends();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await auth.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    };

    fetchData();
    socketService.connect();

    socketService.onMessage((message) => {
      setFriendsData(prevFriends => {
        return prevFriends.map(friend => {
          if (friend.id === message.senderId) {
            return {
              ...friend,
              lastMessage: {
                text: message.content,
                time: new Date().toLocaleTimeString()
              }
            };
          }
          return friend;
        });
      });
    });

    socketService.onIncomingCall((data) => {
      setCallData(data);
      setView('call');
      setCallStatus('incoming');
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleFriendClick = useCallback((friend) => {
    setSelectedFriend(friend);
    setView('chat');
  }, []);

  const renderFriendList = useCallback(() => {
    return (
      <FriendList>
        {friendsData.map((friend) => (
          <FriendItem
            key={friend.id}
            onClick={() => handleFriendClick(friend)}
          >
            <Avatar>
              <FaUser />
            </Avatar>
            <FriendInfo>
              <Name>{friend.name}</Name>
              <LastMessage>
                <MessageText>
                  {friend.lastMessage?.text || '暂无消息'}
                </MessageText>
                <MessageTime>
                  {friend.lastMessage?.time || ''}
                </MessageTime>
              </LastMessage>
            </FriendInfo>
          </FriendItem>
        ))}
      </FriendList>
    );
  }, [friendsData, handleFriendClick]);

  const handleStartCall = (friendId) => {
    const roomId = `${currentUser.id}-${friendId}`;
    socketService.startCall({
      roomId,
      callerId: currentUser.id,
      callerName: currentUser.name
    });
    setView('call');
    setCallStatus('ongoing');
  };

  const handleAcceptCall = () => {
    if (callData) {
      socketService.acceptCall(callData.roomId);
      setCallStatus('ongoing');
    }
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setCallData(null);
    setTimeout(() => {
      setView('list');
      setCallStatus('incoming');
      setCallDuration(0);
    }, 2000);
  };

  const handleSendMessage = async (friendId, message) => {
    try {
      await communications.sendMessage(friendId, message);
      socketService.sendMessage({
        content: message,
        senderId: state.currentUser.id,
        receiverId: friendId
      });
      
      updateState({
        friendsData: state.friendsData.map(friend => {
          if (friend.id === friendId) {
            return {
              ...friend,
              lastMessage: {
                text: message,
                time: new Date().toLocaleTimeString()
              }
            };
          }
          return friend;
        })
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      updateState({ error: error.message });
    }
  };

  useEffect(() => {
    if (callStatus === 'ongoing' && view === 'call') {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callStatus, view]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoCall = (friend) => {
    setSelectedFriend(friend);
    setView('call');
    setCallStatus('incoming');
    setCallDuration(0);
  };

  const handleBackToList = () => {
    setSelectedFriend(null);
    setView('list');
  };

  return (
    <Container>
      {view === 'list' ? (
        <>
          <Header>
            <Title>微信</Title>
            <BackToDesktop />
          </Header>
          <Greeting>早安！愿您每天都如此美好！</Greeting>
          
          <QuickAccess>
            <QuickAccessItem onClick={() => handleFriendClick(state.friendsData[0])}>
              <img src="https://via.placeholder.com/40" alt="儿子" />
              <span>给儿子打视频</span>
            </QuickAccessItem>
            <QuickAccessItem>
              <FaCloud style={{ fontSize: '24px', color: '#07C160' }} />
              <span>今日天气</span>
            </QuickAccessItem>
          </QuickAccess>
          
          <HistorySection>
            <h2>历史记录</h2>
            {state.history.map((item, index) => (
              <HistoryItem key={index}>
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
                <span>{item.time}</span>
              </HistoryItem>
            ))}
          </HistorySection>
          
          <InputSection>
            <VoiceButton onClick={() => setIsRecording(!isRecording)}>
              <FaMicrophone />
              {isRecording ? '松开结束' : '按住说话'}
            </VoiceButton>
            <TextButton onClick={() => setIsVoiceMode(!isVoiceMode)}>
              <FaKeyboard />
            </TextButton>
          </InputSection>
        </>
      ) : view === 'chat' ? (
        <ChatWindow friend={selectedFriend} onBack={handleBackToList} onVideoCall={handleVideoCall} />
      ) : view === 'call' ? (
        <VideoContainer>
          <BackToDesktop />
          {callStatus === 'ongoing' && (
            <>
              <RemoteVideo autoPlay playsInline />
              <LocalVideo autoPlay playsInline muted />
            </>
          )}
          <CallInfo>
            <h2>微信视频通话</h2>
            {callStatus === 'ongoing' ? (
              <p>通话时长: {formatDuration(callDuration)}</p>
            ) : callStatus === 'incoming' ? (
              <p>正在等待接听...</p>
            ) : (
              <p>通话已结束</p>
            )}
          </CallInfo>
          <Controls>
            {callStatus === 'incoming' ? (
              <>
                <AcceptButton onClick={handleAcceptCall}>
                  <FaVideo />
                </AcceptButton>
                <DeclineButton onClick={handleEndCall}>
                  <FaPhone />
                </DeclineButton>
              </>
            ) : callStatus === 'ongoing' ? (
              <>
                <ControlButton onClick={toggleMute}>
                  {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </ControlButton>
                <DeclineButton onClick={handleEndCall}>
                  <FaPhone />
                </DeclineButton>
              </>
            ) : null}
          </Controls>
        </VideoContainer>
      ) : null}
    </Container>
  );
}

export default WeChat;