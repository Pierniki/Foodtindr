import styled from 'styled-components';
import { device } from '../../globalStyles';
import { ColorProps } from '../../types';

const Container = styled.div<ColorProps>`
  margin: 0 auto;
  width: 580px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.primary ? 'var(--primary-dark)' : 'white'};

  @media (${device.tablet}) {
    width: 100%;
  }
`;

export default Container;
