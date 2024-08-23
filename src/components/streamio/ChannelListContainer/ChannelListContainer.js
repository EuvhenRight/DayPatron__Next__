import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { prepareApiBody } from 'utils/stringUtils';

import { ChannelList, useChatContext } from 'stream-chat-react';
import { TeamChannelList } from '../TeamChannelList/TeamChannelList';
import { TeamChannelPreview } from '../TeamChannelPreview/TeamChannelPreview';
import { AddChannel } from 'assets/images/streamio';
import { 
  Typography, 
  Stack, 
  Box,
  Divider
} from '@mui/material';

import MainCard from 'components/MainCard';
import './ChannelListContainer.css';

export const ChannelListContainer = (props) => {
  const { options, setIsCreating, setIsEditing, sort, targetUserId, setTargetUserId, onChannelSelected, headerPlaceholder } = props;
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const { client, setActiveChannel } = useChatContext();
  
  useEffect(() => {
    (async () => {
      if(targetUserId && client && setActiveChannel && keycloak.idToken) {
        try {
          
          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/messages/groups',
            {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + keycloak.idToken,
                'Content-Type': 'application/json'
              },
              body: prepareApiBody({groupName: null, messagingProviderUserIds: [targetUserId], returnExisting: true})
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
    
          var newChannelQueryResponse = await client.queryChannels({id: json.groupId});
          if(newChannelQueryResponse.length === 1)
            setActiveChannel(newChannelQueryResponse[0]);
        } catch (err) {
          console.log(err);
        }
        setTargetUserId(null);
      }
    })();
  }, [targetUserId, client, setActiveChannel, keycloak.idToken]);

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
          />
        }
      </Box>
    </MainCard>
  );
};
