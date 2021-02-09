import styled from 'styled-components';
import { ColorProps, RelativityProps } from '../../types';

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 130px;
`;

export const Subtitle = styled.h3`
  margin-top: 0;
  font-weight: 600;
  font-size: 35px;
`;

export const SubtitleAccent = styled.span`
  color: var(--primary);
`;

export const Main = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const Card = styled.div`
  height: 100%;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
`;

export const InputButtonDiv = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: row;
  width: 200px;
  background-color: var(--primary);
`;

export const Input = styled.input`
  color: white;
  background-color: var(--primary);
  box-sizing: border-box;
  max-width: 150px;
  border-radius: 10px;
  border: 0;
  font-size: 25px;
  font-weight: 700;
  padding: 10px 20px;
`;

interface CardTitleProps extends ColorProps, RelativityProps {}

export const CardTitle = styled.h4<CardTitleProps>`
  text-align: left;
  margin: 0;
  position: relative;
  top: ${(props) => (props.top ? props.top : '0')};
  left: ${(props) => (props.left ? props.left : '0')};
  font-weight: 700;
  font-size: 50px;
  color: ${(props) =>
    props.primary ? 'var(--primary)' : 'var(--primary-dark)'};
`;

export const CardDescription = styled.p`
  color: var(--secondary);
  margin: 0 0 100px 0;
  font-weight: 700;
  font-size: 30px;
`;
