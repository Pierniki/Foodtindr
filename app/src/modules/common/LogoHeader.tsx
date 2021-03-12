import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { device } from '../../globalStyles';
import BackgroundElement from './BackgroundElement';

const Title = styled.h1`
  color: var(--primary);
  margin-top: 20px;
  text-align: center;
  font-size: 100px;
  font-weight: 900;
  margin-bottom: 0;
  @media (${device.tablet}) {
    margin-bottom: 30px;
    font-size: 60px;
  }
`;

const TitleAccent = styled.span`
  background: linear-gradient(180deg, #d34444 59.37%, #181818 59.39%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Background = styled.div`
  z-index: -1;
  position: relative;
  top: -47px;
  display: flex;
  justify-content: center;
`;

const BackgroundContainer = () => {
  return (
    <Background>
      <BackgroundElement width={'290px'} height={'60px'} />
      <BackgroundElement width={'290px'} height={'60px'} primary />
    </Background>
  );
};

export const LogoHeader = () => {
  return (
    <>
      <Link to={'/'} style={{ textDecoration: 'none' }}>
        <Title>
          Food <TitleAccent>Tindr.</TitleAccent>
        </Title>
      </Link>

      <BackgroundContainer />
    </>
  );
};

export default LogoHeader;
