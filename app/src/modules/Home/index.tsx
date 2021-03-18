import React, { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import BackgroundElement from '../common/BackgroundElement';
import Button from '../common/Button';
import {
  Card,
  CardDescription,
  CardTitle,
  Header,
  Input,
  InputButtonDiv,
  Main,
  Subtitle,
  SubtitleAccent,
} from './styled';

const Home = () => {
  return (
    <>
      <Header>
        <Subtitle>
          Your belly needs some <SubtitleAccent>lovin'</SubtitleAccent> too!
        </Subtitle>
        <BackgroundElement width={'580px'} height={'10px'} primary />
      </Header>

      <Main>
        <BackgroundElement width={'290px'} height={'400px'} primary>
          <CreateRoomCard />
        </BackgroundElement>
        <BackgroundElement width={'290px'} height={'400px'} top={'70px'}>
          <JoinRoomCard />
        </BackgroundElement>
      </Main>
    </>
  );
};

const CreateRoomCard = () => {
  return (
    <Card>
      <CardTitle left={'-50px'} top={'-35px'}>
        Create a room
      </CardTitle>
      <CardDescription>Then send your friend a code.</CardDescription>
      <Link to={'/room/new'}>
        <Button fontSize={'25px'} height={'55px'}>
          New room.
        </Button>
      </Link>
    </Card>
  );
};

const InputButton = () => {
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [id, setId] = useState<string>('ABCDEF');

  const onFirstClick = () => {
    if (!isFirstClick) return;
    setIsFirstClick(false);
    setId('');
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  return (
    <InputButtonDiv>
      <Input value={id} onChange={onInputChange} onClick={onFirstClick}></Input>
      <Link to={`/room/${id}`}>
        <Button fontSize={'30px'} primary>
          {'>'}
        </Button>
      </Link>
    </InputButtonDiv>
  );
};

const JoinRoomCard = () => {
  return (
    <Card>
      <CardTitle top={'-70px'} left={'-70px'} primary>
        or
      </CardTitle>
      <CardTitle left={'65px'} primary>
        Paste a code here:
      </CardTitle>
      <InputButton />
    </Card>
  );
};

export default Home;
