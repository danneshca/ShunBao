import React from 'react';
import styled from 'styled-components';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: white;
  }

  svg {
    font-size: 20px;
    color: #007aff;
  }
`;

function BackToDesktop() {
  const navigate = useNavigate();

  return (
    <BackButton onClick={() => navigate('/')} title="返回桌面">
      <FaHome />
    </BackButton>
  );
}

export default BackToDesktop;