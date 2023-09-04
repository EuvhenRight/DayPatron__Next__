// project import
import axios from 'utils/axios';
import { dispatch } from 'store';

// third-party
import { createSlice } from '@reduxjs/toolkit';

const countries = [
  { code: 'US', label: 'United States Dollar', currency: 'Dollar' },
  { code: 'GB', label: 'United Kingdom Pound', currency: 'Pound' },
  { code: 'IN', label: 'India Rupee', currency: 'Rupee' },
  { code: 'JP', label: 'Japan Yun', currency: 'Yun' }
];

const initialState = {
  isOpen: false,
  isCustomerOpen: false,
  open: false,
  country: countries[2],
  countries: countries,
  lists: [],
  list: null,
  error: null,
  alertPopup: false
};

// ==============================|| INVOICE - SLICE ||============================== //

const invoice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    // review invoice popup
    reviewInvoicePopup(state, action) {
      state.isOpen = action.payload.isOpen;
    },

    // is customer open
    customerPopup(state, action) {
      state.isCustomerOpen = action.payload.isCustomerOpen;
    },

    // handler customer form popup
    toggleCustomerPopup(state, action) {
      state.open = action.payload.open;
    },

    // handler customer form popup
    selectCountry(state, action) {
      state.country = action.payload.country;
    },

    hasError(state, action) {
      state.error = action.payload.error;
    },

    // get all invoice list
    getLists(state, action) {
      state.lists = action.payload;
    },

    // get invoice details
    getSingleList(state, action) {
      state.list = action.payload;
    },

    // create invoice
    createInvoice(state, action) {
      let newEvent = action.payload.list;
      newEvent = {
        ...newEvent,
        id: state.lists.length + 1
      };
      state.lists = [...state.lists, newEvent];
    },

    // update invoice
    UpdateInvoice(state, action) {
      const { NewInvoice } = action.payload;
      const InvoiceUpdate = state.lists.map((item) => {
        if (item.id === NewInvoice.id) {
          return NewInvoice;
        }
        return item;
      });
      state.lists = InvoiceUpdate;
    },

    // delete invoice
    deleteInvoice(state, action) {
      const { invoiceId } = action.payload;
      const deleteInvoice = state.lists.filter((list) => list.id !== invoiceId);
      state.lists = deleteInvoice;
    },

    //alert popup
    alertPopupToggle(state, action) {
      state.alertPopup = action.payload.alertToggle;
    }
  }
});

export default invoice.reducer;

export const { reviewInvoicePopup, customerPopup, toggleCustomerPopup, selectCountry, getLists, alertPopupToggle } = invoice.actions;

export function getInvoiceList(keycloak) {
  return async () => {
    try {
      //const response = await axios.get('/api/invoice/list');
      try {
        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/static-data',
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + keycloak.idToken
            }
          }
        );
        let json = await response.json();
        
        dispatch(invoice.actions.getLists(json?.staticData?.payouts?.invoices));
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      dispatch(invoice.actions.hasError(error));
    }
  };
}

export function getInvoiceInsert(NewLists) {
  return async () => {
    try {
      const response = await axios.post('/api/invoice/insert', NewLists);
      dispatch(invoice.actions.createInvoice(response.data));
    } catch (error) {
      dispatch(invoice.actions.hasError(error));
    }
  };
}

export function getInvoiceUpdate(NewLists) {
  return async () => {
    try {
      const response = await axios.post('/api/invoice/update', NewLists);
      dispatch(invoice.actions.UpdateInvoice(response.data));
    } catch (error) {
      dispatch(invoice.actions.hasError(error));
    }
  };
}

export function getInvoiceDelete(invoiceId) {
  return async () => {
    try {
      await axios.post('/api/invoice/delete', { invoiceId });
      dispatch(invoice.actions.deleteInvoice({ invoiceId }));
    } catch (error) {
      dispatch(invoice.actions.hasError(error));
    }
  };
}

export function getInvoiceSingleList(invoiceId) {
  return async () => {
    try {
      const response = await axios.post('/api/invoice/list/single', invoiceId);
      dispatch(invoice.actions.getSingleList(response.data));
    } catch (error) {
      dispatch(invoice.actions.hasError(error));
    }
  };
}
