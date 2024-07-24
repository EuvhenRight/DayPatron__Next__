import React from 'react';
import { Message, MessageSimple, useChannelActionContext, useChannelStateContext } from 'stream-chat-react';

import './PinnedMessageList.css';

import { CloseThreadIcon } from 'assets/images/streamio';

export const PinnedMessageList = (props) => {
  const { setPinsOpen } = props;

  const { closeThread } = useChannelActionContext();

  const { channel } = useChannelStateContext();

  return (
    <div className='pinned-messages__container'>
      <div className='pinned-messages__header'>
        <p className='pinned-messages__header-text'>Pins</p>
        <CloseThreadIcon {...{ closeThread, setPinsOpen }} />
      </div>
      <div className='pinned-messages__list'>
        {channel.state.pinnedMessages.map((message) => (
          <Message
            groupStyles={['single']}
            Message={MessageSimple}
            key={message.id}
            message={message}
          />
        ))}
      </div>
    </div>
  );
};
