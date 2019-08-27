import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

@observer
export default class ArtistLiveItem extends Component {
  static propTypes = {
    info: PropTypes.any
  };
  render() {
    const info = this.props.info;

    return (
      <div className="item">
        <a href="#">
          <p className="img">
            <img src={process.env.PUBLIC_URL + info.imgSrc} alt="" />
          </p>
          <p className="tit">{info.name}</p>
          <p className="s-info">
            <span className="users">{info.users}</span>
            <span className="created-time">{info.createdTime}</span>
          </p>
        </a>
      </div>
    );
  }
}
