import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useSelector } from 'react-redux';
import { Chat, useCreateChatClient, enTranslations, Streami18n } from 'stream-chat-react';
import { prepareApiBody } from 'utils/stringUtils';

import 'stream-chat-react/dist/css/index.css';
import 'assets/css/streamio.css';

import { getRandomImage } from 'assets/images/streamio';
import { useChecklist } from './ChecklistTasks';
import { ChannelContainer } from 'components/streamio/ChannelContainer/ChannelContainer';
import { ChannelListContainer } from 'components/streamio/ChannelListContainer/ChannelListContainer';

const apiKey = process.env.REACT_APP_STREAM_KEY;
const urlParams = new URLSearchParams(window.location.search);
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    ...enTranslations,
  },
});

const filters = [
  { type: 'messaging' }
];
const options = { state: true, watch: true, presence: true, limit: 3 };
const sort = { last_message_at: -1, updated_at: -1 };

let keycloakParent = null;
const getToken = async () => {
  let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/messages/auth-tokens',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + keycloakParent?.idToken,
        'Content-Type': 'application/json'
      },
      body: prepareApiBody({})
    }
  );

  let json = await response.json();
  return json.token;
};

const TenxChat = () => {

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [connectAsAdmin/*, setConnectAsAdmin*/] = useState(true);
  const { keycloak } = useKeycloak();
  keycloakParent = keycloak;
  const personalInformation = useSelector(state => state.personalInformation);

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: getToken,
    userData: { 
      id: connectAsAdmin ? personalInformation?.messagingProviderAdminUserId : personalInformation?.messagingProviderUserId, 
      name: connectAsAdmin ? personalInformation?.messagingProviderAdminUserFullName : personalInformation?.firstName + ' ' + personalInformation?.lastName, 
      image: getRandomImage() 
    }
  });

  useChecklist(client, targetOrigin);

  useEffect(() => {
    if (!client) return;
  }, [client]);

  if (!client) return <div>Setting up client & connection...</div>;

  return (
    <>
      <div className='app__wrapper'>
        <Chat {...{ client, i18nInstance }}>
          <ChannelListContainer
            {...{
              isCreating,
              filters,
              options,
              setIsCreating,
              setIsEditing,
              sort,
            }}
          />
          <ChannelContainer
            {...{
              isCreating,
              isEditing,
              setIsCreating,
              setIsEditing,
            }}
          />
        </Chat>
      </div>
    </>
  );

};

export default TenxChat;
