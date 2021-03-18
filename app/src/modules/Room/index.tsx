import React, { FC, useEffect, useReducer, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import BackButton from '../common/BackButton';
import BackgroundElement from '../common/BackgroundElement';
import ImageWrapper from '../common/ImageWrapper';
import Text from '../common/Text';
import Toggler from '../common/Toggler';
import Recipe from '../Recipe';
import WaitingRoom from '../WaitingRoom';
import roomReducer, { State } from './roomReducer';
import { NavRow, RoomContainer, Row, VotingButton } from './styled';

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
  const [{ meal, mealDetails, roomState }, dispatch] = useReducer(
    roomReducer,
    initialState
  );

  const onStart = () => {
    const socket = socketCon.current;
    if (!socket) return;
    socket.emit('room:start');
  };

  useEffect(() => {
    if (!id) return;
    socketCon.current = io(SOCKET_URL);
    const socket = socketCon.current;
    socket.on('connect', () => {
      if (id === 'new') return socket.emit('room:create');
      return socket.emit('room:join', id);
    });
    socket.on('room:error', (error: string) => {
      console.log(error);
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
    // eslint-disable-next-line
  }, []);

  if (roomState === 'loading') return null;
  if (roomState === 'waiting' || !meal || !socketCon.current)
    return <WaitingRoom onStart={onStart} />;
  if (roomState === 'match' && mealDetails)
    return <Recipe mealDetails={mealDetails} />;
  return <Room id={id} meal={meal} socket={socketCon.current} />;
};

interface VoteButtonProps {
  voteFunction: (vote: boolean) => void;
  isAffirmative: boolean;
}

const VoteButton: FC<VoteButtonProps> = ({ voteFunction, isAffirmative }) => {
  return (
    <VotingButton primary onClick={() => voteFunction(isAffirmative)}>
      {isAffirmative ? 'Yes' : 'No'}
    </VotingButton>
  );
};

interface RoomProps {
  id: string;
  meal?: Meal;
  socket: SocketIOClient.Socket;
}

const Room: FC<RoomProps> = ({ meal, socket }) => {
  const [animationsToggled, setAnimationsToggled] = useState<boolean>(true);

  const vote = (vote: boolean) => {
    socket.emit('room:vote', vote);
  };

  if (!meal) return null;
  return (
    <>
      <NavRow>
        <BackButton />
        <Toggler state={animationsToggled} setState={setAnimationsToggled} />
      </NavRow>
      <RoomContainer primary>
        <Row>
          <VoteButton isAffirmative={false} voteFunction={vote} />
          <ImageWrapper
            thumbnail={meal.thumbnail}
            animationsToggled={animationsToggled}
          />
          <VoteButton isAffirmative={true} voteFunction={vote} />
        </Row>
        <BackgroundElement width={'100%'} height={'auto'} primary>
          <Text>{meal.name}</Text>
        </BackgroundElement>
      </RoomContainer>
    </>
  );
};

export default RoomWrapper;
