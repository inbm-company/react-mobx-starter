import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import Views from 'Routers';

@inject('store')
@observer
export default class ProfileLayer extends Component {
  static propTypes = {
    store: PropTypes.any,
    loadingFlag: PropTypes.any,
    top: PropTypes.any
  };

  @observable infoType = '';
  @observable fanclubList = [];
  @observable userInfo = null;
  @observable wrapperWidth = 0;
  @observable clubAdminFlag = false;

  @action closeLayer = event => {
    const { fanclubStore } = this.props.store;
    event.stopPropagation();
    fanclubStore.updateProfileLayerOpen(false);
  };

  @action gotoFanclub = async club => {
    console.group('클럽으로 이동');
    console.log(club);
    console.groupEnd();

    event.preventDefault();

    const self = this;
    const { store } = this.props;
    const { fanclubStore } = store;
    const { router } = store;
    const {
      router: { goTo, params }
    } = store;

    console.log(router.currentView.path);

    if (router.currentView.path != '/now') {
      const result = await fanclubStore.updateInstantCurrentFanclubInfo({
        code: club.code,
        alliances: true
      });
      if (result) {
        goTo(Views.clubHome, { from: 'landing' }, store);
        fanclubStore.updateProfileLayerOpen(false);
      }
    } else {
      localStorage.setItem('clubCode', club.code);
      location.reload();
    }
  };

  // 1:1 채팅하기
  @action createChat = () => {
    const { fanclubStore } = this.props.store;
    const userInfo = fanclubStore.USER_INFO;
    const friendInfo = fanclubStore.profileLayerInfo.info;

    if (window.android != undefined) {
      window.android.openChatRoom(friendInfo.userid);
    }
  };

  // 그룹방송하기
  @action createGroupLive = () => {
    const { fanclubStore } = this.props.store;
    const friendInfo = fanclubStore.profileLayerInfo.info;

    if (window.android != undefined) {
      window.android.createGroupLive(friendInfo.userid);
    }
  };

  async componentDidMount() {
    console.log('Profile Layer Mount');
    const { fanclubStore } = this.props.store;
    const info = fanclubStore.profileLayerInfo.info;
    const currentClub = fanclubStore.currentFanclubInfo;

    // 클럽 관리자인지 체크
    console.log('프로필 레이어 userInfo :', info);
    console.log('프로필 레이어 currentClub :', currentClub);
    if (info.userid === currentClub.administrator) {
      this.clubAdminFlag = true;
    }

    console.log('프로필레이어: 클럽 관리자인가? ', this.clubAdminFlag);

    const result = await fanclubStore.getMyInClubList({
      userid: fanclubStore.profileLayerInfo.info.userid
    });

    if (result.status === 200) {
      console.log(result.data);
      if (result.data.length) this.fanclubList = result.data;

      this.wrapperWidth = 70 * this.fanclubList.length;
    }
  }

  render() {
    const { fanclubStore } = this.props.store;
    const info = fanclubStore.profileLayerInfo.info;
    const type = fanclubStore.profileLayerInfo.type;
    const userInfo = fanclubStore.USER_INFO;
    const currentClub = fanclubStore.currentFanclubInfo;
    const admin = fanclubStore.currentFanclubInfo.administrator;

    let date = '';
    let waitingFlag = false;

    if (type === 'clubmember') {
      const thisClub = _.find(info.fanclubs, o => {
        return o.fc_code === currentClub.code;
      });

      if (thisClub && thisClub.fc_joining_date != undefined) {
        date = moment(thisClub.fc_joining_date).format('YYYY-MM-DD');
      } else {
        // 임시 가입일 처리
        date = moment(Date.now()).format('YYYY-MM-DD');
      }

      console.log('클럽 가입 날짜 : ', date);

      const waitingCheck = _.find(currentClub.waiting_members, o => {
        return info.userid === o;
      });

      if (waitingCheck && waitingCheck.length) waitingFlag = true;
    }

    return (
      <div className="module-profile-wrapper">
        <div className="bg-dimm" onClick={this.closeLayer}></div>
        <div className="module-profile ">
          <div className="module-profile-image">
            <span className="default-photo">{info.user_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${info.user_photo}`} alt="" />}</span>
          </div>
          <div className="profile-desc">
            <div className="profile-desc-information">
              <div className={'profile-name ' + (this.clubAdminFlag ? 'user-admin' : '')}>
                {info.user_nickname != '' && info.user_nickname}
                {info.user_nickname === '' && info.userid}
                {this.clubAdminFlag && <span className="u-admin">(지기)</span>}
              </div>
              {type === 'friendlist' && (
                <div className="profile-number-wrapper">
                  {info.phone_number && <div className="profile-number">{info.phone_number}</div>}
                  {/* <button type="button" className="profile-number-button"></button> */}
                </div>
              )}

              {type === 'clubmember' && !waitingFlag && <div className="profile-register-day">{date} 가입</div>}

              {type === 'clubmember' && waitingFlag && (
                <div className="profile-register-day">
                  {date} 가입 신청 &middot;
                  <span className="waiting">승인 대기중</span>
                </div>
              )}

              {info.status_msg && <div className="profile-comment">{info.status_msg}</div>}
              <PerfectScrollbar className="scroll-horizontal-container" style={{ width: '100%' }}>
                <div className="profile-fan-wrapper" style={{ width: this.wrapperWidth + 'px' }}>
                  {this.fanclubList.map((club, index) => (
                    <button className="profile-fan" key={index} onClick={() => this.gotoFanclub(club)}>
                      <img src={`${fanclubStore.IMAGE_SERVER_URL}/${club.thumb_image.path}`} />
                      <div className="profile-fan-name">{club.title}</div>
                    </button>
                  ))}
                </div>
              </PerfectScrollbar>
            </div>
            <div className="profile-btn-wrapper">
              <button type="button" className="profile-btn" onClick={this.createChat}>
                <div className="profile-btn-image profile-btn-chat"></div>
                <div className="profile-btn-text">대화하기</div>
              </button>
              <button type="button" className="profile-btn">
                <div className="profile-btn-image profile-btn-live" onClick={this.createGroupLive}></div>
                <div className="profile-btn-text">그룹 방송</div>
              </button>
              {type === 'clubmember' && userInfo.userid === admin && (
                <button type="button" className="profile-btn">
                  <div className="profile-btn-image profile-btn-bookmark"></div>
                  <div className="profile-btn-text">즐겨찾기</div>
                </button>
              )}

              {/* <button type="button" className="profile-btn">
                <div className="profile-btn-image profile-btn-block"></div>
                <div className="profile-btn-text">차단</div>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
