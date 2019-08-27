import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import Img from 'react-image';
import Functions from 'Functions/Common.js';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import FanclubNavigation from 'Components/Common/FanclubNavigation';
import FanclubInfo from 'Components/Common/FanclubInfo';
import Views from 'Routers';
import NoticeAnnouncement from 'Components/Common/NoticeAnnouncement';
import AllyClub from './AllyClub';
import FcMsCard from './FcMsCard';
import TimeLine from 'Components/TimeLine';
import _ from 'lodash';

@inject('store')
@observer
export default class FanclubNow extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @observable clubInfo = {};
  @observable mainImage = '';
  @observable postLoadingFlag = false;

  @action goWrite = () => {
    const { store } = this.props,
      { goTo } = this.props.store.router;
    goTo(Views.write, {}, store);
  };

  @action handleScroll = event => {
    const currentScrollTop = window.innerHeight + window.scrollY;
    const bottomScrollTop = document.body.scrollHeight - 300;

    if (currentScrollTop >= bottomScrollTop) {
      if (!this.postLoadingFlag) {
        this.postLoadingFlag = true;
        this.loadMore();
      }
    }
  };

  // 포스트를 더 불러온다.
  @action loadMore = async () => {
    const { fanclubStore } = this.props.store;
    const code = fanclubStore.currentFanclubInfo.code;
    const offset = fanclubStore.currentPostOffset;
    const limit = fanclubStore.currentPostLimit;

    const result = await fanclubStore.getTimelinePost({
      code: code,
      offset: offset + 10,
      limit: limit
    });

    // 데이터 남아 있는지 체크
    let dataRemainedFlag = result.postsize % 10 > 0 ? false : true;
    let nextOffset = offset + result.postsize;

    console.log('포스트 사이즈 : ', result.postsize);

    if (result.postsize === offset) dataRemainedFlag = false;

    if (dataRemainedFlag) {
      nextOffset = offset + 10;
      fanclubStore.updateCurrentPostOffset(nextOffset);
      this.postLoadingFlag = false;
    } else {
      fanclubStore.updateCurrentPostOffset(result.postsize);
    }
  };

  componentDidMount() {
    const { fanclubStore, router } = this.props.store;
    const scrollTop = fanclubStore.currentFanclubNowScrollTop;

    console.group('Now Router');
    console.log(router.params.from);
    console.groupEnd();

    window.addEventListener('scroll', this.handleScroll, false);

    if (router.params.from != undefined) {
      if (router.params.from === 'landing') {
        window.scrollTo(0, 0);
      }
    }
  }

  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const userInfo = fanclubStore.USER_INFO;
    const {
      router: { goTo, params }
    } = store;

    this.clubInfo = fanclubStore.currentFanclubInfo;
    this.mainImage = `${fanclubStore.IMAGE_SERVER_URL}/${this.clubInfo.main_image}`;

    return (
      <div className="fanclub-main-container">
        <div className="fc-main-img">
          <img src={this.mainImage} alt={this.clubInfo.title} />
        </div>
        <div className="fc-main-content">
          <ViewPageHedaer title={''} searchFlag={true} settingFlag={true} />
          <div className="fc-header">
            <h2 className="fc-o-tit">{this.clubInfo.title}</h2>
            <FanclubInfo info={this.clubInfo} />
            <FanclubNavigation route={'now'} />
          </div>
          <NoticeAnnouncement type={'alter-type1'} />
          <AllyClub />
          <TimeLine />
        </div>
        <FcMsCard />
      </div>
    );
  }
}
