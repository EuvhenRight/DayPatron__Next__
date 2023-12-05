// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  ContainerOutlined
} from '@ant-design/icons';

// icons
const icons = {
  ContainerOutlined
};

// ==============================|| MENU ITEMS - SUBSCRIPTION ||============================== //

const subscription = {
  id: 'subscriptions',
  title: <FormattedMessage id="subscriptions" />,
  type: 'group',
  children: [
    {
      id: 'my-subscription-offer',
      title: <FormattedMessage id="My Subscriptions" />,
      type: 'item',
      url: '/subscriptions/my',
      icon: icons.ContainerOutlined
    }
  ]
};

export default subscription;
