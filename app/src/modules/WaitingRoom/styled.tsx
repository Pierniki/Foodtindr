import styled from 'styled-components';
import { ColorProps, SizeProps } from '../../types';

export const WaitingRoomContainer = styled.div`
  margin: 0 auto;
  width: 580px;
  display: flex;
  flex-direction: column;
`;

export const HelperText = styled.p`
  width: 290px;
  font-size: 50px;
`;

export const CodeDisplay = styled.textarea`
  border: 0;
  margin: 0;
  padding: 20px;
  text-align: center;
  color: white;
  background-color: var(--primary);
  font-size: 80px;
  resize: none;
  height: 1.5em;
  line-height: 1.5em;
`;

interface ButtonProps extends ColorProps, SizeProps {}

export const Button = styled.button<ButtonProps>`
  cursor: pointer;
  box-sizing: border-box;
  padding: 10px;
  font-size: 40px;
  font-weight: 600;
  border: 0;
  color: white;
  width: ${(props) => (props.width ? props.width : '100%')};
  height: ${(props) => (props.height ? props.height : 'auto')};

  background-color: ${(props) =>
    props.primary ? 'var(--primary)' : 'var(--primary-dark)'};
`;
