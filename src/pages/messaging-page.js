import TenxChat from 'sections/messaging/TenxChat';
import { useSearchParams } from "react-router-dom";

const MessagingPage = () => {
  let [searchParams] = useSearchParams();
  
  return (
    <TenxChat targetUserId={searchParams.get("tuid")} />
  );
};

export default MessagingPage;
