import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import { Link } from 'mobx-router';
import PropTypes from 'prop-types';
import Views from 'Routers';

@inject('store')
@observer
export default class MyFanclubItem extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  @action gotoNow = async event => {
    event.preventDefault();

    const self = this;
    const { store } = this.props;
    const { fanclubStore } = store;
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
    const { store } = this.props;
    const { fanclubStore } = store;
    const info = this.props.info;
    const {
      router: { goTo, params }
    } = store;

    return (
      <div className="item">
        <a href="#" onClick={this.gotoNow}>
          <p className="img">
            <img src={`${fanclubStore.IMAGE_SERVER_URL}/${info.imgSrc}`} alt="" />
            {info.alarms > 0 && <i className="badge">{info.alarms}</i>}
          </p>
          <p className="txt">{info.name}</p>
        </a>
      </div>
    );
  }
}
