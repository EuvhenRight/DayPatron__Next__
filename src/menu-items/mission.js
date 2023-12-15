// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  SearchOutlined,
  CommentOutlined,
  FieldTimeOutlined,
  ContainerOutlined
} from '@ant-design/icons';

// icons
const icons = {
  SearchOutlined,
  CommentOutlined,
  FieldTimeOutlined,
  ContainerOutlined
};

// ==============================|| MENU ITEMS - MISSION ||============================== //

const mission = {
  id: 'missions',
  title: <FormattedMessage id="missions" />,
  type: 'group',
  children: [
    {
      id: 'find-mission',
      title: <FormattedMessage id="find-mission" />,
      type: 'item',
      url: '/missions',
      icon: icons.SearchOutlined
    },
    //{
    //  id: 'mission-chat',
    //  title: <FormattedMessage id="mission-chat" />,
    //  type: 'item',
    //  url: '/missions/chat',
    //  icon: icons.CommentOutlined
    //},
    {
      id: 'mission-time-tracking',
      title: <FormattedMessage id="mission-time-tracking" />,
      type: 'item',
      url: '/missions/time-tracking',
      icon: icons.FieldTimeOutlined
    },
    {
      id: 'my-subscription-plans',
      title: <FormattedMessage id="subscriptions-plans" />,
      type: 'item',
      url: '/subscriptions/plans',
      icon: icons.ContainerOutlined
    }
  ]
};

export default mission;
