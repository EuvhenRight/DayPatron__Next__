import React from 'react';
import { ChannelList } from 'stream-chat-react';

import './ChannelListContainer.css';

import { ChannelSearch } from '../ChannelSearch/ChannelSearch';
import { TeamChannelList } from '../TeamChannelList/TeamChannelList';
import { TeamChannelPreview } from '../TeamChannelPreview/TeamChannelPreview';

import { SideBarFlag, SideBarLogo } from 'assets/images/streamio';

const SideBar = () => (
  <div className='channel-list__sidebar'>
    <div className='channel-list__sidebar__icon1'>
      <div className='icon1__inner'>
        <SideBarLogo />
      </div>
    </div>
    <div className='channel-list__sidebar__icon2'>
      <div className='icon2__inner'>
        <SideBarFlag />
      </div>
    </div>
  </div>
);

const CompanyHeader = () => (
  <div className='channel-list__header'>
    <p className='channel-list__header__text'>10x</p>
  </div>
);

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel) => channel.type === 'messaging');
};

export const ChannelListContainer = (props) => {
  const { filters, options, setIsCreating, setIsEditing, sort } = props;

  return (
    <div className='channel-list__container'>
      <SideBar />
      <div className='channel-list__list__wrapper'>
        <CompanyHeader />
        <ChannelSearch />
        <ChannelList
          channelRenderFilterFn={customChannelMessagingFilter}
          filters={filters[1]}
          options={options}
          setActiveChannelOnMount={false}
          sort={sort}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              {...{ setIsCreating, setIsEditing }}
              type='messaging'
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              {...{ setIsCreating, setIsEditing }}
              type='messaging'
            />
          )}
        />
      </div>
    </div>
  );
};
