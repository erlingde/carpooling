import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'antd';

import { setCommentButtonClicked } from '../redux/actions';
import store from '../redux/store';

const CommentButton = () => {
  const handleOnClick = () => {
    store.dispatch(setCommentButtonClicked(true));
  }

  return (
    <Tooltip title='Write a comment'>
      <span className='editIcon' onClick={handleOnClick}>
        <i className="far fa-edit" />
      </span>
    </Tooltip>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    setCommentButtonClicked: clicked => {
      dispatch(setCommentButtonClicked(clicked));
    }
  }
}

export default connect(null, mapDispatchToProps)(CommentButton);