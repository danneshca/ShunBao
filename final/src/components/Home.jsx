import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaMicrophone, FaKeyboard, FaVideo, FaComments, FaPhone, FaRobot, FaHandPointer, FaQrcode, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import StepGuide from './StepGuide';

const StepsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const StepItem = styled.div`
  padding: 8px 0;
  color: #333;
  font-size: 16px;
  line-height: 1.4;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const Container = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const ModeToggle = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ModeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background-color: ${props => props.active ? '#007AFF' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#666'};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#0056b3' : '#e0e0e0'};
  }

  svg {
    font-size: 14px;
  }
`;

const Greeting = styled.div`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const QuickAccessButton = styled.button`
  background: white;
  border: none;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  &:hover {
    transform: translateY(-2px);
  }

  svg {
    font-size: 24px;
    color: ${props => props.iconColor};
  }

  span {
    font-size: 14px;
    color: #333;
  }

  ${StepsList} {
    display: none;
  }

  &:hover ${StepsList} {
    display: block;
  }
`;

const HistorySection = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InputSection = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  background: white;
  border-radius: 20px;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 10px 20px 10px;
`;

const InputToggle = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: ${props => props.active ? '#007AFF' : '#999'};
  padding: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(0, 122, 255, 0.1)' : 'rgba(153, 153, 153, 0.1)'};
  }
`;

const InputField = styled.input`
  flex: 1;
  border: none;
  font-size: 18px;
  padding: 12px;
  outline: none;
  background: #f5f5f5;
  border-radius: 15px;
  color: #333;
  
  &::placeholder {
    color: #999;
    font-size: 16px;
  }
`;

const VoiceInputIndicator = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100%;
  margin-bottom: 10px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  display: ${props => props.show ? 'block' : 'none'};
`;

function Home() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [isVoiceInput, setIsVoiceInput] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [history] = useState([
    { id: 1, title: '视频通话', detail: '与张阿姨进行了15分钟的视频通话', time: '今天 14:30' },
    { id: 2, title: '观看视频', detail: '观看了3个关于健康养生的短视频', time: '今天 10:15' },
  ]);

  const contacts = [
    { name: '张阿姨', id: 1 },
    { name: '李叔叔', id: 2 },
    { name: '王奶奶', id: 3 },
  ];

  const handleContactAction = (contactName, action) => {
    const contact = contacts.find(c => c.name === contactName);
    if (contact) {
      if (action === 'video') {
        navigate('/wechat');
        // 在组件挂载后设置联系人和视频通话状态
        setTimeout(() => {
          const wechatApp = document.querySelector('.wechat-app');
          if (wechatApp) {
            wechatApp.setAttribute('data-selected-contact', contact.id);
            wechatApp.setAttribute('data-action', 'video-call');
          }
        }, 100);
      } else if (action === 'call') {
        navigate('/phone');
        // 在组件挂载后设置联系人和通话状态
        setTimeout(() => {
          const phoneApp = document.querySelector('.phone-app');
          if (phoneApp) {
            phoneApp.setAttribute('data-selected-contact', contact.id);
            phoneApp.setAttribute('data-action', 'call');
          }
        }, 100);
      }
    }
  };


  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('早上好！祝您今天心情愉快');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('下午好！记得适当休息哦');
      } else {
        setGreeting('晚上好！祝您有个好梦');
      }
    };

    updateGreeting();
    const timer = setInterval(updateGreeting, 60000);
    return () => clearInterval(timer);
  }, []);

  const quickAccess = [
    { 
      icon: FaVideo, 
      label: '视频通话', 
      color: '#FF2D55',
      steps: [
        '1. 点击手机右上角的电源键返回桌面',
        '2. 在桌面找到并点击"微信"图标',
        '3. 点击联系人列表中想要联系的人',
        '4. 点击右上角的视频通话按钮'
      ]
    },
    { 
      icon: FaComments, 
      label: '发消息', 
      color: '#34C759',
      steps: [
        '1. 点击手机右上角的电源键返回桌面',
        '2. 在桌面找到并点击"微信"图标',
        '3. 点击下方"聊天"选项',
        '4. 选择联系人开始发消息'
      ]
    },
    { 
      icon: FaPhone, 
      label: '打电话', 
      color: '#007AFF',
      steps: [
        '1. 点击手机右上角的电源键返回桌面',
        '2. 在桌面找到并点击"电话"图标',
        '3. 点击拨号键盘',
        '4. 输入电话号码并点击拨打按钮'
      ]
    },
    { 
      icon: FaQrcode, 
      label: '扫一扫', 
      color: '#5856D6',
      steps: [
        '1. 点击手机右上角的电源键返回桌面',
        '2. 点击"扫一扫"图标',
        '3. 将二维码对准扫描框',
        '4. 等待扫描结果'
      ]
    },
    { 
      icon: FaVideo, 
      label: '看视频', 
      color: '#FF9500',
      steps: [
        '1. 点击手机右上角的电源键返回桌面',
        '2. 在桌面找到并点击"短视频"图标',
        '3. 等待视频加载完成',
        '4. 上下滑动切换视频'
      ]
    },
    { 
      icon: FaCamera, 
      label: '拍照', 
      color: '#5D4037',
      steps: [
        '1. 点击手机右上角的电源键返回桌面',
        '2. 点击"拍照"图标',
        '3. 等待相机启动',
        '4. 点击拍照按钮进行拍照'
      ]
    }
  ];

  return (
    <Container>
      <Greeting>{greeting}</Greeting>
      <ModeToggle>
        <ModeButton
          active={isAutoMode}
          onClick={() => setIsAutoMode(true)}
        >
          <FaRobot />
          自动模式
        </ModeButton>
        <ModeButton
          active={!isAutoMode}
          onClick={() => setIsAutoMode(false)}
        >
          <FaHandPointer />
          手动模式
        </ModeButton>
      </ModeToggle>
      
      <QuickAccessGrid>
        {quickAccess.map((item, index) => (
          <QuickAccessButton 
            key={index} 
            iconColor={item.color}
            onClick={() => {
              setSelectedFeature(index);
              setIsGuideVisible(true);
              setCurrentStep(0);
              
              if (isAutoMode) {
                // 自动执行步骤
                const executeSteps = async () => {
                  // 第一步：返回桌面
                  navigate('/');
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  setCurrentStep(1);

                  // 第二步：打开相应应用
                  const appPath = item.label === '视频通话' || item.label === '发消息' ? '/wechat' :
                                 item.label === '打电话' ? '/phone' :
                                 item.label === '扫一扫' ? '/qr-scanner' :
                                 item.label === '拍照' ? '/camera' : '/short-video';
                  navigate(appPath);
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  setCurrentStep(2);

                  // 第三步和第四步的延迟展示
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  setCurrentStep(3);
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  setIsGuideVisible(false);
                  setCurrentStep(0);
                };

                executeSteps();
              }
            }}
          >
            <item.icon />
            <span>{item.label}</span>
          </QuickAccessButton>
        ))}
      </QuickAccessGrid>

      <HistorySection>
        {history.map(item => (
          <HistoryItem key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <small>{item.time}</small>
          </HistoryItem>
        ))}
      </HistorySection>

      <InputSection>
        <VoiceInputIndicator show={isListening}>正在聆听您的声音...</VoiceInputIndicator>
        <InputToggle 
          active={isVoiceInput}
          onClick={() => {
            setIsVoiceInput(true);
            setIsListening(!isListening);
          }}
        >
          <FaMicrophone />
        </InputToggle>
        <InputToggle 
          active={!isVoiceInput}
          onClick={() => {
            setIsVoiceInput(false);
            setIsListening(false);
          }}
        >
          <FaKeyboard />
        </InputToggle>
        <InputField 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isVoiceInput ? "点击麦克风开始语音输入" : "请输入您的需求，按回车执行"}
          disabled={isVoiceInput}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              const input = inputValue.trim().toLowerCase();
              
              // 检查是否包含联系人名字和操作类型
              const contactMatch = contacts.find(contact => 
                input.includes(contact.name)
              );
              
              if (contactMatch) {
                if (input.includes('视频') || input.includes('视频通话')) {
                  handleContactAction(contactMatch.name, 'video');
                } else if (input.includes('电话') || input.includes('打电话')) {
                  handleContactAction(contactMatch.name, 'call');
                }
                setInputValue('');
                return;
              }
              
              // 如果没有找到联系人，按原有逻辑处理
              const feature = quickAccess.findIndex(item => 
                input.includes(item.label.toLowerCase()) || 
                item.label.toLowerCase().includes(input)
              );
              
              if (feature !== -1) {
                setSelectedFeature(feature);
                setIsGuideVisible(true);
                setCurrentStep(0);
                setInputValue('');
                
                if (isAutoMode) {
                  // 自动执行步骤
                  const executeSteps = async () => {
                    navigate('/');
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    setCurrentStep(1);

                    const appPath = quickAccess[feature].label === '视频通话' || quickAccess[feature].label === '发消息' ? '/wechat' :
                                   quickAccess[feature].label === '打电话' ? '/phone' : '/short-video';
                    navigate(appPath);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    setCurrentStep(2);

                    await new Promise(resolve => setTimeout(resolve, 1500));
                    setCurrentStep(3);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    setIsGuideVisible(false);
                    setCurrentStep(0);
                  };

                  executeSteps();
                }
              }
            }
          }}
        />
      </InputSection>

      <StepGuide
        steps={selectedFeature !== null ? quickAccess[selectedFeature].steps : []}
        title={selectedFeature !== null ? quickAccess[selectedFeature].label : ''}
        isVisible={isGuideVisible}
        onClose={() => {
          setIsGuideVisible(false);
          setCurrentStep(0);
        }}
        currentStep={currentStep}
        isAutoMode={isAutoMode}
        onStepComplete={(index) => {
          if (index === 0) {
            navigate('/');
            setCurrentStep(1);
          } else if (index === 1) {
            const appPath = selectedFeature !== null ?
              (quickAccess[selectedFeature].label === '视频通话' || quickAccess[selectedFeature].label === '发消息' ? '/wechat' :
               quickAccess[selectedFeature].label === '打电话' ? '/phone' : '/short-video')
              : '/';
            navigate(appPath);
            setCurrentStep(2);
          } else if (index === 2) {
            setCurrentStep(3);
          } else if (index === 3) {
            setIsGuideVisible(false);
            setCurrentStep(0);
          }
        }}
      />
    </Container>
  );
}

export default Home;