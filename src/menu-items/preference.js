// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  UserOutlined,
  CalendarOutlined,
  HomeOutlined,
  CarOutlined
} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
  CalendarOutlined,
  HomeOutlined,
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
      icon: icons.HomeOutlined
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
