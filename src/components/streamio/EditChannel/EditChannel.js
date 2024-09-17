import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch, useSelector } from 'react-redux';
import { useChatContext } from 'stream-chat-react';
import { openSnackbar } from 'store/reducers/snackbar';
import { prepareApiBody } from 'utils/stringUtils';

import { Button, Divider, Stack } from '@mui/material';
import './EditChannel.css';

import { UserList } from '../CreateChannel/UserList';

import { CloseCreateChannel } from 'assets/images/streamio';

export const EditChannel = (props) => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const personalInformation = useSelector(state => state.personalInformation);
  const { filters, setIsEditing, connectAsAdmin } = props;
  const { channel } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState(Object.keys(channel?.state?.members));

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
          body: prepareApiBody({groupId: channel.data.id, messagingProviderUserIds: selectedUsers, contractorId: connectAsAdmin ? null : personalInformation?.id})
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

      setIsEditing(false);
      setSelectedUsers(json.messagingProviderUserIds);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='edit-channel__container'>
      <div className='edit-channel__header'>
        <p>Edit Chat</p>
        <CloseCreateChannel {...{ setIsEditing }} />
      </div>
      <Divider />
      <UserList {...{ filters, setSelectedUsers, selectedUsers, connectAsAdmin }} />
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 1.5, mr: 1.5, mb: 1.5 }}>
        <Button onClick={updateChannel} variant="contained">
          Save
        </Button>
      </Stack>
    </div>
  );
};
