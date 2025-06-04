import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackToDesktop from './BackToDesktop';
import { FaUser } from 'react-icons/fa';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px;
  background-color: #fff;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
`;

const FriendsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  
  &:active {
    background-color: #f0f0f0;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  
  svg {
    color: #999;
    font-size: 20px;
  }
`;

const Name = styled.div`
  font-size: 16px;
  color: #333;
`;

// 模拟的好友数据
const friendsData = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
  { id: 5, name: '孙七' },
];

function FriendList() {
  const navigate = useNavigate();

  const handleFriendClick = (friendId) => {
    navigate(`/friend-profile/${friendId}`);
  };

  return (
    <Container>
      <BackToDesktop />
      <Header>好友列表</Header>
      <FriendsList>
        {friendsData.map((friend) => (
          <FriendItem
            key={friend.id}
            onClick={() => handleFriendClick(friend.id)}
          >
            <Avatar>
              <FaUser />
            </Avatar>
            <Name>{friend.name}</Name>
          </FriendItem>
        ))}
      </FriendsList>
    </Container>
  );
}

export default FriendList;