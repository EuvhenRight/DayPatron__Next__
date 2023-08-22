// project import
import { FormattedMessage } from 'react-intl';

// assets
import {
  BankOutlined,
  UserOutlined,
  ProjectOutlined,
  BlockOutlined,
  MoneyCollectOutlined,
  FileTextOutlined,
  SearchOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BankOutlined,
  UserOutlined,
  ProjectOutlined,
  BlockOutlined,
  MoneyCollectOutlined,
  FileTextOutlined,
  SearchOutlined
};

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    {
      id: '10x',
      type: 'group',
      children: [
        {
          id: 'personal-information',
          title: <FormattedMessage id="personal-information" />,
          type: 'item',
          url: '/personal-information',
          icon: icons.UserOutlined
        },
        {
          id: 'companies',
          title: <FormattedMessage id="companies" />,
          type: 'item',
          url: '/companies/my',
          icon: icons.BankOutlined
        }
      ]
    },
    {
      id: 'missions',
      title: <FormattedMessage id="missions" />,
      type: 'group',
      children: [
        {
          id: 'my-missions',
          title: <FormattedMessage id="my-missions" />,
          type: 'item',
          url: '/missions/my',
          icon: icons.ProjectOutlined
        },
        {
          id: 'matches',
          title: <FormattedMessage id="matches" />,
          type: 'item',
          url: '/missions/matches',
          icon: icons.BlockOutlined
        }
      ]
    },
    {
      id: 'solutions',
      title: <FormattedMessage id="solutions" />,
      type: 'group',
      children: [
        {
          id: 'find-products',
          title: <FormattedMessage id="find-products" />,
          type: 'item',
          url: '/products',
          icon: icons.SearchOutlined
        }
      ]
    },
    {
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
    }
  ]
};

export default menuItems;
