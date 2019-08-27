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
import AllyClubItem from './AllyClubItem';

@inject('store')
@observer
export default class AllyClub extends Component {
  static propTypes = {
    store: PropTypes.any
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

    return (
      <section className="ally-club-section">
        <div className="section-tit">
          <h2 className="st">제휴 클럽</h2>
        </div>
        <div className="ac-list">
          {fanclubStore.currentFanclubAllianceInfo.length > 0 && fanclubStore.currentFanclubAllianceInfo.map((item, index) => <AllyClubItem key={index} info={item} />)}
          {!fanclubStore.currentFanclubAllianceInfo.length && <p className="no-data">현재 제휴클럽이 없습니다.</p>}
        </div>
      </section>
    );
  }
}
