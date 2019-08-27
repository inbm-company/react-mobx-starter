import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

@inject('store')
@observer
export default class FanclubNow extends Component {
  static propTypes = {
    store: PropTypes.any,
    member: PropTypes.any
  };

  @action sendPush = ({ title, message }) => {
    const { fanclubStore } = this.props.store;
    const userid = fanclubStore.USER_INFO.userid;
    const targetid = this.props.member.userid;

    console.log('보내는 사람 : ', userid);
    console.log('받는 사람 : ', targetid);
    console.log('title : ', title);
    console.log('message : ', message);

    return fanclubStore.pushNotify({
      userid: userid,
      targetid: targetid,
      title: title,
      message: message,
      params: {
        club_code: fanclubStore.currentFanclubInfo.code
      }
    });
  };

  @action rejectApply = async () => {
    const self = this;
    const { fanclubStore } = this.props.store;
    const member = this.props.member;
    const clubInfo = fanclubStore.currentFanclubInfo;

    const result = await fanclubStore.acceptFanclub({
      code: clubInfo.code,
      userid: member.userid,
      action: 'reject'
    });

    if (result.status === 200) {
      const pushNoti = this.sendPush({
        title: '클럽 가입 신청',
        message: `${clubInfo.title} 클럽 가입 신청이 거절되었습니다.`
      });

      fanclubStore.updateMsgWindow({
        message: `가입이 거절되었습니다.`,
        buttons: [
          {
            text: '확인',
            classText: 'confirm',
            callback() {
              fanclubStore.updateMsgWindowOpen('false');
              fanclubStore.updateClubApplyStatusChange(true);
            }
          }
        ]
      });
      fanclubStore.updateMsgWindowOpen('true');
    } else {
      fanclubStore.updateMsgWindow({
        message: fanclubStore.CONNECT_ERROR_MSG,
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

  @action acceptApply = async () => {
    const self = this;
    const { fanclubStore } = this.props.store;
    const member = this.props.member;
    const clubInfo = fanclubStore.currentFanclubInfo;

    const result = await fanclubStore.acceptFanclub({
      code: clubInfo.code,
      userid: member.userid,
      action: 'accept'
    });

    if (result.status === 200) {
      const pushNoti = this.sendPush({
        title: '클럽 가입 신청',
        message: `${clubInfo.title} 클럽 가입이 승인되었습니다.`
      });

      fanclubStore.updateMsgWindow({
        message: `가입이 승인되었습니다.`,
        buttons: [
          {
            text: '확인',
            classText: 'confirm',
            callback() {
              fanclubStore.updateMsgWindowOpen('false');
              fanclubStore.updateClubApplyStatusChange(true);
            }
          }
        ]
      });
      fanclubStore.updateMsgWindowOpen('true');
    } else {
      fanclubStore.updateMsgWindow({
        message: fanclubStore.CONNECT_ERROR_MSG,
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

  @action doApply = async action => {
    const self = this;
    const { fanclubStore } = this.props.store;

    let msg = '';
    if (action === 'reject') msg = '해당 팬의 승인 요청을 거절하시겠습니까?';
    else if (action === 'accept') msg = '해당 팬의 가입을 승인하시겠습니까?';

    fanclubStore.updateMsgWindow({
      message: msg,
      buttons: [
        {
          text: '취소',
          classText: 'cancel',
          callback() {
            fanclubStore.updateMsgWindowOpen('false');
          }
        },
        {
          text: '확인',
          classText: 'confirm',
          callback() {
            fanclubStore.updateMsgWindowOpen('false');
            if (action === 'reject') self.rejectApply();
            else if (action === 'accept') self.acceptApply();
          }
        }
      ]
    });
    fanclubStore.updateMsgWindowOpen('true');
  };

  render() {
    const { fanclubStore } = this.props.store;
    const member = this.props.member;
    const clubCode = fanclubStore.currentFanclubInfo.code;

    const club = _.find(member.waiting_fanclubs, o => {
      return o.club_code === clubCode;
    });

    let date = '';

    if (club && club.length) {
      date = moment(club.created_date).format('YYYY-MM-DD');
    }

    console.log('member : ', member);

    return (
      <div className="fanclub-member-list">
        <div className="fanclub-member-list-inforamtion">
          <span className="default-photo">{member.user_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${member.user_photo}`} alt="" />}</span>
          <span className="fanclub-member-list-status">
            <span className="fanclub-member-list-name-wrapper">
              <span className="fanclub-member-list-name">
                {member.user_nickname != '' && member.user_nickname}
                {member.user_nickname === '' && member.userid}
              </span>
              <i className="fanclub-member-list-name-ico "></i>
            </span>
            <span className="fanclub-member-list-comment fanclub-member-list-comment-alter">{date} 신청</span>
          </span>
        </div>
        <div className="fanclub-member-list-button-wrapper">
          <button className="fanclub-member-list-button fanclub-member-list-refuse" onClick={() => this.doApply('reject')}>
            거절
          </button>
          <button className=" fanclub-member-list-button fanclub-member-list-accept" onClick={() => this.doApply('accept')}>
            수락
          </button>
        </div>
      </div>
    );
  }
}
