import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import './CreateChannel.css';

import { UserList } from './UserList';

import { CloseCreateChannel } from 'assets/images/streamio';

const ChannelNameInput = (props) => {
  const { channelName = '', setChannelName } = props;

  const handleChange = (event) => {
    event.preventDefault();
    setChannelName(event.target.value);
  };

  return (
    <div className='channel-name-input__wrapper'>
      <p>Name</p>
      <input
        onChange={handleChange}
        placeholder='channel-name (no spaces)'
        type='text'
        value={channelName}
      />
      <p>Add Members</p>
    </div>
  );
};

export const CreateChannel = (props) => {
  const { filters, setIsCreating } = props;

  const { client, setActiveChannel } = useChatContext();

  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);

  const createChannel = async (event) => {
    event.preventDefault();

    try {
      const newChannel = await client.channel('messaging', channelName, {
        name: channelName,
        members: selectedUsers
      });

      await newChannel.watch();

      setChannelName('');
      setIsCreating(false);
      setSelectedUsers([client.userID]);
      setActiveChannel(newChannel);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='create-channel__container'>
      <div className='create-channel__header'>
        <p>Create a New Group</p>
        <CloseCreateChannel {...{ setIsCreating }} />
      </div>
      <ChannelNameInput {...{ channelName, setChannelName }} />
      <UserList {...{ filters, setSelectedUsers }} />
      <div className='create-channel__button-wrapper' onClick={createChannel}>
        <p>Create Message Group</p>
      </div>
    </div>
  );
};
