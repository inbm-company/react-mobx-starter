import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import Views from 'Routers';
import Loader from 'Components/Common/Loader';
import MemberInfo from 'Components/FanclubManagement/ManageMember/MemberItem';

@inject('store')
@observer
export default class FanclubNow extends Component {
  static propTypes = {
    store: PropTypes.any,
    openApplyLayer: PropTypes.any,
    setApplyMember: PropTypes.any,
    reloadFlag: PropTypes.any
  };

  @observable applyMemberList = [];
  @observable memberList = [];
  @observable adminList = [];

  @action openApplyLayer = () => {
    this.props.openApplyLayer();
  };

  @action getUserInfo = async query => {
    const { fanclubStore } = this.props.store;
    const result = await fanclubStore.getUserInfo({
      userids: query
    });

    if (result.status === 200) return result.data;
    return false;
  };

  @action getApplyMemberList = async () => {
    const { params } = this.props.store.router;
    const { fanclubStore } = this.props.store;

    const getUsers = fanclubStore.currentFanclubInfo.waiting_members;

    console.log('클럽 정보 : ', fanclubStore.currentFanclubInfo);

    let query = '';

    for (let i in getUsers) {
      const user = getUsers[i];

      if (i > 0) query += `,${user.userid}`;
      else query += user.userid;
    }

    const result = await this.getUserInfo(query);

    if (result) this.applyMemberList = result;
    this.loadingFlag = false;

    console.group('지원 멤버 : ');
    console.log(this.applyMemberList);
    console.groupEnd();

    this.props.setApplyMember(this.applyMemberList);
  };

  @action getMemberList = async () => {
    const { params } = this.props.store.router;
    const { fanclubStore } = this.props.store;

    const getUsers = fanclubStore.currentFanclubInfo.members;

    let query = '';

    for (let i in getUsers) {
      const user = getUsers[i];

      if (i > 0) query += `,${user}`;
      else query += user;
    }

    const result = await this.getUserInfo(query);

    if (result) this.memberList = result;
    this.loadingFlag = false;
  };

  componentDidMount() {
    this.getMemberList();
    this.getApplyMemberList();
  }

  async componentWillReceiveProps(nextProps) {
    const { fanclubStore } = this.props.store;

    if (nextProps.reloadFlag != undefined) {
      if (nextProps.reloadFlag === true) {
        fanclubStore.updateClubApplyStatusChange(false);
        const result = await fanclubStore.updateInstantCurrentFanclubInfo({
          code: fanclubStore.currentFanclubInfo.code,
          alliances: true
        });

        if (result) {
          this.getMemberList();
          this.getApplyMemberList();
        }
      }
    }
  }

  render() {
    const { fanclubStore } = this.props.store;

    return (
      <div className="fanclub-member-container">
        <Loader loadingFlag={this.loadingFlag} />
        <div className="fanclub-member-container-wrapper top">
          <div className="fanclub-member-header">
            <h2 className="fanclub-member-header-wrapper">
              <span className="fanclub-member-title">승인 요청</span>
              <span className="fanclub-member-number-background">
                <span className="fanclub-member-number">{this.applyMemberList.length}</span>
              </span>
            </h2>
            {this.applyMemberList.length > 0 && (
              <button className="fanclub-member-header-button" onClick={this.openApplyLayer}>
                전체보기
              </button>
            )}
          </div>

          <div className="fanclub-member-wrapper">
            {this.applyMemberList.map((item, index) => (
              <div key={index} className="fanclub-member">
                <span className="default-photo">{item.user_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${item.user_photo}`} alt="" />}</span>
                <span className="fanclub-member-name">
                  {item.user_nickname != '' && item.user_nickname}
                  {item.user_nickname === '' && item.userid}
                </span>
              </div>
            ))}
            {this.applyMemberList.length > 4 && <div className="fanclub-member-member-etc">+{this.applyMemberList.length - 4}</div>}
          </div>
          {this.applyMemberList.length === 0 && <div className="no-data type1">가입 신청한 팬이 없습니다.</div>}
        </div>

        <div className="fanclub-member-container-wrapper">
          <div className="fanclub-member-header">
            <h2 className="fanclub-member-header-wrapper">
              <span className="fanclub-member-title">관리자</span>
              <span className="fanclub-member-text">({this.adminList.length})</span>
            </h2>
            <button className="fanclub-member-header-button-icon"></button>
          </div>
          <div className="fanclub-member-content">
            {this.adminList.length > 0 && (
              <div className="fanclub-member-list-wrapper">
                {this.adminList.map((fan, index) => (
                  <MemberInfo key={index} info={fan} />
                ))}
              </div>
            )}
            {this.adminList.length === 0 && <p className="no-data type2">관리자가 지정되지 않았습니다.</p>}
          </div>
        </div>

        <div className="fanclub-member-container-wrapper">
          <div className="fanclub-member-header">
            <h2 className="fanclub-member-header-wrapper">
              <span className="fanclub-member-title">팬 목록</span>
              <span className="fanclub-member-text">({this.memberList.length})</span>
            </h2>
            <button className="fanclub-member-header-button-icon"></button>
          </div>
          <div className="fanclub-member-content">
            {this.memberList.length > 0 && (
              <div className="fanclub-member-list-wrapper">
                {this.memberList.map((fan, index) => (
                  <MemberInfo key={index} info={fan} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
