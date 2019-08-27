import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import Views from 'Routers';
import _ from 'lodash';

@inject('store')
@observer
export default class PostInfo extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any,
    loadingFlag: PropTypes.any
  };

  @observable layerFlag = false;
  @observable myPostFlag = false;
  @observable unlikeFlag = false;
  @observable likeFlag = true;
  @observable unlike_members = [];
  @observable like_members = [];
  @observable clubMemberFlag = false;
  @observable adminFlag = false;

  @action showLayer = () => {
    const { fanclubStore } = this.props.store;
    const userInfo = fanclubStore.USER_INFO;
    const clubInfo = fanclubStore.currentFanclubInfo;

    const clubMember = _.find(clubInfo.members, o => {
      return userInfo.userid === o;
    });

    if (clubMember && clubMember.length) this.layerFlag = true;
  };

  @action hideLayer = () => {
    this.layerFlag = false;
  };

  // 글 삭제 확인
  @action deletePost = async () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    fanclubStore.updateMsgWindow({
      message: `이 글을 삭제하시겠습니까?`,
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
            fanclubStore.updateLoadingBgOpen(true);

            self.execDelete();
          }
        }
      ]
    });
    fanclubStore.updateMsgWindowOpen('true');
  };

  // 글 삭제 실행
  @action execDelete = async () => {
    const info = this.props.info;
    const { fanclubStore } = this.props.store;

    const code = fanclubStore.currentFanclubInfo.code;
    const _id = info._id;

    const result = await fanclubStore.deletePost({
      code: code,
      _id: _id
    });

    if (result.status === 200) {
      fanclubStore.updateLoadingBgOpen(false);
      fanclubStore.updateMsgWindow({
        message: `글이 정상적으로 삭제되었습니다.`,
        buttons: [
          {
            text: '확인',
            classText: 'confirm',
            callback() {
              fanclubStore.updateMsgWindowOpen('false');
              location.reload();
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

  // 글 수정 확인
  @action modifyPost = async () => {
    const self = this;
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const { goTo } = this.props.store.router;
    const info = this.props.info;

    fanclubStore.updateMsgWindow({
      message: `이 글을 수정하시겠습니까?`,
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
            goTo(Views.modify, { post: info }, store);
          }
        }
      ]
    });
    fanclubStore.updateMsgWindowOpen('true');
  };

  @action checkInterest = () => {
    const info = this.props.info;
    const { fanclubStore } = this.props.store;
    const userInfo = fanclubStore.USER_INFO;

    const likeUser = _.find(this.like_members, o => {
      return o === userInfo.userid;
    });

    const unlikeUser = _.find(this.unlike_members, o => {
      return o === userInfo.userid;
    });

    if (likeUser) {
      this.likeFlag = true;
      this.unlikeFlag = false;
    } else if (unlikeUser) {
      this.likeFlag = false;
      this.unlikeFlag = true;
    } else {
      this.likeFlag = false;
      this.unlikeFlag = false;
    }
  };

  @action setInterest = async flag => {
    const { fanclubStore } = this.props.store;
    const info = this.props.info;
    const userInfo = fanclubStore.USER_INFO;
    const clubInfo = fanclubStore.currentFanclubInfo;

    // 클럽 회원 체크
    if (!this.clubMemberFlag) return false;

    // 내 글이면 좋아요, 싫어요 안됨
    if (this.myPostFlag) {
      fanclubStore.updateMsgWindow({
        message: `본인의 글에는 좋아요, 싫어요를 할 수 없습니다.`,
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
      return false;
    }

    let obj = {
      code: clubInfo.code,
      userid: userInfo.userid,
      postid: info._id
    };

    if (flag === 'like') {
      if (this.likeFlag != true) {
        obj.like = 'true';
      }
    } else {
      if (this.unlikeFlag != true) {
        obj.unlike = 'true';
      }
    }
    const result = await fanclubStore.setPostInterest(obj);

    if (result.status === 200) {
      const data = result.data;
      this.like_members = data.like_members;
      this.unlike_members = data.unlike_members;
      this.checkInterest();
    }
  };

  componentWillMount() {
    const { fanclubStore } = this.props.store;
    const info = this.props.info;
    const userInfo = fanclubStore.USER_INFO;
    const clubInfo = fanclubStore.currentFanclubInfo;

    if (userInfo.userid === info.author) this.myPostFlag = true;

    this.like_members = info.like_members;
    this.unlike_members = info.unlike_members;

    // 회원 체크
    const member = _.find(clubInfo.members, o => {
      return o === userInfo.userid;
    });

    console.log('이 클럽 회원인가? ', member);

    // 관리자 체크
    this.adminFlag = clubInfo.administrator === userInfo.userid;

    console.log('이 클럽 관리자인가? ', this.adminFlag);

    if (member) {
      this.clubMemberFlag = true;
    }

    console.group('포스트 : ');
    console.log(userInfo);
    console.log('like : ', info.like_members);
    console.log('unlike : ', info.unlike_members);
    console.log('내글인가? ', this.myPostFlag);
    console.groupEnd();

    this.checkInterest();
  }

  render() {
    const info = this.props.info;

    return (
      <div className="post-info">
        <div className="ico-status-wrapper">
          <button type="button" className={'ico-like-wrapper ' + (this.likeFlag === true ? 'active' : '')} onClick={() => this.setInterest('like')}>
            <span type="button" className="ico-btn ico-like"></span>
            <p className="like-count">{this.like_members.length}</p>
          </button>
          <button type="button" className={'ico-unlike-wrapper ' + (this.unlikeFlag === true ? 'active' : '')} onClick={() => this.setInterest('unlike')}>
            <span type="button" className="ico-btn ico-unlike"></span>
            <p className="unlike-count">{this.unlike_members.length}</p>
          </button>
        </div>
        <button className="ico-menu-toggle" onClick={this.showLayer}></button>
        <div className="dimm-layer" style={{ display: this.layerFlag ? 'block' : 'none' }} onClick={this.hideLayer}></div>
        <div className="func-layer" style={{ display: this.layerFlag ? 'block' : 'none' }}>
          <ul className="fl-btns">
            <li>
              <button type="button" className="f-btn share">
                공유
              </button>
            </li>
            {(this.myPostFlag || this.adminFlag) && (
              <li>
                <button type="button" className="f-btn modify" onClick={this.modifyPost}>
                  수정
                </button>
              </li>
            )}
            {(this.myPostFlag || this.adminFlag) && (
              <li>
                <button type="button" className="f-btn delete" onClick={this.deletePost}>
                  삭제
                </button>
              </li>
            )}
            {!this.myPostFlag && (
              <li>
                <button type="button" className="f-btn alarm">
                  신고하기
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
