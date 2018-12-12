import { SET_REQUEST_TYPE,
  SET_FROM_LOCATION_FILTER,
  SET_TO_LOCATION_FILTER,
  SET_COMMENT_BUTTON_CLICKED
} from "./actionTypes";


export const setRequestType = request => ({
  type: SET_REQUEST_TYPE,
  payload: request
});

export const setFromLocationFilter = filter => ({
  type: SET_FROM_LOCATION_FILTER,
  payload: filter
});

export const setToLocationFilter = filter => ({
  type: SET_TO_LOCATION_FILTER,
  payload: filter
});

export const setCommentButtonClicked = clicked => ({
  type: SET_COMMENT_BUTTON_CLICKED,
  payload: clicked
});