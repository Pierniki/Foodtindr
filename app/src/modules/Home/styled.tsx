import styled from 'styled-components';

interface ColorProps {
  primary?: boolean;
}

interface RelativityProps {
  top?: string;
  left?: string;
}

interface CardTitleProps extends ColorProps, RelativityProps {}

interface BackgroundElementProps extends ColorProps {
  width: string;
  height: string;
  top?: string;
}

export const Background = styled.div`
  z-index: -1;
  position: relative;
  top: -47px;
  display: flex;
  justify-content: center;
`;

export const BackgroundElement = styled.div<BackgroundElementProps>`
  position: relative;
  top: ${(props) => (props.top ? props.top : '0')};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) =>
    props.primary ? 'var(--primary)' : 'var(--primary-dark)'};
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 130px;
`;

export const Title = styled.h1`
  color: var(--primary);
  margin-top: 20px;

  font-size: 100px;
  font-weight: 900;
  margin-bottom: 0;
`;

export const TitleAccent = styled.span`
  background: linear-gradient(180deg, #d34444 59.37%, #181818 59.39%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Subtitle = styled.h3`
  margin-top: 0;
  font-weight: 600;
  font-size: 35px;
`;

export const SubtitleAccent = styled.span`
  color: var(--primary);
`;

export const Main = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const Card = styled.div`
  height: 100%;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
`;

export const InputButtonDiv = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: row;
  width: 200px;
  background-color: var(--primary);
`;

export const Input = styled.input`
  color: white;
  background-color: var(--primary);
  box-sizing: border-box;
  max-width: 150px;
  border-radius: 10px;
  border: 0;
  font-size: 30px;
  font-weight: 700;
  padding: 10px 20px;
`;

export const CardTitle = styled.h4<CardTitleProps>`
  text-align: left;
  margin: 0;
  position: relative;
  top: ${(props) => (props.top ? props.top : '0')};
  left: ${(props) => (props.left ? props.left : '0')};
  font-weight: 700;
  font-size: 50px;
  color: ${(props) =>
    props.primary ? 'var(--primary)' : 'var(--primary-dark)'};
`;

export const CardDescription = styled.p`
  color: var(--secondary);
  margin: 0;
  font-weight: 700;
  font-size: 30px;
`;

export const Button = styled.button<ColorProps>`
  margin-top: 100px;
  cursor: pointer;
  font-size: 30px;
  font-weight: 700;
  width: 200px;
  padding: 10px;
  box-sizing: border-box;
  border: 0;
  background-color: ${(props) =>
    props.primary ? 'var(--primary)' : 'var(--primary-dark)'};
  color: ${(props) => (props.primary ? 'var(--primary)' : 'var(--secondary)')};
`;
