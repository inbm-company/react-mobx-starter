import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import Views from 'Routers';

@inject('store')
@observer
export default class FanclubNow extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  render() {
    return (
      <div className="fanclub-manage-container" style={{ padding: '20px 0 0' }}>
        <img src={process.env.PUBLIC_URL + './images/@img-showmanage.png'} alt="" style={{ width: '100%' }} />
      </div>
    );
  }
}
