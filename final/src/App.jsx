import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// 导入功能组件
import Phone from './components/Phone';
import QRScanner from './components/QRScanner';
import WeChat from './components/WeChat';
import Home from './components/Home';
import Desktop from './components/Desktop';
import ShortVideo from './components/ShortVideo';
import Camera from './components/Camera';

const PhoneContainer = styled.div`
  width: 375px;
  height: 812px;
  background-color: white;
  border-radius: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const Screen = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;



function App() {
  return (
    <PhoneContainer>
      <Screen>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/desktop" element={<Desktop />} />
          <Route path="/phone" element={<Phone />} />
          <Route path="/qr-scanner" element={<QRScanner />} />
          <Route path="/wechat" element={<WeChat />} />
          <Route path="/short-video" element={<ShortVideo />} />
          <Route path="/camera" element={<Camera />} />
        </Routes>
      </Screen>
    </PhoneContainer>
  );
}

export default App;