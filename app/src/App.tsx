import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyles from './globalStyles';
import Footer from './modules/common/Footer';
import LogoHeader from './modules/common/LogoHeader';
import Home from './modules/Home';
import RoomWrapper from './modules/Room';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const App = () => {
  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <LogoHeader />
        <RouterSwitch />
        <Footer />
      </AppContainer>
    </Router>
  );
};

const RouterSwitch = () => {
  return (
    <Switch>
      <Route path="/room/:id">
        <RoomWrapper />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};

export default App;
