import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';
import { useChatContext } from 'stream-chat-react';
import { openSnackbar } from 'store/reducers/snackbar';
import { prepareApiBody } from 'utils/stringUtils';

import './EditChannel.css';

import { UserList } from '../CreateChannel/UserList';

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
      <input onChange={handleChange} placeholder='channel-name' type='text' value={channelName} />
      <p>Add Members</p>
    </div>
  );
};

export const EditChannel = (props) => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const { filters, setIsEditing } = props;
  const { channel } = useChatContext();

  const [channelName, setChannelName] = useState(channel?.data.name || channel?.data.id);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const updateChannel = async (event) => {
    try
    {
      event.preventDefault();

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/messages/groups',
        {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          },
          body: prepareApiBody({groupId: channel.data.id, groupName: channel.data.name, messagingProviderUserIds: selectedUsers})
        }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        return;
      }

      let json = await response.json();

      dispatch(
        openSnackbar({
          open: true,
          message: 'Saved.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

      setChannelName(json.groupName);
      setIsEditing(false);
      setSelectedUsers(json.messagingProviderUserIds);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='edit-channel__container'>
      <div className='edit-channel__header'>
        <p>Edit Channel</p>
        <CloseCreateChannel {...{ setIsEditing }} />
      </div>
      <ChannelNameInput {...{ channelName, setChannelName }} />
      <UserList {...{ filters, setSelectedUsers }} />
      <div className='edit-channel__button-wrapper' onClick={updateChannel} role="presentation">
        <p>Save Changes</p>
      </div>
    </div>
  );
};
