import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import Functions from 'Functions/Common.js';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import FanclubNavigation from 'Components/Common/FanclubNavigation';
import FanclubInfo from 'Components/Common/FanclubInfo';
import PerfectScrollbar from 'react-perfect-scrollbar';

@inject('store')
@observer
export default class FanclubNow extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const {
      router: { goTo, params }
    } = store;

    this.clubInfo = fanclubStore.currentFanclubInfo;
    this.mainImage = `${fanclubStore.IMAGE_SERVER_URL}/${this.clubInfo.main_image}`;

    return (
      <div className="fanclub-main-container bottom-padding">
        <div className="fc-main-img">
          <img src={this.mainImage} alt={this.clubInfo.title} />
        </div>
        <div className="fc-main-content">
          <ViewPageHedaer title={''} searchFlag={true} settingFlag={true} />
          <div className="fc-header">
            <h2 className="fc-o-tit">{this.clubInfo.title}</h2>
            <FanclubInfo info={this.clubInfo} />
            <FanclubNavigation route={'shop'} />
          </div>
          <div className="fanshop-container">
            <div>
              <img src={process.env.PUBLIC_URL + './images/@img-shop1.png'} style={{ width: '100%' }} alt="" />
            </div>
            <div className="goods-ad">
              <a href="http://ticket.interpark.com/Ticket/Goods/GoodsInfo.asp?GoodsCode=19011533" target="_blank" rel="noopener noreferrer">
                <img src={process.env.PUBLIC_URL + './images/@img-shopbanner.png'} style={{ width: '100%' }} alt="" />
              </a>
            </div>
            <div>
              <img src={process.env.PUBLIC_URL + './images/@img-shop2.png'} style={{ width: '100%' }} alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
