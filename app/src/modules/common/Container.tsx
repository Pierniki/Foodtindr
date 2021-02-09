import styled from 'styled-components';
import { ColorProps } from '../../types';

const Container = styled.div<ColorProps>`
  margin: 0 auto;
  width: 580px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.primary ? 'var(--primary-dark)' : 'white'};
`;

export default Container;
