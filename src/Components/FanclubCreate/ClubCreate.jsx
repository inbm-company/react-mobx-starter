import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import Functions from 'Functions/Common.js';
import Views from 'Routers';

@inject('store')
@observer
export default class InfoCreate extends Component {
  static propTypes = {
    store: PropTypes.any,
    isHidden: PropTypes.any,
    createDoingFlag: PropTypes.any,
    artistItem: PropTypes.any,
    changeLoadingFlag: PropTypes.any
  };

  @observable display = 'none';
  @observable artistItem = null;
  @observable clubName = '';
  @observable existCheckFlag = false;
  @observable imageReady = false;
  @observable titleImageSrc = '';
  @observable titleImageObj = null;
  @observable thumbnailImageSrc = '';
  @observable thumbnailImageObj = null;
  @observable imageFileInfo = [];

  @action.bound
  onChange(event) {
    const { name, value } = event.target;
    this[name] = Functions.trim(value);
  }

  @action changeDisplay = state => {
    if (state) this.display = 'block';
    else this.display = 'none';
  };

  @action checkExistClub = () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    this.props.changeLoadingFlag(true);
  };

  @action getTitleImage = () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    fanclubStore.updateFuWindow({
      callback(res) {
        fanclubStore.updateFuWindowOpen('false');
      },
      close() {
        fanclubStore.updateFuWindowOpen('false');
      }
    });
    fanclubStore.updateFuWindowOpen('true');
  };

  @action.bound
  handleChange(event) {
    if (event.target.files[0]) {
      this.titleImageObj = event.target.files[0];
      this.titleImageSrc = URL.createObjectURL(event.target.files[0]);
      this.checkAllImage();
    }
  }

  @action.bound
  handleChangeThumb(event) {
    if (event.target.files[0]) {
      this.thumbnailImageObj = event.target.files[0];
      this.thumbnailImageSrc = URL.createObjectURL(event.target.files[0]);
      this.checkAllImage();
    }
  }

  @action resetTitleImageSrc = () => {
    this.titleImageSrc = '';
  };

  @action resetThumbnailImageSrc = () => {
    this.thumbnailImageSrc = '';
  };

  @action checkAllImage() {
    if (this.titleImageSrc != '' && this.thumbnailImageSrc != '') {
      this.imageReady = true;
    }
  }

  // 팬클럽 개설하기
  @action createFanclub = () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    // Validation
    if (this.validation()) this.execRegisterFanclub();
  };

  // 팬클럽 Validation
  @action validation = async () => {
    const self = this;
    const { fanclubStore } = this.props.store;
    const pattern = /[~!@#$%^&*()_+|<>?:{}]/gi;

    if (this.clubName === '') {
      fanclubStore.updateMsgWindow({
        message: `팬클럽 이름을 입력해 주세요.`,
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

    if (pattern.test(this.clubName)) {
      fanclubStore.updateMsgWindow({
        message: `특수문자는 사용할 수 없습니다.`,
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

    const result = await fanclubStore.checkExistedClubName({
      title: self.clubName,
      artistCode: self.props.artistItem.code
    });

    if (result.data != undefined) {
      if (result.data.length) {
        fanclubStore.updateMsgWindow({
          message: '이미 존재하는 팬클럽입니다. 다른 이름으로 다시 시도해 주세요.',
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
    } else if (result.data === undefined) {
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
      return false;
    }

    if (this.titleImageSrc === '') {
      fanclubStore.updateMsgWindow({
        message: `타이틀 이미지를 등록해 주세요.`,
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

    if (this.thumbnailImageSrc === '') {
      fanclubStore.updateMsgWindow({
        message: `썸네일 이미지를 등록해 주세요.`,
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

    return true;
  };

  // 팬클럽 등록 실행
  @action execRegisterFanclub = async () => {
    const self = this;
    const store = this.props.store;
    const { fanclubStore } = store;

    fanclubStore.updateMsgWindow({
      message: `"${self.clubName}" 팬클럽을 개설합니다.<br />최종 확인 후 확인 버튼을 누르시면 팬클럽이 개설됩니다.`,
      buttons: [
        {
          text: '취소',
          classText: 'cancel',
          callback() {
            fanclubStore.updateMsgWindowOpen('false');
          }
        },
        {
          text: '미리보기',
          classText: 'cancel',
          async callback() {
            // fanclubStore.updateMsgWindowOpen('false');
            console.log('fanclubStore.USER_INFO.', fanclubStore.USER_INFO);
            await fanclubStore.updatePreviewFanclubInfo({
              title: self.clubName,
              titleImgSrc: self.titleImageSrc,
              administrator: fanclubStore.USER_INFO.user_nickname,
              adminPhoto: fanclubStore.USER_INFO.user_photo
            });
            fanclubStore.updatePreviewFanclubInfoOpen('true');
            document.body.classList.add('hidden');
          }
        },
        {
          text: '확인',
          classText: 'confirm',
          callback() {
            self.uploadData();
          }
        }
      ]
    });

    fanclubStore.updateMsgWindowOpen('true');
  };

  // 이미지 파일 업로드 및 생성 시도
  @action uploadData = async () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    fanclubStore.updateMsgWindowOpen('false');

    // 로딩화면
    self.props.changeLoadingFlag(true);

    // 이미지 업로드해서 URL 받아옴.
    const titleImageFormData = new FormData();
    titleImageFormData.append('file_name', self.titleImageObj);

    const uploadTitleImage = await fanclubStore.uloadFiles({
      formData: titleImageFormData
    });

    if (uploadTitleImage.error) return false;

    self.imageFileInfo.push(uploadTitleImage);

    const thumbImageFormData = new FormData();
    thumbImageFormData.append('file_name', self.thumbnailImageObj);

    const uploadThumbnailImage = await fanclubStore.uloadFiles({
      formData: thumbImageFormData
    });

    if (uploadThumbnailImage.error) return false;

    self.imageFileInfo.push(uploadThumbnailImage);

    console.log('클럽 생성 들어가기 전:');

    // 클럽 생성
    const createFanclub = await fanclubStore.createFanclub({
      title: self.clubName,
      artistCode: self.props.artistItem.code,
      mainImage: self.imageFileInfo[0],
      thumbnailImage: self.imageFileInfo[1],
      admin: fanclubStore.USER_INFO.userid,
      post: `"${self.clubName}"을(를) 개설하였습니다.`
    });

    console.log('클럽 생성 결과 : ', createFanclub);

    this.createdResult(createFanclub);
  };

  // 생성 결과
  @action createdResult = r => {
    const self = this;
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const { goTo } = this.props.store.router;

    self.props.changeLoadingFlag(false);

    if (r.fanclub != undefined && r.post != undefined) {
      // 클럽 생성 성공

      fanclubStore.updateMsgWindow({
        message: `${self.clubName} 클럽이 생성되었습니다. 클럽 홈으로 이동합니다.`,
        buttons: [
          {
            text: '확인',
            classText: 'confirm',
            async callback() {
              fanclubStore.updateMsgWindowOpen('false');
              // now로 이동

              const result = await fanclubStore.updateInstantCurrentFanclubInfo({
                code: r.fanclub.code
              });
              if (result) {
                goTo(Views.clubHome, {}, store);
              }
            }
          }
        ]
      });
      fanclubStore.updateMsgWindowOpen('true');
    } else {
      // 생성 실패
      fanclubStore.updateMsgWindow({
        message: `팬클럽 생성에 실패하였습니다. 다시 시도하시거나 관리자에게 문의해 주세요.`,
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

  componentWillReceiveProps(nextProps) {
    this.changeDisplay(nextProps.createDoingFlag);
    if (nextProps.artistItem) this.artistItem = nextProps.artistItem;
  }

  render() {
    const { fanclubStore } = this.props.store;
    const isHidden = this.props.isHidden;

    return (
      <div className="fc-name-input" style={{ display: this.display }}>
        <div className="selected-artist">
          <p className="s-t">선택한 아티스트 :</p>
          <p>
            <strong className="name">{this.artistItem != null && this.artistItem.name}</strong>
          </p>
        </div>
        <div className="name-input-section">
          <div className="inp-wrap">
            <input type="text" className="inp" name="clubName" onChange={this.onChange} placeholder="클럽 이름을 입력하세요." />
          </div>
          {/* <div className="txt-wrap" style={{ display: this.existCheckFlag ? 'block' : 'none' }}>
            <p className="inp">
              <span className="checked">{this.clubName}</span>
            </p>
          </div> */}
        </div>
        {/* <div className="btns-wrap" style={{ display: this.existCheckFlag ? 'none' : 'block' }}>
          <button type="button" className="btn-type1 bg-color1" disabled={this.clubName === ''} onClick={this.checkExistClub}>
            중복 확인
          </button>
        </div> */}
        <div>
          <div className="image-input-area">
            {/* <button type="button" className="c-t" onClick={this.getTitleImage}>
              타이틀 이미지 등록
            </button> */}

            <label className="c-t" style={{ display: this.titleImageSrc != '' ? 'none' : 'flex' }}>
              <span className="text">타이틀 이미지 등록</span>
              <input type="file" onChange={this.handleChange} onClick={this.imageClick} accept="image/x-png,image/gif,image/jpeg" />
            </label>

            <p className="fc-img" style={{ display: this.titleImageSrc != '' ? 'block' : 'none' }}>
              <img src={this.titleImageSrc} />
            </p>
            <button type="button" className="del-img" onClick={this.resetTitleImageSrc} style={{ display: this.titleImageSrc != '' ? 'block' : 'none' }}>
              X
            </button>
          </div>
          <div className="image-input-area thumbnail">
            <label className="c-t" style={{ display: this.thumbnailImageSrc != '' ? 'none' : 'flex' }}>
              <span className="text">썸네일 이미지 등록</span>
              <input type="file" onChange={this.handleChangeThumb} onClick={this.thumbClick} accept="image/x-png,image/gif,image/jpeg" />
            </label>

            <p className="fc-img" style={{ display: this.thumbnailImageSrc != '' ? 'block' : 'none' }}>
              <img src={this.thumbnailImageSrc} />
            </p>
            <button type="button" className="del-img" onClick={this.resetThumbnailImageSrc} style={{ display: this.thumbnailImageSrc != '' ? 'block' : 'none' }}>
              X
            </button>
          </div>
        </div>
        <div className="register-btn-section" onClick={this.createFanclub}>
          <button type="button" className="btn-type1 bg-color1">
            개설하기
          </button>
        </div>
      </div>
    );
  }
}
