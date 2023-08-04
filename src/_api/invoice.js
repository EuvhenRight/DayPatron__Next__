// project import
import services from 'utils/mockAdapter';
import { invoice } from 'data/invoice';

// third-party
import _ from 'lodash';

services.onGet('/api/invoice/list').reply(200, { invoice });

services.onPost('/api/invoice/insert').reply((config) => {
  try {
    let list = JSON.parse(config.data);
    list = {
      ...list,
      id: invoice.length + 1
    };
    invoice.push(list);
    return [200, { list }];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

services.onPost('/api/invoice/update').reply((config) => {
  try {
    const list = JSON.parse(config.data);

    let NewInvoice = null;
    _.map(invoice, (_list) => {
      if (_list.id === list.id) {
        _.assign(_list, { ...list });
        NewInvoice = _list;
      }
      return _list;
    });

    return [200, { NewInvoice }];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

services.onPost('/api/invoice/delete').reply((config) => {
  try {
    const { invoiceId } = JSON.parse(config.data);
    _.reject(invoice, { id: invoiceId });

    return [200, { invoiceId }];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

services.onPost('/api/invoice/list/single').reply((config) => {
  try {
    const result = invoice.find((e) => e.id === Number(config.data));
    return [200, result];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});
