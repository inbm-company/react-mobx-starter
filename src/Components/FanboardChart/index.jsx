import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import _ from 'lodash';

@inject('store')
@observer
export default class FanboardChart extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;

    return (
      <div className="fanclub-main-container">
        <ViewPageHedaer title={'팬보드 차트'} searchFlag={true} settingFlag={false} />
        <img src={process.env.PUBLIC_URL + './images/@img-fanboardchart.png'} alt="" style={{ width: '100%' }} />
      </div>
    );
  }
}
