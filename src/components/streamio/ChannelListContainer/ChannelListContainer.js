import React, { useState, useEffect, Fragment  } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { prepareApiBody } from 'utils/stringUtils';
import userTypes from 'data/userTypes';

import { ChannelList, useChatContext } from 'stream-chat-react';
import { TeamChannelList } from '../TeamChannelList/TeamChannelList';
import { TeamChannelPreview } from '../TeamChannelPreview/TeamChannelPreview';
import { AddChannel } from 'assets/images/streamio';
import { Avatar } from 'stream-chat-react';
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';

import MainCard from 'components/MainCard';
import './ChannelListContainer.css';

export const ChannelListContainer = (props) => {
  const { options, setIsCreating, setIsEditing, sort, targetUserId, setTargetUserId, onChannelSelected, headerPlaceholder, connectAsAdmin } = props;
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const { client, setActiveChannel } = useChatContext();
  const [grouplessUsers, setGrouplessUsers] = useState([]);
  const personalInformation = useSelector(state => state.personalInformation);
  
  useEffect(() => {
    (async () => {
      if(targetUserId && client && setActiveChannel && keycloak.idToken) {
        var newChannelId = await createChannelForUser(targetUserId);
        await activateChannelById(newChannelId);
        setTargetUserId(null);
      }
    })();
  }, [connectAsAdmin, targetUserId, client, setActiveChannel, keycloak.idToken]);

  useEffect(() => {
    (async () => {
      await bindGrouplessUsers();
    })();
  }, [connectAsAdmin, personalInformation?.id, keycloak.idToken]);
  
  const createChannelForUser = async (userId) => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/messages/groups',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          },
          body: prepareApiBody({groupName: null, messagingProviderUserIds: [userId], returnExisting: true, employerUserId: connectAsAdmin ? null : personalInformation?.id})
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

      return json.groupId;
    } catch (err) {
      console.log(err);
    }
  }

  const activateChannelById = async (channelId) => {
    var newChannelQueryResponse = await client.queryChannels({id: channelId});
    if(newChannelQueryResponse.length === 1)
      setActiveChannel(newChannelQueryResponse[0]);
  }

  const bindGrouplessUsers = async () => {
    try {
        
      let queryString = connectAsAdmin ? '' : '?employerUserId=' + personalInformation?.id;
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/messages/groupless-users' + queryString,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        dispatch(openSnackbar({open: true, message: 'Failed.', variant: 'alert', alert: { color: 'error' }, close: false }));
        return;
      }

      let json = await response.json();

      if (!json?.users) {
        dispatch(openSnackbar({open: true, message: 'Failed.', variant: 'alert', alert: { color: 'error' }, close: false }));
        return;
      }

      setGrouplessUsers(json?.users);
    } catch (err) {
      console.log(err);
    }
  }
  
  const onGrouplessUserSelected = async (grouplessUser) => {
    setIsCreating(false);
    setIsEditing(false);
    let newChannelId = await createChannelForUser(grouplessUser?.messagingProviderUserId);
    await bindGrouplessUsers();
    await activateChannelById(newChannelId);
  }

  const getUserLabel = (user) => {
    if(!user)
      return 'Unknown';
    let result = (user.name || user.messagingProviderUserId) + ' (' + userTypes.find(item => item.code === user.userType)?.label + ')';
    let suffix = client?.userID === user.messagingProviderUserId ? ' (Me)' : '';
    result += suffix;
    return result;
  };

  return (
    <MainCard
      content={false}
      className='tenx-channels-container'
    >
      <Box className='tenx-channels-header'>
        <Stack spacing={2}>
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between">
            <Typography variant="h5">
              Chats
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" >
              {headerPlaceholder}
              <AddChannel
                {...{ setIsCreating, setIsEditing, onChannelSelected }}
                type='messaging'
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: 3, pt: 0 }} className='tenx-channels-list'>
        {client?.userID && 
          
          <List component="nav">
            <ChannelList
              filters={ { type: 'messaging', members: { $in: [client.userID]}} }
              options={options}
              sort={sort}
              List={(listProps) => (
                <TeamChannelList
                  {...listProps}
                  {...{ setIsCreating, setIsEditing }}
                  type='messaging'
                />
              )}
              Preview={(previewProps) => (
                <TeamChannelPreview
                  {...previewProps}
                  {...{ setIsCreating, setIsEditing, onChannelSelected }}
                  type='messaging'
                />
              )}
              EmptyStateIndicator={() => {<></>}}
            />
            <div className="str-chat">
              {grouplessUsers?.map((grouplessUser, grouplessUserIndex) => 
                <Fragment key={grouplessUserIndex}>
                  <ListItemButton
                    sx={{ pl: 1 }}
                    onClick={async () => {
                      await onGrouplessUserSelected(grouplessUser);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        image={undefined}
                        name={grouplessUser?.name}
                        size={36}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack component="span" direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                          <Typography
                            variant="h5"
                            color="inherit"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {getUserLabel(grouplessUser)}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Stack component="span" direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                          <Typography>
                          </Typography>
                          <PlusOutlined />
                        </Stack>
                      }
                    />
                  </ListItemButton>
                  <Divider />
                </Fragment>
              )}
            </div>
          </List>
        }
      </Box>
    </MainCard>
  );
};
