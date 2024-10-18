import React, { useState, useEffect } from 'react';
import { useChatContext } from 'chat-context'; // Import the ChatContext
import { Chat } from 'stream-chat-react';

import 'stream-chat-react/dist/css/v2/index.css';
import 'assets/css/streamio.css';

import { useChecklist } from './ChecklistTasks';
import { ChannelContainer } from 'components/streamio/ChannelContainer/ChannelContainer';
import { ChannelListContainer } from 'components/streamio/ChannelListContainer/ChannelListContainer';
import { Grid, Stack, Typography, Switch, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useKeycloak } from '@react-keycloak/web';

const urlParams = new URLSearchParams(window.location.search);
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const TenxChat = ({ targetEntity, setTargetEntity }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChannelSelectorVisible, setIsChannelSelectorVisible] = useState(true);
  const [isMessagesContainerVisible, setIsMessagesContainerVisible] = useState(true);
  const { keycloak } = useKeycloak();

  const { client, i18nInstance, options, sort, connectAsAdmin, setConnectAsAdmin } = useChatContext(); // Use the context

  const onChannelSelected = () => {
    if (matchDownMD) {
      setIsChannelSelectorVisible(false);
      setIsMessagesContainerVisible(true);
    }
  };

  const onShowChannelSelector = () => {
    if (matchDownMD) {
      setIsChannelSelectorVisible(true);
      setIsMessagesContainerVisible(false);
    }
  };

  useChecklist(client, targetOrigin);

  useEffect(() => {
    if (!client) return;
  }, [client]);

  useEffect(() => {
    if (matchDownMD) {
      setIsChannelSelectorVisible(true);
      setIsMessagesContainerVisible(false);
    } else {
      setIsChannelSelectorVisible(true);
      setIsMessagesContainerVisible(true);
    }
  }, [matchDownMD]);

  if (!client) return <div>Setting up client & connection...</div>;

  return (
    <Chat {...{ client, i18nInstance }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={4} className={isChannelSelectorVisible ? '' : 'tenx-hidden'}>
          <ChannelListContainer
            {...{
              isCreating,
              options,
              setIsCreating,
              setIsEditing,
              sort,
              targetEntity,
              setTargetEntity,
              onChannelSelected,
              connectAsAdmin,
              headerPlaceholder: keycloak.tokenParsed.roles.includes('admin') ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>Connect as admin</Typography>
                  <Switch
                    checked={connectAsAdmin}
                    onChange={(event, checked) => {
                      setConnectAsAdmin(checked);
                    }}
                  />
                </Stack>
              ) : (
                <></>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} md={8} className={isMessagesContainerVisible ? '' : 'tenx-hidden'}>
          <ChannelContainer
            {...{
              isCreating,
              isEditing,
              setIsCreating,
              setIsEditing,
              onShowChannelSelector,
              isChannelSelectorVisible,
              connectAsAdmin
            }}
          />
        </Grid>
      </Grid>
    </Chat>
  );
};

export default TenxChat;
