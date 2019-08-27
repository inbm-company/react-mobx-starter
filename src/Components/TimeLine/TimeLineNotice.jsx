import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Functions from 'Functions/Common.js';
import AuthorInfo from 'Components/TimeLine/AuthorInfo';
import PostInfo from 'Components/TimeLine/PostInfo';

@inject('store')
@observer
export default class TimeLineNotice extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const {
      router: { goTo, params }
    } = store;
    const info = this.props.info;

    const date = Functions.getFormattedDate(info.created_date);

    return (
      <div className="timeline type-notice">
        <div className="type-icon-wrap">
          <i className="type-icon type-notice-icon"></i>
        </div>
        <div className="timeline-post">
          <AuthorInfo info={info} />
          <div className="timeline-content">
            {info.title != '' && <div className="tc-tit tc-tit-strong tc-notice-comment">{info.title}</div>}
            <div className="tc-comment tc-comment-big">{info.content}</div>
          </div>
          <PostInfo info={info} />
        </div>
      </div>
    );
  }
}
