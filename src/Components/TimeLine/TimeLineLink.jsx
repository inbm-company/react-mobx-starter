import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import Functions from 'Functions/Common.js';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import FanclubNavigation from 'Components/Common/FanclubNavigation';
import FanclubInfo from 'Components/Common/FanclubInfo';
import Views from 'Routers';
import NoticeAnnouncement from 'Components/Common/NoticeAnnouncement';

@inject('store')
@observer
export default class TimeLineGroup extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  @action goWrite = () => {
    const { store } = this.props,
      { goTo } = this.props.store.router;
    goTo(Views.write, {}, store);
  };

  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const {
      router: { goTo, params }
    } = store;

    const info = this.props.info;
    return (
      <div className="timeline type-group">
        <div className="type-icon-wrap">
          <i className="type-icon type-group-icon"></i>
        </div>
        <div className="timeline-post">
          <div className="group-wrapper">
            <img src={process.env.PUBLIC_URL + info.imgAvatarSrc} alt="" />

            <p className="group-comment">
              <span className="group-comment-wrapper">
                <span className="group-user">{info.username}</span>
                <span className="group-text">님이</span>
              </span>
              <span className="group-comment-wrapper">
                <span className="group-user">{info.groupName}</span>
                <span className="group-text">을 만들었어요</span>
              </span>

              <button type="button" className="group-signup">
                가입 요청하기
              </button>
            </p>
            <div className="created-time">{info.createdTime}</div>
          </div>
        </div>
      </div>
    );
  }
}
