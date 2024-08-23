import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import { useKeycloak } from '@react-keycloak/web';

import './UserList.css';

import { InviteIcon } from 'assets/images/streamio';
import userTypes from 'data/userTypes';

const ListContainer = (props) => {
  const { children } = props;

  return (
    <div className='user-list__container'>
      <div className='user-list__header'>
        <p>User</p>
        <p>Last Active</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserItem = (props) => {
  const { index, setSelectedUsers, user, initiallySelected } = props;

  const [selected, setSelected] = useState(initiallySelected);

  const getLastActive = (i) => {
    switch (i) {
      case 0:
        return '12 min ago';
      case 1:
        return '27 min ago';
      case 2:
        return '6 hours ago';
      case 3:
        return '14 hours ago';
      case 4:
        return 'Yesterday';
      default:
        return 'Yesterday';
    }
  };

  const handleClick = () => {
    if (selected) {
      setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.messagingProviderUserId));
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, user.messagingProviderUserId]);
    }
    setSelected(!selected);
  };

  const getUserLabel = (user) => {
    let result = (user.name || user.messagingProviderUserId) + ' (' + userTypes.find(item => item.code === user.userType)?.label + ')';
    return result;
  };

  return (
    <div className='user-item__wrapper' onClick={handleClick} role="presentation">
      <div className='user-item__name-wrapper'>
        <Avatar image={user.image} name={getUserLabel(user)} size={32} />
        <p className='user-item__name'>{getUserLabel(user)}</p>
      </div>
      <p className='user-item__last-active'>{getLastActive(index)}</p>
      {selected ? <InviteIcon /> : <div className='user-item__invite-empty' />}
    </div>
  );
};

export const UserList = (props) => {
  const { keycloak } = useKeycloak();
  const { filters, setSelectedUsers, selectedUsers } = props;

  const { client } = useChatContext();

  const [error, setError] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;
      setLoading(true);
      try {
        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/messages/messageable-users',
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + keycloak.idToken
            }
          }
        );
    
        let json = await response.json();

        if (json.users.length) {
          setUsers(json.users);
        } else {
          setListEmpty(true);
        }
      } catch (err) {
        console.log(err);
        setError(true);
      }

      setLoading(false);
    };

    if (client) getUsers();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <ListContainer>
        <div className='user-list__message'>Error loading, please refresh and try again.</div>
      </ListContainer>
    );
  }

  if (listEmpty) {
    return (
      <ListContainer>
        <div className='user-list__message'>No users found.</div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading ? (
        <div className='user-list__message'>Loading users...</div>
      ) : (
        users?.length &&
        users.map((user, i) => (
          <UserItem 
            index={i} 
            key={user.messagingProviderUserId} 
            setSelectedUsers={setSelectedUsers} 
            user={user} 
            initiallySelected={selectedUsers?.includes(user?.messagingProviderUserId) === true} 
          />
        ))
      )}
    </ListContainer>
  );
};
