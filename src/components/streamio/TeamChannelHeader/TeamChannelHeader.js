import React from 'react';
import {
  Avatar,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
} from 'stream-chat-react';

import './TeamChannelHeader.css';

import { ChannelInfo, PinIcon } from 'assets/images/streamio';

export const TeamChannelHeader = ({ setIsEditing, setPinsOpen }) => {
  const { client } = useChatContext();
  const { closeThread } = useChannelActionContext();
  const { channel, watcher_count } = useChannelStateContext();

  const getMessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID,
    );
    const additionalMembers = members.length - 3;

    if (!members.length) {
      return (
        <div className='team-channel-header__name-wrapper'>
          <Avatar image={null} size={32} />
          <p className='team-channel-header__name user'>#</p>
        </div>
      );
    }

    return (
      <div className='team-channel-header__name-wrapper'>
        {members.map(({ user }, i) => {
          if (i > 2) return null;
          return (
            <div key={i} className='team-channel-header__name-multi'>
              <Avatar image={user.image} name={user.name || user.id} size={32} />
              <p className='team-channel-header__name user'>
                {user.name || user.id || '#'}
              </p>
              <span style={{ display: 'flex' }} onClick={() => setIsEditing(true)} role="presentation">
                <ChannelInfo />
              </span>
            </div>
          );
        })}
        {additionalMembers > 0 && (
          <p className='team-channel-header__name user'>{`and ${additionalMembers} more`}</p>
        )}
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
