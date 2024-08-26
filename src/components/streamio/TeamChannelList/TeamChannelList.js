import React from 'react';

import { List, Typography } from '@mui/material';
import './TeamChannelList.css';

const ChannelList = (props) => {
  const {
    children,
    error = false,
    loading,
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
    <List component="nav">
      {children}
    </List>
  );
};

export const TeamChannelList = React.memo(ChannelList);
