import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RoomIdParams } from '../../types';
import {
  Button,
  CodeDisplay,
  HelperText,
  WaitingRoomContainer,
} from './styled';

const CopyCode = () => {
  const codeRef = useRef<HTMLTextAreaElement>(null);
  const [copyText, setCopyText] = useState('copy');
  const { id } = useParams<RoomIdParams>();

  const copyToClipboard = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log('copy!');
    if (!codeRef.current) return;
    codeRef.current.select();
    document.execCommand('copy');
    e.currentTarget.focus();
    setCopyText('copied!');
  };

  return (
    <>
      <CodeDisplay readOnly ref={codeRef} value={id}></CodeDisplay>
      <Button onClick={copyToClipboard}>{copyText}</Button>
    </>
  );
};

const WaitingRoom = () => {
  return (
    <WaitingRoomContainer>
      <HelperText>Send that code to your friend.</HelperText>
      <CopyCode />
      <HelperText>or</HelperText>
      <Link to={'/'}>
        <Button primary width={'50%'}>
          go back
        </Button>
      </Link>
    </WaitingRoomContainer>
  );
};

export default WaitingRoom;
