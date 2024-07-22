import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { channelByUser } from './utils';

const SearchResult = (props) => {
  const { channel, focusedId } = props;

  const { client, setActiveChannel } = useChatContext();

  return (
    <div
      onClick={async () => {
        channelByUser({ client, setActiveChannel, channel });
      }}
      className={
        focusedId === channel.id
          ? 'channel-search__result-container__focused'
          : 'channel-search__result-container'
      }
    >
      <div className='channel-search__result-user'>
        <Avatar image={channel.image || undefined} name={channel.name || channel.id} size={24} />
        <p className='channel-search__result-text'>
          {channel.name || channel.id || '#'}
        </p>
      </div>
    </div>
  );
};

export const ResultsDropdown = ({
  directChannels,
  focusedId,
  loading,
  setChannel,
  setQuery,
}) => {
  document.addEventListener('click', () => setQuery(''));

  return (
    <div className='channel-search__results'>
      <p className='channel-search__results-header'>Groups</p>
      {loading && !directChannels.length && (
        <p className='channel-search__results-header'>
          <i>Loading...</i>
        </p>
      )}
      {!loading && !directChannels.length ? (
        <p className='channel-search__results-header'>
          <i>No groups found</i>
        </p>
      ) : (
        directChannels?.map((channel, i) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={i}
            setChannel={setChannel}
          />
        ))
      )}
    </div>
  );
};
