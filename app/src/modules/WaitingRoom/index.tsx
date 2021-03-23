import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RoomIdParams } from '../../types';
import BackButton from '../common/BackButton';
import Button from '../common/Button';
import Container from '../common/Container';
import { CodeDisplay, HelperText } from './styled';

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
      <Button onClick={copyToClipboard} fontSize={'25px'}>
        {copyText}
      </Button>
    </>
  );
};

interface WaitingRoomProps {
  onStart: () => void;
  users: string[];
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ onStart, users }) => {
  return (
    <Container>
      <HelperText>Send that code to your friend.</HelperText>
      <CopyCode />
      <UserList users={users} />
      <Button width="200px" onClick={onStart}>
        go!
      </Button>
      <HelperText>or</HelperText>
      <BackButton />
    </Container>
  );
};

const UserList: React.FC<{ users: string[] }> = ({ users }) => {
  return (
    <table>
      <tbody>
        {users.map((user, idx) => {
          return (
            <tr key={'user_' + idx}>
              <th>{user}</th>
              <th>kick</th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default WaitingRoom;
