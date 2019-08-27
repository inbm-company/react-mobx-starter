import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import Functions from 'Functions/Common.js';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import _ from 'lodash';

@inject('store')
@observer
export default class FriendList extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @observable loadingFlag = false;
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
    const favArray = fanclubStore.USER_INFO.fav_friends;
    const dayLimit = parseInt(
      moment()
        .subtract(2, 'day')
        .format('YYYYMMDD')
    );
    const today = parseInt(moment().format('YYYYMMDD'));
    console.log('유저 정보');
    console.log(fanclubStore.USER_INFO);

    console.log('어제 : ', dayLimit);

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
        console.log(o);
        return o === item.userid;
      });
      if (favs && favs.length) this.favoriteFriendList.push(item);
    });
  };

  @action getFriendList = async () => {
    const { params } = this.props.store.router;
    const { fanclubStore } = this.props.store;

    const myId = fanclubStore.USER_INFO.userid;

    let getUsers = [];

    if (window.android != undefined) {
      getUsers = await JSON.parse(window.android.getUsers());
    } else {
      getUsers = [{ userId: 'simjaeho123' }, { userId: 'firsttest' }];
    }

    let query = '';

    for (let i in getUsers) {
      const item = getUsers[i];
      if (item.userId != myId) {
        if (i > 0) query += `,${item.userId}`;
        else query += item.userId;
      }
    }

    const results = await fanclubStore.getUserInfo({
      userids: query
    });

    if (results.status === 200) {
      this.friendList = results.data;
      this.setList();
      this.loadingFlag = false;
    }
  };

  @action openProfile = (event, user) => {
    event.preventDefault();

    const { fanclubStore } = this.props.store;

    fanclubStore.updateProfileLayerInfo({
      type: 'friendlist',
      info: user
    });
    fanclubStore.updateProfileLayerOpen(true);
  };

  @action openFunction = () => {
    this.openFunctionFlag = !this.openFunctionFlag;
  };

  @action addFriendDirectly = () => {};

  @action syncPhoneNumbers = () => {
    if (window.android != undefined) window.android.addFriendsFromPhonebook();
    this.loadingFlag = true;
    this.openFunctionFlag = false;
    setTimeout(() => {
      location.reload();
    }, 2000);
  };

  async componentWillMount() {
    this.getFriendList();
  }

  componentDidMount() {}

  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const {
      router: { goTo, params }
    } = store;

    return (
      <div className="fanclub-main-container">
        <Loader loadingFlag={this.loadingFlag} />
        <div className="fc-main-content">
          <div className="fanclub-create-container">
            <header className="view-page-header">
              <div className="view-page-wrapper">
                <h1 className="view-page-text">
                  친구 <span className="count">{this.friendList.length}명</span>
                </h1>
              </div>
              <div className="view-page-content">
                <button className="view-page-icon search-button"></button>
                <button className="view-page-icon more-button"></button>
              </div>
            </header>
          </div>

          <section className="friend-list-container top">
            <div className="section-tit">
              <h2 className="st">새로 가입한 친구</h2>
            </div>
            <div className="list-type1">
              {this.newFriendList.map((friend, index) => (
                <div className="item" key={index}>
                  <a href="#" onClick={() => this.openProfile(event, friend)}>
                    <p className="img">
                      <span className="default-photo">{friend.user_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${friend.user_photo}`} alt="" />}</span>
                    </p>
                    <p className="txt">
                      {friend.user_nickname != '' && <strong className="user-name">{friend.user_nickname}</strong>}
                      {friend.user_nickname === '' && <strong className="user-name">{friend.userid}</strong>}
                    </p>
                  </a>
                </div>
              ))}
              {!this.newFriendList.length && <div className="no-data type1">새로 가입한 친구가 없습니다.</div>}
            </div>
          </section>

          <section className="friend-list-container">
            <div className="section-tit">
              <h2 className="st">오늘 생일</h2>
            </div>
            <div className="list-type1 ">
              {this.birthFriendList.map((friend, index) => (
                <div className="item" key={index}>
                  <a href="#" onClick={() => this.openProfile(event, friend)}>
                    <p className="img small-type">
                      <span className="default-photo">{friend.user_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${friend.user_photo}`} alt="" />}</span>
                    </p>
                    <p className="txt">
                      {friend.user_nickname != '' && <strong className="user-name">{friend.user_nickname}</strong>}
                      {friend.user_nickname === '' && <strong className="user-name">{friend.userid}</strong>}
                    </p>
                  </a>
                </div>
              ))}
              {!this.birthFriendList.length && <div className="no-data type1">오늘 생일인 친구가 없습니다.</div>}
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
                      <span className="user-name-wrapper">
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
              {!this.favoriteFriendList.length && <div className="no-data type1">즐겨찾기한 친구가 없습니다.</div>}
            </div>
          </section>

          <section className="friend-list-container top-fix">
            <div className="section-tit">
              <h2 className="st">전체 친구({this.friendList.length})</h2>
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
                      <span className="user-name-wrapper">
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
              {!this.friendList.length && <div className="no-data type1">친구가 없습니다.</div>}
            </div>
          </section>

          {this.openFunctionFlag && <div className="add-dimm-layer" onClick={this.openFunction}></div>}
          <div className="fixed-add-layer">
            {this.openFunctionFlag && (
              <div>
                <p className="line">
                  <button type="button" className="util direct" onClick={this.addFriendDirectly}>
                    <span className="t">직접입력</span>
                  </button>
                </p>
                <p className="line">
                  <button type="button" className="util sync" onClick={this.syncPhoneNumbers}>
                    <span className="t">전화번호부 동기화</span>
                  </button>
                </p>
              </div>
            )}

            <button className={'fixed-add-button ' + (this.openFunctionFlag && 'active')} onClick={this.openFunction}>
              <span className="t">친구추가</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
