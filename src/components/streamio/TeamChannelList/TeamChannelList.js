import React from 'react';
import { Typography } from '@mui/material';
import './TeamChannelList.css';

const ChannelList = (props) => {
  const {
    children,
    error = false,
    loading
  } = props;

  if (error) {
    return null;
  }

  if (loading) {
    return (
      <Typography>
        Loading....
      </Typography>
    );
  }

  return (
    <>
      {children}
    </>
  );
};

export const TeamChannelList = React.memo(ChannelList);
