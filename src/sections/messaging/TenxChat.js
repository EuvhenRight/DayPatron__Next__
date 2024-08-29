import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useSelector } from 'react-redux';
import { Chat, useCreateChatClient, enTranslations, Streami18n } from 'stream-chat-react';
import { prepareApiBody } from 'utils/stringUtils';

import 'stream-chat-react/dist/css/v2/index.css';
import 'assets/css/streamio.css';

import { useChecklist } from './ChecklistTasks';
import { ChannelContainer } from 'components/streamio/ChannelContainer/ChannelContainer';
import { ChannelListContainer } from 'components/streamio/ChannelListContainer/ChannelListContainer';
import { 
  Grid, 
  Stack,
  Typography,
  Switch,
  useMediaQuery 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const apiKey = process.env.REACT_APP_STREAM_KEY;
const urlParams = new URLSearchParams(window.location.search);
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    ...enTranslations,
  },
});

const options = { state: true, watch: true, presence: true, limit: 100 };
const sort = { last_message_at: -1, updated_at: -1 };

let keycloakParent = null;
let employerUserIdParent = null;
const getToken = async () => {
  let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/messages/auth-tokens',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + keycloakParent?.idToken,
        'Content-Type': 'application/json'
      },
      body: prepareApiBody({employerUserId: employerUserIdParent})
    }
  );

  let json = await response.json();
  return json.token;
};

const TenxChat = ({targetUserId, setTargetUserId}) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [connectAsAdmin, setConnectAsAdmin] = useState(true);
  const [isChannelSelectorVisible, setIsChannelSelectorVisible] = useState(true);
  const [isMessagesContainerVisible, setIsMessagesContainerVisible] = useState(true);

  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  keycloakParent = keycloak;
  employerUserIdParent = connectAsAdmin ? null : personalInformation?.id;

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: getToken,
    userData: { 
      id: connectAsAdmin ? personalInformation?.messagingProviderAdminUserId : personalInformation?.messagingProviderUserId
    }
  });
  
  const onChannelSelected = () => {
    if(matchDownMD) {
      setIsChannelSelectorVisible(false);
      setIsMessagesContainerVisible(true);
    }
  }

  const onShowChannelSelector = () => {
    if(matchDownMD) {
      setIsChannelSelectorVisible(true);
      setIsMessagesContainerVisible(false);
    }
  }
  
  useChecklist(client, targetOrigin);

  useEffect(() => {
    if (!client) return;
  }, [client]);

  useEffect(() => {
    if(matchDownMD) {
      setIsChannelSelectorVisible(false);
      setIsMessagesContainerVisible(true);
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
              targetUserId,
              setTargetUserId,
              onChannelSelected,
              connectAsAdmin,
              headerPlaceholder: keycloak.tokenParsed.roles.includes('admin') ?
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>Connect as admin</Typography>
                  <Switch
                    checked={connectAsAdmin}
                    onChange={(event, checked) => {
                      setConnectAsAdmin(checked);
                    }}
                  />
                </Stack>
                :
                <></>
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
