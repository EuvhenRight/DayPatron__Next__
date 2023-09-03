// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  ShoppingCartOutlined
} from '@ant-design/icons';

// icons
const icons = {
  ShoppingCartOutlined
};

// ==============================|| MENU ITEMS - ORDER ||============================== //

const mission = {
  id: 'orders',
  title: <FormattedMessage id="orders" />,
  type: 'group',
  children: [
    {
      id: 'my-orders',
      title: <FormattedMessage id="my-orders" />,
      type: 'item',
      url: '/orders/my',
      icon: icons.ShoppingCartOutlined
    }
  ]
};

export default mission;
