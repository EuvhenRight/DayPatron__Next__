// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  DollarOutlined,
  CalendarOutlined,
  BankOutlined,
  CarOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DollarOutlined,
  CalendarOutlined,
  BankOutlined,
  CarOutlined
};

// ==============================|| MENU ITEMS - PREFERENCE ||============================== //

const preference = {
  id: 'preference',
  title: <FormattedMessage id="preference" />,
  type: 'group',
  children: [
    {
      id: 'preference-rate',
      title: <FormattedMessage id="preference-rate" />,
      type: 'item',
      url: '/preference/rate',
      icon: icons.DollarOutlined
    },
    {
      id: 'preference-availability',
      title: <FormattedMessage id="preference-availability" />,
      type: 'item',
      url: '/preference/availability',
      icon: icons.CalendarOutlined
    },
    {
      id: 'preference-workplace',
      title: <FormattedMessage id="preference-workplace" />,
      type: 'item',
      url: '/preference/workplace',
      icon: icons.BankOutlined
    },
    {
      id: 'preference-travel',
      title: <FormattedMessage id="preference-travel" />,
      type: 'item',
      url: '/preference/travel',
      icon: icons.CarOutlined
    }
  ]
};

export default preference;
