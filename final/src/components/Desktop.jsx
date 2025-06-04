import React from 'react';
import styled from 'styled-components';
import { FaPhone, FaVideo, FaQrcode, FaComments, FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  padding: 20px;
  position: relative;
  overflow: auto;
`;

const StatusBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  font-size: 14px;
  z-index: 1000;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 20px;
  padding-top: 40px;
`;

const AppIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const IconCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  svg {
    font-size: 30px;
    color: white;
  }
`;

const AppName = styled.span`
  color: white;
  font-size: 12px;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

function Desktop() {
  const navigate = useNavigate();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const apps = [
    { id: 'phone', icon: FaPhone, name: '电话', path: '/phone', color: '#007AFF' },
    { id: 'wechat', icon: FaComments, name: '微信', path: '/wechat', color: '#34C759' },
    { id: 'short-video', icon: FaVideo, name: '短视频', path: '/short-video', color: '#FF2D55' }
  ];

  return (
    <Container>
      <StatusBar>
        {time.toLocaleTimeString()}
      </StatusBar>
      <Grid>
        {apps.map((app, index) => (
          <AppIcon key={index} onClick={() => navigate(app.path)}>
            <IconCircle color={app.color}>
              <app.icon />
            </IconCircle>
            <AppName>{app.name}</AppName>
          </AppIcon>
        ))}
      </Grid>
    </Container>
  );
}

export default Desktop;