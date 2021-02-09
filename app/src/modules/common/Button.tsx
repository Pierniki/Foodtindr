import styled from 'styled-components';
import { ColorProps, FontProps, SizeProps } from '../../types';

// background-color: ${(props) =>
//     props.primary ? 'var(--primary)' : 'var(--primary-dark)'};
//   color: ${(props) => (props.primary ? 'var(--primary)' : 'var(--secondary)')};

interface ButtonProps extends ColorProps, SizeProps, FontProps {}

const Button = styled.button<ButtonProps>`
  cursor: pointer;
  box-sizing: border-box;
  padding: 10px 20px;

  font-size: ${(props) => (props.fontSize ? props.fontSize : '40px')};
  font-weight: 600;
  border: 0;
  color: white;
  width: ${(props) => (props.width ? props.width : '100%')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  background-color: ${(props) =>
    props.primary ? 'var(--primary)' : 'var(--primary-dark)'};
`;

export default Button;
