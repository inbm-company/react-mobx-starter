import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import Functions from 'Functions/Common.js';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import FanclubNavigation from 'Components/Common/FanclubNavigation';
import FanclubInfo from 'Components/Common/FanclubInfo';
import Views from 'Routers';
import NoticeAnnouncement from 'Components/Common/NoticeAnnouncement';

@inject('store')
@observer
export default class TimeLineVote extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  @observable toggleIndex = 0;

  @action toggleSelect = index => {
    console.log(index);
    this.toggleIndex = index;
  };

  @observable toggleIndex = true;

  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const {
      router: { goTo, params }
    } = store;

    const info = this.props.info;

    return (
      <div className="timeline type-vote">
        <div className="type-icon-wrap">
          <i className="type-icon type-vote-icon"></i>
        </div>
        <div className="timeline-post">
          <div className="user-profile">
            <div className="user-photo">
              <img src="../images/@img-fan5.png" alt="" />
              <p className="user-name">{info.username}</p>
            </div>
            <p className="created-time">{info.createdTime}</p>
          </div>
          <div className="timeline-content">
            <div className="tc-tit">{info.title}</div>

            <div className="tc-image-button-wrapper">
              <div className=" tc-image-button">
                {info.imgFirstSrc === '' ? (
                  ''
                ) : (
                  <div className="tc-image">
                    <img src={process.env.PUBLIC_URL + info.imgFirstSrc} alt="" />
                  </div>
                )}
                <button className={'vote-button ' + (this.toggleIndex === 1 ? 'vote-button-active' : '')} onClick={() => this.toggleSelect(1)}>
                  {info.voteFirstText}
                </button>
              </div>
              <div className=" tc-image-button">
                {info.imgSecondSrc === '' ? (
                  ''
                ) : (
                  <div className="tc-image">
                    <img src={process.env.PUBLIC_URL + info.imgSecondSrc} alt="" />
                  </div>
                )}
                <button className={'vote-button ' + (this.toggleIndex === 2 ? 'vote-button-active' : '')} onClick={() => this.toggleSelect(2)}>
                  {info.voteSecondText}
                </button>
              </div>
            </div>
            <button className="vote-submit-button">제출하기</button>

            <div className="tc-comment"></div>
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
