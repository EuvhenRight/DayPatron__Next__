import React from 'react';
import { MessageSimple, useMessageContext } from 'stream-chat-react';

import './TeamMessage.css';

export const TeamMessage = (props) => {
  const { setPinsOpen } = props;

  const {
    handleOpenThread,
    message,
  } = useMessageContext();

  const handleOpenThreadOverride = (event) => {
    if (setPinsOpen) setPinsOpen(false);
    handleOpenThread(event);
  };

  return (
    <div className={message.isPinned ? 'pinned-message' : 'unpinned-message'}>
      <MessageSimple {...props} message={message} handleOpenThread={handleOpenThreadOverride} />
      {/** potentially add replies component here */}
    </div>
  );
};
