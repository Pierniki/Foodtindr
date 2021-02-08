import styled from 'styled-components';
import { ColorProps } from '../../types';

interface BackgroundElementProps extends ColorProps {
  width: string;
  height: string;
  top?: string;
}

const BackgroundElement = styled.div<BackgroundElementProps>`
  position: relative;
  top: ${(props) => (props.top ? props.top : '0')};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) =>
    props.primary ? 'var(--primary)' : 'var(--primary-dark)'};
`;

export default BackgroundElement;
