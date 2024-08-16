import React from 'react';
import {
  Avatar,
  useChannelActionContext,
  useChannelStateContext,
} from 'stream-chat-react';
import { MenuOutlined, EditOutlined } from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';
import { Typography } from '@mui/material';

import './TeamChannelHeader.css';

import { PinIcon } from 'assets/images/streamio';

export const TeamChannelHeader = ({ setIsEditing, setPinsOpen, onShowChannelSelector, isChannelSelectorVisible }) => {
  const { closeThread } = useChannelActionContext();
  const { channel, watcher_count } = useChannelStateContext();

  const getMessagingHeader = () => {
    const members = Object.values(channel.state.members);

    return (
      <div className='team-channel-header__name-wrapper'>
        {!isChannelSelectorVisible && 
          <IconButton sx={{ width: 22, height: 22, mr: 1.5 }}
            onClick={() => {onShowChannelSelector();}} 
            size="large" 
            className="tenx-messaging-channels-menu-button">
            <MenuOutlined />
          </IconButton>
        }
        {channel?.data?.name &&
          <Typography variant='h4' sx={{mr: 2}}>{channel?.data?.name}</Typography>
        }
        {members.map(({ user }, i) => {
          return (
            <div key={i} className='team-channel-header__name-multi'>
              <Avatar image={null} name={user?.name || user?.id} size={24} />
              <p className='team-channel-header__name user'>
                {user?.name || user?.id || '#'}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const getWatcherText = (watchers) => {
    if (!watchers) return 'No users online';
    if (watchers === 1) return '1 user online';
    return `${watchers} users online`;
  };

  return (
    <div className='team-channel-header__container'>
      {getMessagingHeader()}
      <div className='team-channel-header__right'>
        <IconButton sx={{ mr: 1.5 }}
          onClick={() => setIsEditing(true)}
          color="secondary">
          <EditOutlined />
        </IconButton>
        <p className='team-channel-header__right-text'>{getWatcherText(watcher_count)}</p>
        <div
          className='team-channel-header__right-pin-wrapper'
          onClick={(e) => {
            closeThread(e);
            setPinsOpen((prevState) => !prevState);
          }}
          role="presentation"
        >
          <PinIcon />
          <p className='team-channel-header__right-text'>Pins</p>
        </div>
      </div>
    </div>
  );
};
