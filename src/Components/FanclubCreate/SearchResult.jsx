import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import { timeout } from 'q';

@inject('store')
@observer
export default class SearchResult extends Component {
  static propTypes = {
    store: PropTypes.any,
    isHidden: PropTypes.any,
    searchResultList: PropTypes.any,
    searchWord: PropTypes.any,
    changeLoadingFlag: PropTypes.any,
    setReset: PropTypes.any,
    selectArtist: PropTypes.any
  };

  @observable display = 'none';
  @observable searchResultList = [];
  @observable searchWord = '';

  @action changeDisplay = state => {
    if (!state) this.display = 'none';
    else this.display = 'block';
  };

  // 희망 아티스트 이름 등록 확인
  @action actionRegister = () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    fanclubStore.updateMsgWindow({
      message: self.searchWord + '(으)로 새롭게 아티스트를 등록하시겠습니까?',
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
            self.registerWishRequest();
          }
        }
      ]
    });

    fanclubStore.updateMsgWindowOpen('true');
  };

  // 희망 아티스트 등록 요청함
  @action registerWishRequest = () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    this.props.changeLoadingFlag(true);
    fanclubStore.registerWishArtist({
      name: self.searchWord,
      userid: fanclubStore.USER_INFO.userid,
      callback(result) {
        if (result.success != undefined) {
          fanclubStore.updateMsgWindow({
            message: self.searchWord + '이(가) 희망 아티스트 이름으로 등록되었습니다.',
            buttons: [
              {
                text: '확인',
                classText: 'confirm',
                callback() {
                  fanclubStore.updateMsgWindowOpen('false');
                  self.setReset();
                }
              }
            ]
          });

          fanclubStore.updateMsgWindowOpen('true');
        } else if (result.error) {
          fanclubStore.updateMsgWindow({
            message: self.searchWord + '은(는) 이미 희망 아티스트 목록에 등록되어 있습니다.',
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
        self.props.changeLoadingFlag(false);
      }
    });
  };

  // 리셋 요청
  @action setReset = () => {
    this.props.setReset();
  };

  // 아티스트 선택
  @action selectArtist(item) {
    const self = this;
    const { fanclubStore } = this.props.store;

    fanclubStore.updateMsgWindow({
      message: '"' + item.name + '(' + item.eng_name + ')"의 팬클럽을 만드시겠습니까?',
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
            self.props.selectArtist(item);
          }
        }
      ]
    });

    fanclubStore.updateMsgWindowOpen('true');
  }

  componentWillReceiveProps(nextProps) {
    this.changeDisplay(nextProps.isHidden);
    if (nextProps.searchWord) this.searchWord = nextProps.searchWord;
    if (nextProps.searchResultList) this.searchResultList = nextProps.searchResultList;
  }

  render() {
    const { fanclubStore } = this.props.store;

    return (
      <div className="search-result-section" style={{ display: this.display }}>
        <ul className="result-list" style={{ display: this.searchResultList.length ? 'block' : 'none' }}>
          {this.searchResultList.map((item, index) => (
            <li key={index}>
              <button type="button" className="a-word" onClick={() => this.selectArtist(item)}>
                {item.name} {item.eng_name}
              </button>
            </li>
          ))}
        </ul>
        <div style={{ display: this.searchResultList.length ? 'none' : 'block' }}>
          <p className="no-result">
            &apos;<span className="s-word">{this.searchWord}</span>&apos;(으)로 등록된 아티스트가 없습니다.
          </p>
          <div className="btns-wrap">
            <button type="button" className="btn-type1 bg-color1" onClick={this.actionRegister}>
              아티스트 등록 요청하기
            </button>
          </div>
        </div>
      </div>
    );
  }
}
