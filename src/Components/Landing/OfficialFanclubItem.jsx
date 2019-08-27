import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import Views from 'Routers';

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

    return (
      <div className="item">
        <a href="#" onClick={this.gotoNow}>
          <div className="card-wrap">
            <div className="img-side">
              <img src={`${fanclubStore.IMAGE_SERVER_URL}/${info.imgSrc}`} alt="" />
            </div>
            <div className="info-side">
              <div className="inner-wrap">
                <p className="a-name">{info.artist}</p>
                <p className="fc-name">{info.name}</p>
                <p className="info">
                  <span className="ally">{info.ally} Alliances</span>
                  <span className="fans">{info.fans} fans</span>
                  <span className="date">{info.createdDate}</span>
                </p>
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }
}
