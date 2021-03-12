import styled from 'styled-components';
import { device } from '../../globalStyles';

export const HelperText = styled.p`
  width: 290px;
  font-size: 30px;
  @media (${device.tablet}) {
    padding: 0 10px;
  }
`;

export const CodeDisplay = styled.textarea`
  border: 0;
  margin: 0;
  padding: 20px;
  text-align: center;
  color: white;
  background-color: var(--primary);
  font-size: 50px;
  resize: none;
  height: 1.5em;
  line-height: 1.5em;
  @media (${device.tablet}) {
    width: 100%;
  }
`;
