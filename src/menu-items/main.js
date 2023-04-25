// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  DeploymentUnitOutlined,
  UserOutlined,
  AimOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DeploymentUnitOutlined,
  UserOutlined,
  AimOutlined
};

// ==============================|| MENU ITEMS - CONTRACTOR ||============================== //

const other = {
  id: 'contractor',
  title: <FormattedMessage id="contractor" />,
  type: 'group',
  children: [
    {
      id: 'contractor-profile',
      title: <FormattedMessage id="contractor-profile" />,
      type: 'item',
      url: '/contractor/profile/personal',
      icon: icons.UserOutlined
    },
    {
      id: 'contractor-preferences',
      title: <FormattedMessage id="contractor-preferences" />,
      type: 'item',
      url: '/contractor/preferences',
      icon: icons.AimOutlined
    },
    {
      id: 'missions',
      title: <FormattedMessage id="missions" />,
      type: 'item',
      url: '/missions',
      icon: icons.DeploymentUnitOutlined
    }
  ]
};

export default other;
