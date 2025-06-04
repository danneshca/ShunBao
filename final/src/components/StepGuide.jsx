import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaRobot, FaHandPointer } from 'react-icons/fa';

const StepContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 90%;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StepList = styled.ol`
  list-style-position: inside;
  padding: 0;
  margin: 0;
`;

const StepItem = styled.li`
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  background-color: ${props => props.active ? '#007AFF' : 'transparent'};
  color: ${props => props.active ? 'white' : 'black'};
  transition: all 0.3s ease;
  opacity: ${props => props.completed ? 0.5 : 1};
  position: relative;
  cursor: ${props => !props.isAutoMode && props.active ? 'pointer' : 'default'};

  &:hover {
    background-color: ${props => !props.isAutoMode && props.active ? '#0056b3' : props.active ? '#007AFF' : 'transparent'};
  }
`;

const Title = styled.h3`
  margin: 0;
  text-align: center;
  color: #333;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;



function StepGuide({ steps, title, isVisible, onClose, currentStep = 0, onStepComplete, isAutoMode }) {
  const [activeStep, setActiveStep] = useState(currentStep);

  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  const handleStepClick = (index) => {
    if (!isAutoMode && index === activeStep) {
      onStepComplete && onStepComplete(index);
    }
  };

  if (!isVisible) return null;

  return (
    <StepContainer>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <Title>{title}</Title>
      <StepList>
        {steps.map((step, index) => (
          <StepItem
            key={index}
            active={index === activeStep}
            completed={index < activeStep}
            isAutoMode={isAutoMode}
            onClick={() => handleStepClick(index)}
          >
            {step}
            {index === activeStep && !isAutoMode && (
              <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                点击此步骤完成操作
              </div>
            )}
          </StepItem>
        ))}
      </StepList>
    </StepContainer>
  );
}

export default StepGuide;