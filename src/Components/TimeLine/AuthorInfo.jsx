import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import Functions from 'Functions/Common.js';
import Views from 'Routers';

@inject('store')
@observer
export default class PostInfo extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  @observable isAdminFlag = false;

  @action openProfile = async () => {
    const { fanclubStore } = this.props.store;
    const info = this.props.info;

    const userInfo = await fanclubStore.getUserInfo({
      userid: info.author
    });

    if (userInfo.status === 200) {
      fanclubStore.updateProfileLayerInfo({
        type: 'clubmember',
        info: userInfo.data
      });
      fanclubStore.updateProfileLayerOpen(true);
    } else {
      fanclubStore.updateMsgWindow({
        message: `유저 정보를 불러오지 못했습니다. 다시 시도하시거나 새로고침해주세요.`,
        buttons: [
          {
            text: '확인',
            classText: 'confirm',
            callback() {
              fanclubStore.updateMsgWindowOpen('false');
            }
          }
        ]
      });
      fanclubStore.updateMsgWindowOpen('true');
    }
  };

  componentWillMount() {
    const { fanclubStore } = this.props.store;
    const clubInfo = fanclubStore.currentFanclubInfo;
    const info = this.props.info;

    if (clubInfo.administrator === info.author) {
      this.isAdminFlag = true;
    }
  }

  render() {
    const { fanclubStore } = this.props.store;
    const info = this.props.info;
    const date = Functions.getFormattedDate(info.created_date);

    return (
      <div className="user-profile">
        <div className="user-photo" onClick={this.openProfile}>
          <span className="img">{info.author_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${info.author_photo}`} alt="" />}</span>
          <p className={'user-name ' + (this.isAdminFlag ? 'user-admin' : '')}>
            {info.author_nickname}
            {this.isAdminFlag && <span className="admin-flag">(지기)</span>}
          </p>
        </div>
        <p className="created-time">{date}</p>
      </div>
    );
  }
}
