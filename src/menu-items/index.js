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
  SearchOutlined,
  ShoppingCartOutlined,
  QuestionCircleOutlined,
  FileOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BankOutlined,
  UserOutlined,
  ProjectOutlined,
  BlockOutlined,
  MoneyCollectOutlined,
  FileTextOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  QuestionCircleOutlined,
  FileOutlined
};

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    {
      id: '10x',
      title: <FormattedMessage id="profile" />,
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
        },
        {
          id: 'find-subscriptions',
          title: <FormattedMessage id="find-subscriptions" />,
          type: 'item',
          url: '/subscriptions',
          icon: icons.SearchOutlined
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
          url: '/solutions',
          icon: icons.SearchOutlined
        }
      ]
    },
    {
      id: 'orders',
      title: <FormattedMessage id="orders" />,
      type: 'group',
      children: [
        {
          id: 'my-orders',
          title: <FormattedMessage id="my-orders" />,
          type: 'item',
          url: '/orders',
          icon: icons.ShoppingCartOutlined
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
    },
    {
      id: 'admin',
      title: <FormattedMessage id="admin" />,
      type: 'group',
      roles: ['admin'],
      children: [
        {
          id: 'billing',
          title: <FormattedMessage id="billing" />,
          type: 'item',
          url: '/billing',
          icon: icons.FileTextOutlined
        },
        {
          id: 'subscription-plan-templates',
          title: <FormattedMessage id="subscription-plan-templates" />,
          type: 'item',
          url: '/subscription-plans/templates',
          icon: icons.FileOutlined
        }
      ]
    },
    {
      id: 'help',
      title: <FormattedMessage id="help" />,
      type: 'group',
      children: [
        {
          id: 'support',
          title: <FormattedMessage id="support" />,
          type: 'item',
          url: '/support',
          icon: icons.QuestionCircleOutlined
        }
      ]
    }
  ]
};

export default menuItems;
