import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('store')
@observer
export default class TimeLineCalendar extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  render() {
    const info = this.props.info;
    return (
      <div className="timeline type-calendar">
        <div className="type-icon-wrap">
          <i className="type-icon type-calendar-icon"></i>
        </div>
        <div className="timeline-post">
          <div className="user-profile">
            <div className="user-photo">
              <img src="../images/@img-fan1.png" alt="" />
              <p className="user-name  user-name-admin">{info.username}</p>
            </div>
            <p className="created-time">{info.createdTime}</p>
          </div>
          <div className="timeline-content">
            <div className="tc-tit tc-tit-strong">{info.title}</div>

            {info.imgSrc === '' ? (
              ''
            ) : (
              <div className="tc-image">
                <img src={process.env.PUBLIC_URL + info.imgSrc} alt="" />
              </div>
            )}

            <div className="tc-comment tc-comment-big">
              <span className="tc-notice-comment">{info.noticeComment}</span>| {info.comment}
            </div>
          </div>
          <div className="post-info">
            <div className="ico-status-wrapper">
              <div className="ico-like-wrapper">
                <button type="button" className="ico-like"></button>
                <p className="like-count">{info.likeCount}</p>
              </div>
              <div className="ico-unlike-wrapper">
                <button type="button" className="ico-unlike"></button>
                <p className="unlike-count">{info.unLikeCount}</p>
              </div>
            </div>
            <button className="ico-menu-toggle"></button>
          </div>
        </div>
      </div>
    );
  }
}
