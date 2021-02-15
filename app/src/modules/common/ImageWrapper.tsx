import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

interface ImageWrapperProps {
  thumbnail: string;
}

export const ThumbnailImage = styled.img`
  margin: 40px auto;
  max-width: 500px;
`;

export const ImageReplacer = styled.div`
  margin: 40px auto;
  min-width: 500px;
  min-height: 500px;
`;

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

export default ImageWrapper;
