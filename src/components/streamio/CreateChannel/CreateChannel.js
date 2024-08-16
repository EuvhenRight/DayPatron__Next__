import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useChatContext } from 'stream-chat-react';
import { prepareApiBody } from 'utils/stringUtils';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';

import { Button, Stack } from '@mui/material';
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
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const { filters, setIsCreating } = props;

  const { client, setActiveChannel } = useChatContext();

  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);

  const createChannel = async (event) => {
    event.preventDefault();

    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/messages/groups',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          },
          body: prepareApiBody({groupName: channelName, messagingProviderUserIds: selectedUsers})
        }
      );

      if (!response.ok) {
        dispatch(openSnackbar({open: true, message: 'Failed.', variant: 'alert', alert: { color: 'error' }, close: false }));
        return;
      }

      let json = await response.json();

      if (!json?.groupId) {
        dispatch(openSnackbar({open: true, message: 'Failed.', variant: 'alert', alert: { color: 'error' }, close: false }));
        return;
      }

      dispatch(openSnackbar({open: true, message: 'Saved.', variant: 'alert', alert: { color: 'success' }, close: false}));

      setChannelName('');
      setIsCreating(false);
      setSelectedUsers([client.userID]);

      let newChannelQueryResponse = await client.queryChannels({id: json.groupId});
      if(newChannelQueryResponse.length === 1)
        setActiveChannel(newChannelQueryResponse[0]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='create-channel__container'>
      <div className='create-channel__header'>
        <p>Create a New Chat</p>
        <CloseCreateChannel {...{ setIsCreating }} />
      </div>
      <ChannelNameInput {...{ channelName, setChannelName }} />
      <UserList {...{ filters, setSelectedUsers }} />
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5, mr: 3 }}>
        <Button onClick={createChannel} variant="contained">
          Save
        </Button>
      </Stack>
    </div>
  );
};
