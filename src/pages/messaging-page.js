import React, { useState } from 'react';
import TenxChat from 'sections/messaging/TenxChat';
import { useLocation } from 'react-router-dom';

const MessagingPage = () => {
  const location = useLocation();
  const [targetEntity, setTargetEntity] = useState({targetUserId: location.state?.targetUserId, targetEmployerId: location.state?.targetEmployerId});
  return (
    <TenxChat {...{targetEntity, setTargetEntity}} />
  );
};

export default MessagingPage;
