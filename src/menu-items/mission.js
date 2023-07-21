// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  SearchOutlined,
  CommentOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';

// icons
const icons = {
  SearchOutlined,
  CommentOutlined,
  FieldTimeOutlined
};

// ==============================|| MENU ITEMS - MISSION ||============================== //

const mission = {
  id: 'missions',
  title: <FormattedMessage id="missions" />,
  type: 'group',
  children: [
    {
      id: 'missions',
      title: <FormattedMessage id="missions" />,
      type: 'item',
      url: '/missions',
      icon: icons.SearchOutlined
    },
    {
      id: 'mission-chat',
      title: <FormattedMessage id="mission-chat" />,
      type: 'item',
      url: '/missions/chat',
      icon: icons.CommentOutlined
    },
    {
      id: 'mission-hours',
      title: <FormattedMessage id="mission-hours" />,
      type: 'item',
      url: '/missions/hours',
      icon: icons.FieldTimeOutlined
    }
  ]
};

export default mission;
