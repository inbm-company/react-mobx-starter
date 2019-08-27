import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import Header from 'Components/Landing/Header';
import MyFanclub from 'Components/Landing/MyFanclub';
import ArtistLive from 'Components/Landing/ArtistLive';
import FanboardChart from 'Components/Landing/FanboardChart';
import NewFanclub from 'Components/Landing/NewFanclub';
import OfficialFanclub from 'Components/Landing/OfficialFanclub';
import UserFanclub from 'Components/Landing/UserFanclub';
import Views from 'Routers';

@inject('store')
@observer
export default class Landing extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  async componentWillMount() {
    console.log('Landing 들어옴');

    const { fanclubStore } = this.props.store;

    // 내 클럽(내가만든 클럽 + 내가 가입한 클럽) 업데이트
    const myClubResult = await fanclubStore.getMyInClubList({ userid: fanclubStore.USER_INFO.userid });
    if (myClubResult.status === 200 && myClubResult.data.length) await fanclubStore.updateMyFanclub(myClubResult.data);

    // 모든 아티스트 목록을 업데이트
    const allArtistList = await fanclubStore.getAllArtistList();
    if (allArtistList.status === 200 && allArtistList.data.length) await fanclubStore.updateAllArtistList(allArtistList.data);

    // 신규 팬클럽 업데이트
    const newFanclubList = await fanclubStore.getNewFanclubList({ days: 3 });
    console.log(newFanclubList);
    if (newFanclubList.status === 200 && newFanclubList.data.length) await fanclubStore.updateNewFanclub(newFanclubList.data);

    // 공식 팬클럽 업데이트
    const officialClubResult = await fanclubStore.getOfficialClub();
    if (officialClubResult.status === 200) await fanclubStore.updateOfficialFanclub(officialClubResult.data);

    // 사용자 팬클럽(공식 팬클럽을 제외한 나머지 클럽)
    const userClubResult = await fanclubStore.getUserFanclubList();

    console.group('사용자 팬클럽');
    console.log(userClubResult);
    console.groupEnd();

    if (userClubResult.status === 200 && userClubResult.data.length) {
      await fanclubStore.updateUserFanclub(userClubResult.data);
    }
  }

  componentDidMount() {
    const { fanclubStore } = this.props.store;

    fanclubStore.updateCurrentFanclubNowScrollTop(0);
  }

  @action goManage = () => {
    const { store } = this.props;
    const {
      router: { goTo, params }
    } = store;

    goTo(Views.management, {}, store);
  };

  render() {
    const { fanclubStore } = this.props.store;

    return (
      <div className="fanclub-landing-container">
        <Header />
        <MyFanclub />
        <ArtistLive />
        <FanboardChart />
        {fanclubStore.newFanclub.length > 0 && <NewFanclub />}
        {fanclubStore.officialFanclub.length > 0 && <OfficialFanclub />}
        <UserFanclub />
      </div>
    );
  }
}
