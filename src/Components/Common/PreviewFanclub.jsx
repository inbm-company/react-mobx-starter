import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable, computed } from 'mobx';

@inject('store')
@observer
export default class PreviewFanclub extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @observable newDate = '';

  @action closeLayer = () => {
    const { fanclubStore } = this.props.store;
    fanclubStore.previewFanclubInfoOpen = 'false';
    document.body.classList.remove('hidden');
  };

  componentDidMount() {
    const { fanclubStore } = this.props.store;
    console.log('fanclubStore.previewFanclubInfo');
    console.log(fanclubStore.previewFanclubInfo);
  }

  render() {
    const { fanclubStore } = this.props.store;

    return (
      <div className="preview-info-layer" style={{ display: fanclubStore.previewFanclubInfoOpen === 'true' ? 'block' : 'none' }}>
        <div className="fanclub-main-container">
          <div className="fc-main-img">
            <img src={fanclubStore.previewFanclubInfo.titleImgSrc} alt="" />
          </div>
          <div className="fc-main-content">
            <div className="fanclub-create-container">
              <header className="view-page-header">
                <div className="view-page-wrapper">
                  <button className="view-page-icon prev-button" onClick={this.closeLayer}></button>
                  <h1 className="view-page-text"></h1>
                </div>
                <div className="view-page-content">
                  <button className="view-page-icon search-button"></button>
                  <button className="view-page-icon setting-button"></button>
                </div>
              </header>
            </div>
            <div className="fc-header">
              <h2 className="fc-o-tit">{fanclubStore.previewFanclubInfo.title}</h2>
              <div className="fc-o-infos">
                <p className="fans">
                  <span className="dt">팬</span>
                  <span className="dd">1</span>
                </p>
                <p className="ally-clubs">
                  <span className="dt">제휴한 클럽</span>
                  <span className="dd">0</span>
                </p>
                <p className="created-date">
                  <span className="dt">개설일</span>
                  <span className="dd">{this.newDate}</span>
                </p>
                <p className="fc-master">
                  <span className="dt">팬클럽지기</span>
                  <span className="dd">{fanclubStore.previewFanclubInfo.administrator}</span>
                </p>
              </div>
              <ul className="fc-o-nav">
                <li className="home">
                  <span className="active">NOW!</span>
                </li>
                <li className="members">
                  <span className="">회원목록</span>
                </li>
                <li className="fanclub-shop">
                  <span className="">팬클럽샵</span>
                </li>
                <li className="fandrive">
                  <span className="">드라이브</span>
                </li>
                <li className="single">
                  <span className="">싱글</span>
                </li>
              </ul>
            </div>
          </div>
          <section className="ally-club-section">
            <div className="section-tit">
              <h2 className="st">제휴 클럽</h2>
            </div>
            <p className="no-data">현재 재휴클럽이 없습니다.</p>
          </section>
          <div className="timeline-container">
            <div className="timline-section">
              <div className="timeline-wrap">
                <article className="day-title">
                  <div className="day-inner-wrap today">
                    <h2 className="day">오늘</h2>
                  </div>
                </article>
                <div className="timeline type-notice only-child">
                  <div className="type-icon-wrap">
                    <i className="type-icon type-notice-icon"></i>
                  </div>
                  <div className="timeline-post no-bottom-line">
                    <div className="user-profile">
                      <div className="user-photo">
                        <span className="img">
                          {fanclubStore.previewFanclubInfo.adminPhoto != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${fanclubStore.previewFanclubInfo.adminPhoto}`} alt="" />}
                        </span>
                        <p className="user-name user-name-admin">{fanclubStore.previewFanclubInfo.administrator}</p>
                      </div>
                      <p className="created-time">방금 전</p>
                    </div>
                    <div className="timeline-content">
                      <div className="tc-tit tc-tit-strong tc-notice-comment">클럽 개설</div>
                      <div className="tc-comment tc-comment-big">
                        <strong>&quot;{fanclubStore.previewFanclubInfo.title}&quot;</strong> 팬클럽을 개설하였습니다.
                      </div>
                    </div>
                    <div className="post-info">
                      <div className="ico-status-wrapper">
                        <div className="ico-like-wrapper">
                          <button type="button" className="ico-like"></button>
                          <p className="like-count">0</p>
                        </div>
                        <div className="ico-unlike-wrapper">
                          <button type="button" className="ico-unlike"></button>
                          <p className="unlike-count">0</p>
                        </div>
                      </div>
                      <button className="ico-menu-toggle"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
