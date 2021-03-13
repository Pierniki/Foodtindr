import { FC, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { device } from '../../globalStyles';

const getRandomCoords = () => {
  const max = Math.floor(70);
  const min = Math.ceil(30);
  const coords = `${Math.floor(Math.random() * (max - min)) + min}% ${
    Math.floor(Math.random() * (max - min)) + min
  }%`;
  return coords;
};

const reveal = (coords: string) => keyframes`
    from {
      clip-path: circle(0% at ${coords});
    }
    to {
      clip-path: circle(100% at ${coords});
    }
`;

const shrink = (coords: string) => keyframes`
    from {
      clip-path: circle(100% at ${coords});
    }
    to {
      clip-path: circle(0% at ${coords});
    }
`;

interface ThumbnailImageProps {
  animation: string;
  coords: string;
}

export const ThumbnailImage = styled.img<ThumbnailImageProps>`
  padding: 40px 0;
  position: relative;
  max-width: 500px;
  animation: ${(props) =>
      props.animation === 'shrink'
        ? shrink(props.coords)
        : reveal(props.coords)}
    0.5s ease-out;

  @media (${device.tablet}) {
    margin: 0;
    width: 100%;
    height: auto;
    background-size: cover;
  }
`;

export const ImageReplacer = styled.div`
  padding: 40px 0;
  min-width: 500px;
  height: 500px;

  @media (${device.tablet}) {
    margin: 0;
    width: 100%;
  }
`;

interface ImageWrapperProps {
  thumbnail: string;
  animationsToggled?: boolean;
}

const ImageWrapper: FC<ImageWrapperProps> = ({
  thumbnail,
  animationsToggled,
}) => {
  const [isImgReady, setIsImgReady] = useState<boolean>(false);
  const [currentThumbnail, setCurrentThumbnail] = useState<string>();
  const [animation, setAnimation] = useState<string>('reveal');
  const [coords, setCoords] = useState<string>('50% 50%');

  useEffect(() => {
    if (!thumbnail) return;
    const img = new Image();
    img.src = thumbnail;

    img.onload = () => {
      if (!animationsToggled) return setCurrentThumbnail(thumbnail);
      setCoords(getRandomCoords());
      setAnimation('shrink');

      setTimeout(() => {
        setIsImgReady(false);
      }, 400);
      setTimeout(() => {
        setCurrentThumbnail(thumbnail);
        setIsImgReady(true);
        setCoords(getRandomCoords());

        setAnimation('reveal');
      }, 700);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnail]);

  return (
    <>
      {isImgReady ? (
        <ThumbnailImage
          animation={animation}
          coords={coords}
          src={currentThumbnail}
          alt="thumbnail"
        />
      ) : (
        <ImageReplacer />
      )}
    </>
  );
};

export default ImageWrapper;
