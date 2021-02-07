import React, { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Background,
  BackgroundElement,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Header,
  Input,
  InputButtonDiv,
  Main,
  Subtitle,
  SubtitleAccent,
  Title,
  TitleAccent,
} from './styled';

const BackgroundContainer = () => {
  return (
    <Background>
      <BackgroundElement width={'290px'} height={'60px'} />
      <BackgroundElement width={'290px'} height={'60px'} primary />
    </Background>
  );
};

const Home = () => {
  return (
    <>
      <Header>
        <Title>
          Food <TitleAccent>Tindr.</TitleAccent>
        </Title>
        <BackgroundContainer />
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
        <Button>New room.</Button>
      </Link>
    </Card>
  );
};

const InputButton = () => {
  const [id, setId] = useState<string>('ABCDEF');

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  return (
    <InputButtonDiv>
      <Input value={id} onChange={onInputChange}></Input>
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
