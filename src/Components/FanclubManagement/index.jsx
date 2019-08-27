import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import Views from 'Routers';
import ManageHeader from 'Components/FanclubManagement/ManageHeader';
import ManageMember from 'Components/FanclubManagement/ManageMember';
import ManageShop from 'Components/FanclubManagement/ManageShop';
import ManageAlly from 'Components/FanclubManagement/ManageAlly';
import ApplyLayer from 'Components/FanclubManagement/ManageMember/ApplyLayer';
import ManageCalendar from 'Components/FanclubManagement/ManageCalendar';

@inject('store')
@observer
export default class FanclubManagement extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @observable currentMenu = 'member';
  @observable applyLayerOpenFlag = false;
  @observable applyMemberList = [];

  @action changeMenu = menu => {
    this.currentMenu = menu;
  };

  @action openApplyLayer = () => {
    this.applyLayerOpenFlag = true;
  };

  @action closeApplyLayer = () => {
    this.applyLayerOpenFlag = false;
  };

  @action setApplyMember = members => {
    this.applyMemberList = members;
  };

  componentDidMount() {
    // 팬 목록, 승인 요청 목록 불러옴
  }

  render() {
    const { fanclubStore } = this.props.store;

    return (
      <div className="fanclub-main-container">
        <div style={{ display: this.applyLayerOpenFlag ? 'none' : 'block' }}>
          <ViewPageHedaer title={'관리자'} searchFlag={true} settingFlag={false} />
          <div className="fanclub-manage-container">
            <ManageHeader changeCurrentMenu={this.changeMenu} />
            {this.currentMenu === 'member' && <ManageMember openApplyLayer={this.openApplyLayer} setApplyMember={this.setApplyMember} reloadFlag={fanclubStore.clubApplyStatusChange} />}
            {this.currentMenu === 'calendar' && <ManageCalendar />}
            {this.currentMenu === 'shop' && <ManageShop />}
            {this.currentMenu === 'ally' && <ManageAlly />}
          </div>
        </div>
        <div style={{ display: this.applyLayerOpenFlag ? 'block' : 'none' }}>
          <ApplyLayer members={this.applyMemberList} closeApplyLayer={this.closeApplyLayer} reload={this.reload} />
        </div>
      </div>
    );
  }
}
