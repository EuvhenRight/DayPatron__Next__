// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  UserOutlined,
  BankOutlined
} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
  BankOutlined
};

// ==============================|| MENU ITEMS - PROFILE ||============================== //

const profile = {
  id: 'employer',
  title: <FormattedMessage id="employer" />,
  type: 'group',
  children: [
    {
      id: 'employer-details',
      title: <FormattedMessage id="employer-details" />,
      type: 'item',
      url: '/employer/details',
      icon: icons.BankOutlined
    },
    {
      id: 'employer-users',
      title: <FormattedMessage id="employer-users" />,
      type: 'item',
      url: '/employer/users',
      icon: icons.UserOutlined
    }
  ]
};

export default profile;
