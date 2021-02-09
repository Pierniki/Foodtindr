import React, { FC, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import styled from 'styled-components';
import BackButton from '../common/BackButton';
import BackgroundElement from '../common/BackgroundElement';
import Button from '../common/Button';
import Container from '../common/Container';
import Text from '../common/Text';
import WaitingRoom from '../WaitingRoom';

interface RoomParams {
  id: string;
}

interface Meal {
  name: string;
  thumbnail: string;
  category: string;
}

const SOCKET_URL = 'ws://localhost:3000';

const RoomWrapper = () => {
  const { id } = useParams<RoomParams>();
  const history = useHistory();
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [meal, setMeal] = useState<Meal>();
  const socketCon = useRef<SocketIOClient.Socket>();

  useEffect(() => {
    if (!id) return;
    socketCon.current = io(SOCKET_URL);
    const socket = socketCon.current;

    socket.on('connect', () => {
      if (id === 'new') return socket.emit('room:create');
      return socket.emit('room:join', id);
    });
    socket.on('room:joined', (id: string) => {
      history.push(`/room/${id}`);
    });
    socket.on('room:missing', () => {
      history.push('/');
    });
    socket.on('room:meals', (meal: any) => {
      if (isWaiting) setIsWaiting(false);
      console.log(meal);
      setMeal(meal);
    });
    socket.on('room:match', () => {
      console.log('MATCH!');
    });
    return () => {
      socket.disconnect();
    };
    // REVIEW
    // eslint-disable-next-line
  }, []);

  if (isWaiting || !socketCon.current) return <WaitingRoom />;
  return <Room id={id} meal={meal} socket={socketCon.current} />;
};

export interface RoomProps {
  id: string;
  meal?: Meal;
  socket: SocketIOClient.Socket;
}

const ThumbnailImage = styled.img`
  margin: 40px auto;
  max-width: 500px;
`;

interface ImageWrapperProps {
  thumbnail: string;
}

const ImageWrapper: FC<ImageWrapperProps> = ({ thumbnail }) => {
  const [isImgReady, setIsImgReady] = useState<boolean>(false);

  useEffect(() => {
    if (!thumbnail) return;
    const img = new Image();
    img.onload = () => {
      setIsImgReady(true);
    };
    img.src = thumbnail;
  }, [thumbnail]);

  if (!isImgReady) return <div>...</div>;
  return <ThumbnailImage src={thumbnail} alt="thumbnail" />;
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

interface VoteButtonProps {
  voteFunction: (vote: boolean) => void;
  isAffirmative: boolean;
}

const VoteButton: FC<VoteButtonProps> = ({ voteFunction, isAffirmative }) => {
  return (
    <div>
      <Button
        width={'150px'}
        height={'150px'}
        primary
        onClick={() => voteFunction(isAffirmative)}
      >
        {isAffirmative ? 'Yes' : 'No'}
      </Button>
    </div>
  );
};

const Room: FC<RoomProps> = ({ id, meal, socket }) => {
  const vote = (vote: boolean) => {
    socket.emit('room:vote', vote);
  };

  if (!meal) return null;
  return (
    <>
      <Container>
        <BackButton />
      </Container>
      <Container primary>
        <Row>
          <VoteButton isAffirmative={false} voteFunction={vote} />

          <ImageWrapper thumbnail={meal.thumbnail} />
          <VoteButton isAffirmative={true} voteFunction={vote} />
        </Row>
        <BackgroundElement width={'100%'} height={'auto'} primary>
          <Text>{meal.name}</Text>
        </BackgroundElement>
      </Container>
    </>
  );
};

export default RoomWrapper;
