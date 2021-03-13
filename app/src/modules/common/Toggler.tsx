import React from 'react';
import styled from 'styled-components';

interface TogglerProps {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TogglerBackgroundProps {
  toggled: boolean;
}

const TogglerBackground = styled.div<TogglerBackgroundProps>`
  display: flex;
  align-items: center;
  width: 40px;
  height: 20px;
  background-color: ${(props) =>
    props.toggled ? 'var(--primary-dark)' : 'var(--secondary-dark)'};
  justify-content: ${(props) => (props.toggled ? 'flex-start' : 'flex-end')};
  border-radius: 30px;
  padding: 5px;
  cursor: pointer;
  margin: 5px 10px;
`;

const Slider = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: var(--primary);
`;

const TogglerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Toggler: React.FC<TogglerProps> = ({ state, setState }) => {
  const toggle = () => {
    setState(!state);
  };

  return (
    <TogglerContainer>
      <p>animations: </p>
      <TogglerBackground toggled={state} onClick={toggle}>
        <Slider />
      </TogglerBackground>
    </TogglerContainer>
  );
};

export default Toggler;
