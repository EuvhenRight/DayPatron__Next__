import { LOADING_DETAILS_UPDATE } from './actions';

export const initialState = { isLoading: false, countLoading: 0 };

const loadingDetails = (state = initialState, action) => {

  switch (action.type) {
    case LOADING_DETAILS_UPDATE: {
      let delta = action.payload.isLoading ? 1 : -1;
      let newCountLoading = state.countLoading + delta;
      const loadingDetailsData = { isLoading: newCountLoading > 0, countLoading: newCountLoading };
      
      return {
        ...state,
        ...loadingDetailsData
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default loadingDetails;
