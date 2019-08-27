import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import Functions from 'Functions/Common.js';
import Loader from 'Components/Common/Loader';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import FanclubNavigation from 'Components/Common/FanclubNavigation';
import FanclubInfo from 'Components/Common/FanclubInfo';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import _ from 'lodash';

@inject('store')
@observer
export default class FriendList extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @observable loadingFlag = true;
  @observable openFunctionFlag = false;

  @observable friendList = [];
  @observable newFriendList = [];
  @observable birthFriendList = [];
  @observable favoriteFriendList = [];

  @observable favoriteListFold = false;
  @observable allListFold = false;

  @action foldList = type => {
    switch (type) {
      case 'favorite':
        this.favoriteListFold = !this.favoriteListFold;
        break;
      case 'all':
        this.allListFold = !this.allListFold;
        break;
    }
  };

  // 새로 가입, 오늘 생일, 즐겨찾기 설정
  @action setList = async () => {
    const { fanclubStore } = this.props.store;
    const favArray = fanclubStore.currentFanclubInfo.fav_members || [];
    const dayLimit = parseInt(
      moment()
        .subtract(2, 'day')
        .format('YYYYMMDD')
    );
    const today = parseInt(moment().format('YYYYMMDD'));

    console.log('즐겨찾기 멤버 :', fanclubStore.currentFanclubInfo.fav_members);

    await this.friendList.map(item => {
      // 2일 전부터 가입한 친구를 새친구로 설정
      const createdDate = parseInt(moment(item.created_date).format('YYYYMMDD'));
      if (createdDate > dayLimit) this.newFriendList.push(item);

      // 생일 맞은 친구
      console.log('생일 : ');
      const birthDay = parseInt(item.birth_day);
      if (birthDay === today) this.birthFriendList.push(item);

      // 즐겨찾기 친구
      const favs = _.filter(favArray, o => {
        return o === item.userid;
      });
      if (favs && favs.length) this.favoriteFriendList.push(item);

      console.log('즐겨찾기 친구 목록 : ', this.favoriteFriendList);
    });
  };

  @action getMemberList = async () => {
    const { params } = this.props.store.router;
    const { fanclubStore } = this.props.store;

    const getUsers = fanclubStore.currentFanclubInfo.members;

    console.group('GetUsers');
    console.log(getUsers);
    console.groupEnd();

    let query = '';

    for (let i in getUsers) {
      const user = getUsers[i];

      if (i > 0) query += `,${user}`;
      else query += user;
    }

    const results = await fanclubStore.getUserInfo({
      userids: query
    });

    if (results.status === 200) {
      this.friendList = await this.resignFriendList(results.data);
      this.setList();
      this.loadingFlag = false;
    }
  };

  @action resignFriendList = list => {
    const { fanclubStore } = this.props.store;
    const clubInfo = fanclubStore.currentFanclubInfo;

    let newList = _.cloneDeep(list);
    let adminUser = _.find(newList, o => {
      return o.userid === clubInfo.administrator;
    });

    _.remove(newList, o => {
      return o.userid === clubInfo.administrator;
    });

    newList.unshift(adminUser);

    console.log('관리자 회원');
    console.log(adminUser);
    console.groupEnd();

    return newList;
  };

  @action openProfile = (event, user) => {
    event.preventDefault();

    const { fanclubStore } = this.props.store;

    fanclubStore.updateProfileLayerInfo({
      type: 'clubmember',
      info: user
    });
    fanclubStore.updateProfileLayerOpen(true);
  };

  @action openFunction = () => {
    this.openFunctionFlag = !this.openFunctionFlag;
  };

  async componentWillMount() {
    this.getMemberList();
  }

  componentDidMount() {}

  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const {
      router: { goTo, params }
    } = store;

    this.clubInfo = fanclubStore.currentFanclubInfo;
    this.mainImage = `${fanclubStore.IMAGE_SERVER_URL}/${this.clubInfo.main_image}`;

    return (
      <div className="fanclub-main-container">
        <div className="fc-main-img">
          <img src={this.mainImage} alt={this.clubInfo.title} />
        </div>
        <div className="fc-main-content">
          <ViewPageHedaer title={''} searchFlag={true} settingFlag={true} />
          <div className="fc-header">
            <h2 className="fc-o-tit">{this.clubInfo.title}</h2>
            <FanclubInfo info={this.clubInfo} />
            <FanclubNavigation route={'member'} />
          </div>

          <div className="fc-wrapper bottom-padding">
            <Loader loadingFlag={this.loadingFlag} />
            <section className="friend-list-container">
              <div className="section-tit">
                <h2 className="st">신규 팬</h2>
              </div>
              <div className="list-type1">
                {this.newFriendList.map((friend, index) => (
                  <div className="item" key={index}>
                    <a href="#" onClick={() => this.openProfile(event, friend)}>
                      <p className="img">
                        <span className="default-photo">{friend.user_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${friend.user_photo}`} alt="" />}</span>
                      </p>
                      <p className={'txt ' + (this.clubInfo.administrator === friend.userid ? 'user-admin' : '')}>
                        {friend.user_nickname != '' && <strong className="user-name">{friend.user_nickname}</strong>}
                        {friend.user_nickname === '' && <strong className="user-name">{friend.userid}</strong>}
                      </p>
                    </a>
                  </div>
                ))}
                {!this.newFriendList.length && <div className="no-data type1">새로 가입한 팬이 없습니다.</div>}
              </div>
            </section>

            <section className="friend-list-container">
              <div className="section-tit">
                <h2 className="st">오늘 생일인 팬</h2>
              </div>
              <div className="list-type1 ">
                {this.birthFriendList.map((friend, index) => (
                  <div className="item" key={index}>
                    <a href="#" onClick={() => this.openProfile(event, friend)}>
                      <p className="img small-type">
                        <span className="default-photo">{friend.user_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${friend.user_photo}`} alt="" />}</span>
                      </p>
                      <p className={'txt ' + (this.clubInfo.administrator === friend.userid ? 'user-admin' : '')}>
                        {friend.user_nickname != '' && <strong className="user-name">{friend.user_nickname}</strong>}
                        {friend.user_nickname === '' && <strong className="user-name">{friend.userid}</strong>}
                      </p>
                    </a>
                  </div>
                ))}
                {!this.birthFriendList.length && <div className="no-data type1">오늘 생일인 팬이 없습니다.</div>}
              </div>
            </section>

            <section className="friend-list-container">
              <div className="section-tit">
                <h2 className="st">즐겨찾기</h2>
                <button type="button" className={'fold-trigger ' + (this.favoriteListFold ? 'ico-fold' : '')} onClick={() => this.foldList('favorite')}></button>
              </div>
              <div className="list-type5 mt-20" style={{ display: this.favoriteListFold ? 'none' : 'block' }}>
                {this.favoriteFriendList.map((friend, index) => (
                  <div className="item" key={index}>
                    <a href="#" onClick={() => this.openProfile(event, friend)}>
                      <p className="img small-type">
                        <span className="default-photo">{friend.user_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${friend.user_photo}`} alt="" />}</span>
                      </p>
                      <p className="infos">
                        <span className={'user-name-wrapper ' + (this.clubInfo.administrator === friend.userid ? 'user-admin' : '')}>
                          {friend.user_nickname != '' && <strong className="user-name">{friend.user_nickname}</strong>}
                          {friend.user_nickname === '' && <strong className="user-name">{friend.userid}</strong>}
                          {/* <i className="user-name-ico"></i>
                        <i className="user-name-ico"> </i> */}
                        </span>
                        {friend.status_msg && <span className="user-msg">{friend.status_msg}</span>}
                      </p>
                    </a>
                  </div>
                ))}
                {!this.favoriteFriendList.length && <div className="no-data type1">즐겨찾기된 팬이 없습니다.</div>}
              </div>
            </section>

            <section className="friend-list-container top-fix">
              <div className="section-tit">
                <h2 className="st">팬 목록 ({this.friendList.length})</h2>
                <button type="button" className={'fold-trigger ' + (this.allListFold ? 'ico-fold' : '')} onClick={() => this.foldList('all')}>
                  Fold / Unfold
                </button>
              </div>
              <div className="list-type5 mt-20" style={{ display: this.allListFold ? 'none' : 'block' }}>
                {this.friendList.map((friend, index) => (
                  <div className="item" key={index}>
                    <a href="#" onClick={() => this.openProfile(event, friend)}>
                      <p className="img">
                        <span className="default-photo">{friend.user_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${friend.user_photo}`} alt="" />}</span>
                      </p>
                      <p className="infos">
                        <span className={'user-name-wrapper ' + (this.clubInfo.administrator === friend.userid ? 'user-admin' : '')}>
                          {friend.user_nickname != '' && <strong className="user-name">{friend.user_nickname}</strong>}
                          {friend.user_nickname === '' && <strong className="user-name">{friend.userid}</strong>}
                          {this.clubInfo.administrator === friend.userid && <span className="u-admin">(지기)</span>}
                          {/* <i className="user-name-ico"></i>
                        <i className="user-name-ico"> </i> */}
                        </span>
                        {friend.status_msg && <span className="user-msg">{friend.status_msg}</span>}
                      </p>
                    </a>
                  </div>
                ))}
                {!this.friendList.length && <div className="no-data type1">멤버가 없습니다.</div>}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
