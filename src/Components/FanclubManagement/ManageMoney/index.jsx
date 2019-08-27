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
      <div className="fanclub-manage-container">
        <ViewPageHedaer title={'관리자'} searchFlag={true} settingFlag={false} />
      </div>
    );
  }
}
