import { RATE_UPDATE, RATE_GET } from './actions';

export const initialState = { currency: null, lowerLimit: null, upperLimit: null };

const rate = (state = initialState, action) => {

  switch (action.type) {
    case RATE_UPDATE: {
      const rateData = action.payload;
      
      return {
        ...state,
        ...rateData
      };
    }
    case RATE_GET: {
      const rateData = action.payload;

      return {
        ...state,
        ...rateData
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default rate;
