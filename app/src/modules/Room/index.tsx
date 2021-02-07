import { FC, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import styled from 'styled-components';

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
      setIsWaiting(false);
    });
    socket.on('room:missing', () => {
      history.push('/');
    });
    socket.on('room:meals', (meal: any) => {
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

const WaitingRoom = () => {
  return <header className="App-header" />;
};

interface RoomProps {
  id: string;
  meal?: Meal;
  socket: SocketIOClient.Socket;
}

const ThumbnailImage = styled.img`
  max-width: 400px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
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

const Room: FC<RoomProps> = ({ id, meal, socket }) => {
  const vote = (vote: boolean) => {
    socket.emit('room:vote', vote);
  };

  if (!meal) return null;
  return (
    <>
      <h1>Room number {id}</h1>
      <h2>{meal.name}</h2>
      <Row>
        <button onClick={() => vote(false)}>Nah</button>
        <ImageWrapper thumbnail={meal.thumbnail} />
        <button onClick={() => vote(true)}>Ya</button>
      </Row>
    </>
  );
};

export default RoomWrapper;
