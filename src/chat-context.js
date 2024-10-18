import React, { createContext, useContext, useState } from 'react';
import { useCreateChatClient, Streami18n, enTranslations } from 'stream-chat-react';
import { useKeycloak } from '@react-keycloak/web';
import { useSelector } from 'react-redux';
import { prepareApiBody } from 'utils/stringUtils';

// create context
const ChatContext = createContext();

const apiKey = process.env.REACT_APP_STREAM_KEY;

const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    ...enTranslations
  }
});

const options = { state: true, watch: true, presence: true, limit: 100 };
const sort = { last_message_at: -1, updated_at: -1 };

let keycloakParent = null;
let employerUserIdParent = null;

// fetch token
const getToken = async () => {
  let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/messages/auth-tokens', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + keycloakParent?.idToken,
      'Content-Type': 'application/json'
    },
    body: prepareApiBody({ employerUserId: employerUserIdParent })
  });

  let json = await response.json();
  return json.token;
};

export const ChatProvider = ({ children }) => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector((state) => state.personalInformation);
  const [connectAsAdmin, setConnectAsAdmin] = useState(true);

  keycloakParent = keycloak;
  employerUserIdParent = connectAsAdmin ? null : personalInformation?.id;


// create chat client
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: getToken,
    userData: {
      id: connectAsAdmin ? personalInformation?.messagingProviderAdminUserId : personalInformation?.messagingProviderUserId
    }
  });

  return (
    <ChatContext.Provider value={{ client, i18nInstance, options, sort, connectAsAdmin, setConnectAsAdmin }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
