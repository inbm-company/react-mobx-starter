import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import Views from 'Routers';
import moment from 'moment';

@inject('store')
@observer
export default class NewFanclubItem extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  @action gotoNow = async event => {
    event.preventDefault();

    const self = this;
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const {
      router: { goTo, params }
    } = store;

    const result = await fanclubStore.updateInstantCurrentFanclubInfo({
      code: self.props.info.code,
      alliances: true
    });
    if (result) {
      console.log('update 완료');
      goTo(Views.clubHome, { from: 'landing' }, store);
    }
  };

  render() {
    const { fanclubStore } = this.props.store;
    const info = this.props.info;
    const date = moment(info.created_date).format('YYYY-MM-DD');

    return (
      <div className="item">
        <a href="#" onClick={this.gotoNow}>
          <div className="img">
            <div className="img-inner">
              <img src={`${fanclubStore.IMAGE_SERVER_URL}/${info.imgSrc}`} alt="" />
              {info.alarms > 0 && <i className="badge">{info.alarms}</i>}
            </div>
          </div>
          <div className="desc-area">
            <p className="da-tit">{info.artist}</p>
            <p className="desc-txt">{info.name}</p>
            <p className="da-info">
              <span className="ally">{info.ally} Alliances</span>
              <span className="fans">{info.fans} fans</span>
              <span className="date">{date}</span>
            </p>
          </div>
        </a>
      </div>
    );
  }
}
