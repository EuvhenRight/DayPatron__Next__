import { useEffect } from 'react';
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/v2/index.css';

const apiKey = 'huqk3jdum38k';
const userId = 'curly-bread-8';
const userName = 'curly';
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY3VybHktYnJlYWQtOCJ9.qJNy958SKjLaRCquqSeH9qwfqQ1TA6FJZVT7h9aAncM';

const user = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?name=${userName}`,
};

const sort = { last_message_at: -1 };
const filters = {
  type: 'messaging',
  members: { $in: [userId] },
};
const options = {
  limit: 10,
};

const MessagingPage = () => {

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user
  });

  useEffect(() => {
    (async () => {
      if (!client) return;
    
      var channel = client.channel('messaging', 'tzzzt', {
        image: 'https://getstream.io/random_png/?name=react',
        name: 'Talk about React',
        members: [userId],
      });
      await channel.create();
    })();
  }, [client]);

  if (!client) return <div>Setting up client & connection...</div>;

  return (
    <Chat client={client}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput audioRecordingEnabled />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default MessagingPage;
