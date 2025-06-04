import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import BackToDesktop from './BackToDesktop';
import { FaUser, FaComment, FaVideo } from 'react-icons/fa';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
`;

const ProfileSection = styled.div`
  background-color: #fff;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  
  svg {
    color: #999;
    font-size: 40px;
  }
`;

const Name = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const ActionsContainer = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 20px;
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  
  svg {
    font-size: 24px;
    color: #07c160;
    margin-bottom: 5px;
  }
  
  span {
    font-size: 14px;
    color: #333;
  }
  
  &:active {
    opacity: 0.7;
  }
`;

// 模拟的好友数据
const friendsData = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
  { id: 5, name: '孙七' },
];

function FriendProfile() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  
  const friend = friendsData.find(f => f.id === parseInt(friendId));

  const handleMessage = () => {
    // 发消息功能待实现
    console.log('发送消息给:', friend.name);
  };

  const handleVideoCall = () => {
    navigate('/wechat', { state: { view: 'call' } });
  };

  if (!friend) {
    return <div>好友不存在</div>;
  }

  return (
    <Container>
      <BackToDesktop />
      <ProfileSection>
        <Avatar>
          <FaUser />
        </Avatar>
        <Name>{friend.name}</Name>
        <ActionsContainer>
          <ActionButton onClick={handleMessage}>
            <FaComment />
            <span>发消息</span>
          </ActionButton>
          <ActionButton onClick={handleVideoCall}>
            <FaVideo />
            <span>视频通话</span>
          </ActionButton>
        </ActionsContainer>
      </ProfileSection>
    </Container>
  );
}

export default FriendProfile;