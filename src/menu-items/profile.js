// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  UserOutlined,
  BulbOutlined
} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
  BulbOutlined
};

// ==============================|| MENU ITEMS - PROFILE ||============================== //

const profile = {
  id: 'contractor',
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
    }
  ]
};

export default profile;
