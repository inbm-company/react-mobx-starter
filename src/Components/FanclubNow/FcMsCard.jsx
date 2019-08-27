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
import AllyClub from './AllyClub';
import TimeLine from 'Components/TimeLine';
@inject('store')
@observer
export default class FcMsCard extends Component {
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
      <section className="fc-ms-card" style={{ display: 'none' }}>
        <div className="fc-ms-card-inner">
          <h2 className="fc-tit">FNS</h2>
          <p className="mc">Membership card</p>
          <h3 className="fc-name">
            팬클럽명
            <br />
            유예나
          </h3>
          <p className="user-name">Misun Oh</p>
          <p className="exp">EXP: 03/20</p>
          <div className="card-no">NO.12345</div>
          <div className="qr-code"></div>
        </div>
      </section>
    );
  }
}
