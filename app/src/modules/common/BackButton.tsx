import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const BackButton = () => {
  return (
    <Link to={'/'}>
      <Button width={'25%'} fontSize={'25px'}>
        go back
      </Button>
    </Link>
  );
};

export default BackButton;
