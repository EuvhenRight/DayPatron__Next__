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
  title: <FormattedMessage id="subscriptions-offering" />,
  type: 'group',
  children: [
    {
      id: 'my-subscription-plans',
      title: <FormattedMessage id="subscriptions-plans" />,
      type: 'item',
      url: '/subscriptions/plans',
      icon: icons.ContainerOutlined
    }
  ]
};

export default subscription;
