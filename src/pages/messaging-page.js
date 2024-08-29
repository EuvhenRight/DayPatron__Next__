import React, { useState } from 'react';
import TenxChat from 'sections/messaging/TenxChat';
import { useLocation } from 'react-router-dom';

const MessagingPage = () => {
  const location = useLocation();
  const [targetUserId, setTargetUserId] = useState(location.state?.targetUserId);
  return (
    <TenxChat {...{targetUserId, setTargetUserId}} />
  );
};

export default MessagingPage;
