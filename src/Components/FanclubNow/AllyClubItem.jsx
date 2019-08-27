import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import Views from 'Routers';

@inject('store')
@observer
export default class AllyClub extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  @observable thumbImage = '';

  @action gotoClub = async event => {
    event.preventDefault();

    const { info } = this.props;

    localStorage.setItem('clubCode', info.code);
    location.reload();
  };

  render() {
    const { fanclubStore } = this.props.store;

    const info = this.props.info;
    this.thumbImage = `${fanclubStore.IMAGE_SERVER_URL}/${info.thumb_image}`;

    return (
      <div className="item">
        <a href="#" onClick={this.gotoClub}>
          <img src={this.thumbImage} alt={info.title} />
        </a>
      </div>
    );
  }
}
