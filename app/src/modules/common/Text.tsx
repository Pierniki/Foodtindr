import styled from 'styled-components';
import { ColorProps, FontProps } from '../../types';

interface TextProps extends ColorProps, FontProps {}

const Text = styled.p<TextProps>`
  text-align: center;
  margin: 0.5em;
  font-size: ${(props) => (props.fontSize ? props.fontSize : '30px')};
  color: ${(props) => (props.primary ? 'var(--primary-dark)' : 'white')};
`;

export default Text;
