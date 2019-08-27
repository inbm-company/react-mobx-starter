import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

@inject('store')
@observer
export default class FanClubInfo extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  @observable showRegisterFlag = false;
  @observable waitingMember = null;
  @observable nickName = '';

  // 클럽 가입할 것인지 확인
  @action applyFanclub = async () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    fanclubStore.updateMsgWindow({
      message: '팬클럽 가입 신청을 하시겠습니까?',
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
            self.execApply();
          }
        }
      ]
    });
    fanclubStore.updateMsgWindowOpen('true');
  };

  // 클럽 가입 신청
  @action execApply = async () => {
    const self = this;
    const { fanclubStore } = this.props.store;
    const clubInfo = fanclubStore.currentFanclubInfo;
    const userInfo = fanclubStore.USER_INFO;
    const result = await fanclubStore.applyFanclub({
      code: clubInfo.code,
      userid: userInfo.userid
    });

    console.log('상태 ', result);

    if (result.status === 200) {
      if (result.data.error != undefined) {
        fanclubStore.updateMsgWindow({
          message: result.data.error,
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
      } else {
        fanclubStore.updateMsgWindow({
          message: `정상적으로 가입 신청되었습니다.`,
          buttons: [
            {
              text: '확인',
              classText: 'confirm',
              callback() {
                location.reload();
                fanclubStore.updateMsgWindowOpen('false');
              }
            }
          ]
        });
        fanclubStore.updateMsgWindowOpen('true');
      }
    } else if (result.status === 400) {
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

  @action checkMember = async () => {
    const { fanclubStore } = this.props.store;
    const info = this.props.info;
    const userInfo = fanclubStore.USER_INFO;
    const clubInfo = fanclubStore.currentFanclubInfo;
    const members = info.members;

    console.log('클럽 멤버 : ', members);
    console.log('내 아이디 : ', userInfo.userid);
    console.log('클럽 정보 : ', info);

    // 현재 접속자가 클럽 멤버인지 확인
    const member = _.find(members, o => {
      return o === userInfo.userid;
    });

    const waitingMember = _.find(info.waiting_members, o => {
      return o.userid === userInfo.userid;
    });

    console.log('클럽 멤버와 겹치는 것 : ', member);
    console.log('대기 멤버에 있는가? ', waitingMember);

    if (waitingMember) {
      this.waitingMember = waitingMember.userid;
    } else if (member) {
      if (member.length) this.showRegisterFlag = false;
    } else {
      this.showRegisterFlag = true;
    }

    // 클럽 관리자 정보 가져와서 닉네임 얻기
    const adminUser = await fanclubStore.getUserInfo({ userid: clubInfo.administrator });
    console.log('팬클럽지기 정보: ', adminUser);
    this.nickName = adminUser.data.user_nickname;
  };

  componentDidMount() {
    this.checkMember();
  }

  render() {
    const { fanclubStore } = this.props.store;
    const info = this.props.info;
    const clubInfo = fanclubStore.currentFanclubInfo;
    const userInfo = fanclubStore.USER_INFO;

    return (
      <div className="fc-o-infos">
        <p className="fans">
          <span className="dt">팬</span>
          <span className="dd">{info.members.length}</span>
        </p>
        <p className="ally-clubs">
          <span className="dt">제휴한 클럽</span>
          <span className="dd">{info.alliances.length}</span>
        </p>
        <p className="created-date">
          <span className="dt">개설일</span>
          <span className="dd">
            <Moment format="YYYY-MM-DD">{info.created_date}</Moment>
          </span>
        </p>
        <p className="fc-master">
          <span className="dt">팬클럽지기</span>
          <span className="dd">{this.nickName}</span>
        </p>
        {this.showRegisterFlag && (
          <button type="button" className="btn-join-club" onClick={this.applyFanclub}>
            가입신청
          </button>
        )}
        {this.waitingMember && this.waitingMember.length && <div className="apply-completed">가입 대기 중</div>}
      </div>
    );
  }
}
