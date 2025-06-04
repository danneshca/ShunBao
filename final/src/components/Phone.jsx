import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPhone, FaBackspace, FaUser, FaHistory, FaKeyboard } from 'react-icons/fa';
import BackToDesktop from './BackToDesktop';

const Container = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const TabBar = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 10px;
  color: ${props => props.active ? '#007AFF' : '#666'};
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ContactList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ContactItem = styled.div`
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:active {
    background-color: #f0f0f0;
  }
`;

const CallRecord = styled(ContactItem)`
  .time {
    font-size: 12px;
    color: #666;
  }
`;

const NumberDisplay = styled.div`
  font-size: 36px;
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  color: #333;
  letter-spacing: 2px;
`;

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: auto;
`;

const Key = styled.button`
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    background-color: #d0d0d0;
  }
`;

const CallButton = styled(Key)`
  background-color: #4cd964;
  color: white;

  &:hover {
    background-color: #46c45a;
  }

  &:active {
    background-color: #40b352;
  }
`;

const CallInterface = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 40px 20px;
  z-index: 1000;
`;

const CallInfo = styled.div`
  text-align: center;

  h2 {
    font-size: 32px;
    margin-bottom: 10px;
  }

  p {
    color: #666;
  }
`;

const EndCallButton = styled(Key)`
  background-color: #ff3b30;
  color: white;
  margin-bottom: 40px;

  &:hover {
    background-color: #e6352b;
  }
`;

function Phone() {
  const [number, setNumber] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState('keypad');
  const [contacts] = useState([
    { id: 1, name: '张三', number: '13800138000' },
    { id: 2, name: '李四', number: '13900139000' },
    { id: 3, name: '王五', number: '13700137000' },
  ]);
  const [callHistory, setCallHistory] = useState([]);

  const handleKeyPress = (key) => {
    if (number.length < 11) {
      setNumber(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (number) {
      setIsInCall(true);
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      window.callTimer = timer;
    }
  };

  const handleContactCall = (contactNumber) => {
    setNumber(contactNumber);
    handleCall();
  };

  const handleEndCall = () => {
    setIsInCall(false);
    clearInterval(window.callTimer);
    const newCall = {
      number,
      duration: callDuration,
      time: new Date().toLocaleString(),
    };
    setCallHistory(prev => [newCall, ...prev]);
    setCallDuration(0);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Container>
      <BackToDesktop />
      {!isInCall ? (
        <>
          <TabBar>
            <TabButton 
              active={activeTab === 'keypad'} 
              onClick={() => setActiveTab('keypad')}
            >
              <FaKeyboard /> 键盘
            </TabButton>
            <TabButton 
              active={activeTab === 'recent'} 
              onClick={() => setActiveTab('recent')}
            >
              <FaHistory /> 最近
            </TabButton>
            <TabButton 
              active={activeTab === 'contacts'} 
              onClick={() => setActiveTab('contacts')}
            >
              <FaUser /> 联系人
            </TabButton>
          </TabBar>
          {activeTab === 'keypad' && (
            <>
              <NumberDisplay>{number || '输入电话号码'}</NumberDisplay>
              <Keypad>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
                  <Key key={key} onClick={() => handleKeyPress(key)}>{key}</Key>
                ))}
                <Key onClick={handleBackspace}>
                  <FaBackspace />
                </Key>
                <CallButton onClick={handleCall}>
                  <FaPhone />
                </CallButton>
              </Keypad>
            </>
          )}
          {activeTab === 'recent' && (
            <ContactList>
              {callHistory.map((call, index) => (
                <CallRecord key={index} onClick={() => handleContactCall(call.number)}>
                  <div>
                    <div>{call.number}</div>
                    <div className="time">{call.time}</div>
                  </div>
                  <CallButton onClick={(e) => {
                    e.stopPropagation();
                    handleContactCall(call.number);
                  }}>
                    <FaPhone />
                  </CallButton>
                </CallRecord>
              ))}
            </ContactList>
          )}
          {activeTab === 'contacts' && (
            <ContactList>
              {contacts.map(contact => (
                <ContactItem key={contact.id} onClick={() => handleContactCall(contact.number)}>
                  <div>
                    <div>{contact.name}</div>
                    <div className="time">{contact.number}</div>
                  </div>
                  <CallButton onClick={(e) => {
                    e.stopPropagation();
                    handleContactCall(contact.number);
                  }}>
                    <FaPhone />
                  </CallButton>
                </ContactItem>
              ))}
            </ContactList>
          )}
        </>
      ) : (
        <CallInterface>
          <CallInfo>
            <h2>{number}</h2>
            <p>通话中 {formatDuration(callDuration)}</p>
          </CallInfo>
          <EndCallButton onClick={handleEndCall}>
            <FaPhone />
          </EndCallButton>
        </CallInterface>
      )}
    </Container>
  );
}

export default Phone;