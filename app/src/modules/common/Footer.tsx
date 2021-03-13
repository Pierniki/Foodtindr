import styled from 'styled-components';
import githubLogo from '../../GitHub-Mark-Light-32px.png';

const githubHref = 'http://github.com/Pierniki';

const FooterContainer = styled.footer`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100%;
  background-color: var(--primary-dark);
`;

const SocialMediaIcon = styled.img`
  width: 20px;
  height: 20px;
  padding: 10px;
`;

const CopyrightSpan = styled.span`
  font-weight: 200;
  font-size: 10px;
  color: white;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <a href={githubHref}>
        <SocialMediaIcon src={githubLogo} alt={'github'}></SocialMediaIcon>
      </a>
      <CopyrightSpan>@ 2020 Marcin Szczepaniak</CopyrightSpan>
    </FooterContainer>
  );
};

export default Footer;
