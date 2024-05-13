// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  UserOutlined,
  BulbOutlined,
  SettingOutlined,
  CalendarOutlined,
  RobotOutlined,
  LaptopOutlined,
  EditOutlined,
  FileProtectOutlined
} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
  BulbOutlined,
  SettingOutlined,
  CalendarOutlined,
  RobotOutlined,
  LaptopOutlined,
  EditOutlined,
  FileProtectOutlined
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
      id: 'profile-experience',
      title: <FormattedMessage id="profile-experience" />,
      type: 'item',
      url: '/profile/experience',
      icon: icons.LaptopOutlined
    },
    {
      id: 'profile-education',
      title: <FormattedMessage id="profile-education" />,
      type: 'item',
      url: '/profile/education',
      icon: icons.EditOutlined
    },
    {
      id: 'profile-certification',
      title: <FormattedMessage id="profile-certification" />,
      type: 'item',
      url: '/profile/certification',
      icon: icons.FileProtectOutlined
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
