// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  UserOutlined,
  BulbOutlined,
  SettingOutlined,
  CalendarOutlined,
  RobotOutlined
} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
  BulbOutlined,
  SettingOutlined,
  CalendarOutlined,
  RobotOutlined
};

// ==============================|| MENU ITEMS - PROFILE ||============================== //

const profile = {
  id: 'talent',
  title: <FormattedMessage id="profile" />,
  type: 'group',
  children: [
    {
      id: 'profile-personal',
      title: <FormattedMessage id="profile-personal" />,
      type: 'item',
      url: '/profile/personal',
      icon: icons.UserOutlined
    },
    {
      id: 'profile-expertise',
      title: <FormattedMessage id="profile-expertise" />,
      type: 'item',
      url: '/profile/expertise',
      icon: icons.BulbOutlined
    },
    {
      id: 'profile-preferences',
      title: <FormattedMessage id="profile-preferences" />,
      type: 'item',
      url: '/profile/preferences',
      icon: icons.SettingOutlined
    },
    {
      id: 'profile-availability',
      title: <FormattedMessage id="profile-availability" />,
      type: 'item',
      url: '/profile/availability',
      icon: icons.CalendarOutlined
    },
    {
      id: 'profile-ai',
      title: <FormattedMessage id="profile-ai" />,
      type: 'item',
      url: '/profile/ai',
      icon: icons.RobotOutlined
    }
  ]
};

export default profile;
