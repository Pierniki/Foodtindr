import React, { FC, useEffect, useReducer, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import BackButton from '../common/BackButton';
import BackgroundElement from '../common/BackgroundElement';
import Button from '../common/Button';
import Container from '../common/Container';
import Text from '../common/Text';
import WaitingRoom from '../WaitingRoom';
import roomReducer, { State } from './roomReducer';
import { ImageReplacer, Row, ThumbnailImage } from './styled';

interface RoomParams {
  id: string;
}

export interface Meal {
  name: string;
  thumbnail: string;
  category: string;
}

const SOCKET_URL = 'ws://localhost:3000';

const initialState: State = {
  meal: null,
  mealDetails: null,
  roomState: 'loading',
};

const RoomWrapper = () => {
  const { id } = useParams<RoomParams>();
  const history = useHistory();
  const socketCon = useRef<SocketIOClient.Socket>();
  const [{ meal, roomState }, dispatch] = useReducer(roomReducer, initialState);

  useEffect(() => {
    if (!id) return;
    socketCon.current = io(SOCKET_URL);
    const socket = socketCon.current;

    socket.on('connect', () => {
      if (id === 'new') return socket.emit('room:create');
      return socket.emit('room:join', id);
    });
    socket.on('room:joined', (id: string) => {
      dispatch({ type: 'SET_WAITING' });
      history.push(`/room/${id}`);
    });
    socket.on('room:missing', () => {
      history.push('/');
    });
    socket.on('room:meals', (meal: Meal) => {
      if (roomState !== 'done') dispatch({ type: 'SET_DONE' });
      dispatch({ type: 'SET_MEAL', meal });
    });
    socket.on('room:match', (mealDetails: any) => {
      dispatch({ type: 'SET_MATCH' });
      dispatch({ type: 'SET_MEAL_DETAILS', mealDetails: mealDetails });
      console.log(mealDetails);
    });
    return () => {
      socket.disconnect();
    };
    // REVIEW
    // eslint-disable-next-line
  }, []);

  if (roomState === 'loading') return null;
  if (roomState === 'waiting' || !meal || !socketCon.current)
    return <WaitingRoom />;
  return <Room id={id} meal={meal} socket={socketCon.current} />;
};

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

  if (!isImgReady) return <ImageReplacer>...</ImageReplacer>;
  return <ThumbnailImage src={thumbnail} alt="thumbnail" />;
};

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

interface RoomProps {
  id: string;
  meal?: Meal;
  socket: SocketIOClient.Socket;
}

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
