// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  MoneyCollectOutlined,
  FileTextOutlined
} from '@ant-design/icons';

// icons
const icons = {
  MoneyCollectOutlined,
  FileTextOutlined
};

// ==============================|| MENU ITEMS - INVOICING ||============================== //

const mission = {
  id: 'invoicing',
  title: <FormattedMessage id="invoicing" />,
  type: 'group',
  children: [
    {
      id: 'invoices',
      title: <FormattedMessage id="invoices" />,
      type: 'item',
      url: '/invoices',
      icon: icons.MoneyCollectOutlined
    },
    {
      id: 'invoice-settings',
      title: <FormattedMessage id="invoice-settings" />,
      type: 'item',
      url: '/invoices/settings',
      icon: icons.FileTextOutlined
    }
  ]
};

export default mission;
