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

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel) => channel.type === 'messaging');
};

export const ChannelListContainer = (props) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const { client, setActiveChannel } = useChatContext();
  const { filters, options, setIsCreating, setIsEditing, sort, targetUserId, onChannelSelected } = props;

  useEffect(() => {
    (async () => {
      if(targetUserId && client && setActiveChannel) {
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
    
          dispatch(openSnackbar({open: true, message: 'Saved.', variant: 'alert', alert: { color: 'success' }, close: false}));
    
          var newChannelQueryResponse = await client.queryChannels({id: json.groupId});
          if(newChannelQueryResponse.length === 1)
            setActiveChannel(newChannelQueryResponse[0]);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [targetUserId, client, setActiveChannel]);

  return (
    <MainCard
      content={false}
      className='tenx-channels-container'
    >
      <Box className='tenx-channels-header'>
        <Stack spacing={2}>
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between">
            <Typography variant="h5" color="inherit">
              Chats
            </Typography>
            
            <AddChannel
              {...{ setIsCreating, setIsEditing, onChannelSelected }}
              type='messaging'
            />
          </Stack>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: 3, pt: 0 }} className='tenx-channels-list'>
        <ChannelList
          channelRenderFilterFn={customChannelMessagingFilter}
          filters={filters[1]}
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
      </Box>
    </MainCard>
  );
};
