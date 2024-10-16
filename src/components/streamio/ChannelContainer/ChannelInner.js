import React, { useState } from 'react';
import { logChatPromiseExecution } from 'stream-chat';

import {
  defaultPinPermissions,
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelActionContext,
  useChannelStateContext
} from 'stream-chat-react';

import { PinnedMessageList } from '../PinnedMessageList/PinnedMessageList';
import { TeamChannelHeader } from '../TeamChannelHeader/TeamChannelHeader';

export const GiphyContext = React.createContext({});

export const ChannelInner = (props) => {
  const { pinsOpen, setIsEditing, setPinsOpen, onShowChannelSelector, isChannelSelectorVisible } = props;

  const [giphyState, setGiphyState] = useState(false);

  const giphyStateObj = {
    giphyState: giphyState,
    setGiphyState,
  };

  const { sendMessage } = useChannelActionContext();
  const { thread } = useChannelStateContext();

  const teamPermissions = { ...defaultPinPermissions.team, user: true };
  const messagingPermissions = {
    ...defaultPinPermissions.messaging,
    user: true,
  };
  const pinnedPermissions = {
    ...defaultPinPermissions,
    team: teamPermissions,
    messaging: messagingPermissions,
  };

  const overrideSubmitHandler = (message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...updatedMessage, text: updatedText };
    }

    if (sendMessage) {
      const sendMessagePromise = sendMessage(updatedMessage);
      logChatPromiseExecution(sendMessagePromise, 'send message');
      setGiphyState(false);
    }
  };

  return (
    <GiphyContext.Provider value={giphyStateObj}>
      {!thread && !pinsOpen && 
        <Window>
          <TeamChannelHeader {...{ setIsEditing, setPinsOpen, onShowChannelSelector, isChannelSelectorVisible }} />
          <MessageList disableQuotedMessages pinPermissions={pinnedPermissions} />
          <MessageInput grow audioRecordingEnabled overrideSubmitHandler={overrideSubmitHandler}  />
        </Window>
      }
      <Thread />
      {pinsOpen && <PinnedMessageList setPinsOpen={setPinsOpen} />}
    </GiphyContext.Provider>
  );
};
