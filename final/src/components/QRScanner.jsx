import React, { useState } from 'react';
import styled from 'styled-components';
import { QrReader } from 'react-qr-reader';
import BackToDesktop from './BackToDesktop';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f8f8f8;
`;

const ScannerContainer = styled.div`
  width: 100%;
  max-width: 300px;
  margin: 20px 0;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
`;

const Result = styled.p`
  color: #666;
  word-break: break-all;
  margin: 0;
`;

function QRScanner() {
  const [data, setData] = useState('等待扫描...');

  const handleScan = (result) => {
    if (result) {
      setData(result?.text || '无法识别的二维码');
    }
  };

  const handleError = (error) => {
    console.error(error);
    setData('扫描出错，请确保允许使用摄像头');
  };

  return (
    <Container>
      <BackToDesktop />
      <Title>二维码扫描</Title>
      <ScannerContainer>
        <QrReader
          constraints={{
            facingMode: 'environment'
          }}
          onResult={handleScan}
          onError={handleError}
          style={{ width: '100%' }}
        />
      </ScannerContainer>
      <ResultContainer>
        <Title>扫描结果</Title>
        <Result>{data}</Result>
      </ResultContainer>
    </Container>
  );
}

export default QRScanner;