import { SET_REQUEST_TYPE, 
  SET_FROM_LOCATION_FILTER,
  SET_TO_LOCATION_FILTER
} from "../actionTypes";

const initialState = {
  filter: {
    locations: {
      from: [],
      to: []
    },
    request: 'ride',
  }
};

const ui = (state = initialState, action) => {
  switch (action.type) {
    case SET_REQUEST_TYPE:
      return { ...state, filter: { locations: state.filter.locations, request: action.payload } };
    case SET_FROM_LOCATION_FILTER:
      return { ...state, filter: { locations: { from: action.payload, to: state.filter.locations.to }, request: state.filter.request } };
    case SET_TO_LOCATION_FILTER:
      return { ...state, filter: { locations: { from: state.filter.locations.from, to: action.payload }, request: state.filter.request } };
    default:
      return state;
  }
};

export default ui;
