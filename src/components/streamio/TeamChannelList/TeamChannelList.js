import React from 'react';

import './TeamChannelList.css';

import { AddChannel } from 'assets/images/streamio';

const ChannelList = (props) => {
  const {
    children,
    error = false,
    loading,
    setIsCreating,
    setIsEditing
  } = props;

  if (error) {
    return null;
  }

  if (loading) {
    return (
      <div className='team-channel-list'>
        <p className='team-channel-list__message loading'>
          Groups loading....
        </p>
      </div>
    );
  }

  return (
    <div className='team-channel-list'>
      <div className='team-channel-list__header'>
        <p className='team-channel-list__header__title'>
          Groups
        </p>
        <AddChannel
          {...{ setIsCreating, setIsEditing }}
          type='messaging'
        />
      </div>
      {children}
    </div>
  );
};

export const TeamChannelList = React.memo(ChannelList);
