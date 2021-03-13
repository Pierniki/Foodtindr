import styled from 'styled-components';
import { device } from '../../globalStyles';
import BackgroundElement from '../common/BackgroundElement';
import Button from '../common/Button';
import Container from '../common/Container';
import { ImageReplacer, ThumbnailImage } from '../common/ImageWrapper';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (${device.tablet}) {
    width: 100%;
    flex-wrap: wrap;
    ${ThumbnailImage}, ${ImageReplacer} {
      padding: 0;
      margin: 0 30px;
      order: -1;
    }
  }

  @media (max-width: 700px) {
    ${ThumbnailImage}, ${ImageReplacer} {
      margin: 0;
    }
  }
`;

export const NavRow = styled(Row)`
  width: 500px;
  justify-content: space-between;
  align-items: flex-end;
`;

export const VotingButton = styled(Button)`
  min-width: 150px;
  min-height: 150px;
  border-radius: 2px;

  @media (${device.tablet}) {
    width: 250px;
    min-height: 100px;
  }

  @media (max-width: 500px) {
    width: 50%;
  }
`;

export const RoomContainer = styled(Container)`
  align-items: center;
  border-radius: 2px;

  @media (${device.tablet}) {
    width: 100%;
    ${BackgroundElement} {
      width: 500px;
      order: -1;
    }
  }

  @media (max-width: 500px) {
    ${BackgroundElement} {
      width: 100%;
    }
  }
`;
