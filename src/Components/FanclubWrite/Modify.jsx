import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import NoticeAnnouncement from 'Components/Common/NoticeAnnouncement';
import Functions from 'Functions/Common.js';
import Loader from 'Components/Common/Loader';
import Views from 'Routers';
import _ from 'lodash';

@inject('store')
@observer
export default class FanclubWrite extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @observable modifyItemInfo = null;

  @observable currentType = 'text';
  @observable writeTypes = ['text', 'image', 'video', 'vote', 'link'];

  @observable myRef = null;

  @observable loadingFlag = false;

  // 글 변수들
  @observable postTitle = '';
  @observable postContent = '';
  @observable postImage = null;
  @observable postImageSrc = '';
  @observable postVideo = null;
  @observable postVideoSrc = '';
  @observable postVideoType = '';
  @observable postVotes = null;
  @observable postLink = null;
  @observable youtubeLink = null;
  @observable verifiedYoutubeLink = null;
  @observable youtubeFlag = false;
  @observable youtubeValidation = false;

  // 글 타입 변경
  @action changeType = type => {
    if (type === 'vote' || type === 'link') return false;
    this.currentType = type;
  };

  // onChange
  @action.bound
  onChange(event) {
    const { name, value } = event.target;
    this[name] = Functions.trim(value);
  }

  @action.bound
  onChangeImage(event) {
    if (event.target.files[0]) {
      this.postImage = event.target.files[0];
      this.postImageSrc = URL.createObjectURL(event.target.files[0]);
    }
  }

  @action.bound
  onChangeVideo(event) {
    if (event.target.files[0]) {
      const self = this;
      const file = event.target.files[0];

      this.postVideo = file;

      let reader = new FileReader();

      //if reading completed
      reader.onload = e => {
        self.postVideoSrc = e.target.result;
        self.postVideoType = file.type;
      };

      //read the file
      reader.readAsDataURL(this.postVideo);
    }
  }

  // 비디오, 유투브 선택
  @action selectVideoType = type => {
    if (type === 'video') {
      this.youtubeFlag = false;
    } else {
      this.youtubeFlag = true;
    }
  };

  // 유투브 링크 검증
  @action setYoutubeLink = async () => {
    const { fanclubStore } = this.props.store;

    const result = await fanclubStore.verifyYoutubeLink({
      link: this.youtubeLink
    });

    if (result.status === 200) {
      this.verifiedYoutubeLink = `https://www.youtube.com/embed/${result.data.id}`;
      this.youtubeValidation = true;
    } else {
      this.youtubeValidation = false;
      fanclubStore.updateMsgWindow({
        message: `잘못된 링크입니다.`,
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
  };

  // 파일 업로드
  @action uploadFile = async file => {
    const { fanclubStore } = this.props.store;
    const formData = new FormData();

    formData.append('file_name', file);

    const result = await fanclubStore.uloadFiles({
      formData: formData
    });

    return result.path;
  };

  // 밸리데이션
  @action validation = () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    // 제목 확인
    if (this.postTitle === '') {
      fanclubStore.updateMsgWindow({
        message: `제목을 입력해 주세요.`,
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

    // 내용 확인
    if (this.postContent === '') {
      fanclubStore.updateMsgWindow({
        message: `내용을 입력해 주세요.`,
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

    // 비디오 확인
    if (this.currentType === 'video') {
      if (this.postVideoSrc === '' && !this.youtubeFlag) {
        fanclubStore.updateMsgWindow({
          message: `동영상을 등록해 주세요.`,
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
      } else if (this.verifiedYoutubeLink === null && this.youtubeFlag) {
        fanclubStore.updateMsgWindow({
          message: `유투브를 등록해 주세요.`,
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
    }

    return true;
  };

  // 등록하기
  @action goRegister = async () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    if (!this.validation()) return false;

    fanclubStore.updateMsgWindow({
      message: `글을 수정하시겠습니까?`,
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
            self.registerToServer();
          }
        }
      ]
    });
    fanclubStore.updateMsgWindowOpen('true');
  };

  // 서버에 올림
  @action registerToServer = async () => {
    const self = this;
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const { goTo } = this.props.store.router;
    const info = this.modifyItemInfo;

    this.loadingFlag = true;

    let registerObj = {
      code: fanclubStore.currentFanclubInfo.code,
      _id: info._id,
      author: fanclubStore.USER_INFO.userid,
      title: this.postTitle.replace(/(<([^>]+)>)/gi, ''),
      content: this.postContent.replace(/(<([^>]+)>)/gi, '')
    };

    switch (this.currentType) {
      case 'text':
        registerObj.type = '3';
        break;
      case 'image':
        registerObj.type = '4';
        if (this.postImage != null) {
          registerObj.image = await self.uploadFile(this.postImage);
        } else {
          registerObj.image = info.image;
        }
        break;
      case 'video':
        registerObj.type = '5';
        if (self.verifiedYoutubeLink != '' && self.youtubeFlag) {
          registerObj.youtube = self.verifiedYoutubeLink;
          registerObj.video = '';
        } else {
          registerObj.video = await self.uploadFile(this.postVideo);
          registerObj.youtube = '';
        }
        break;
      case 'vote':
        registerObj.type = '6';
        registerObj.votes = self.votes;
        break;
      case 'link':
        registerObj.type = '7';
        registerObj.link = self.link;
        break;
    }

    console.group('글 Object');
    console.log(registerObj);
    console.groupEnd();

    const result = await fanclubStore.modifyPost(registerObj);

    console.group('글 수정된');
    console.log(result);
    console.groupEnd();

    // 정상적으로 등록되면 Now 화면으로 이동
    if (result.status === 200) {
      // 목록 다시 불러옴
      // 타임라인 초기화
      fanclubStore.currentFanclubTimeline = [];

      // Post 가져옴
      await fanclubStore.getTimelinePost({
        code: registerObj.code,
        offset: 0,
        limit: 0
      });

      setTimeout(() => {
        this.gotoMain();
      }, 500);
    } else {
      self.loadingFlag = false;
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

  // 메인으로 이동
  @action gotoMain = () => {
    const self = this;
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const { goTo } = this.props.store.router;

    this.loadingFlag = false;
    fanclubStore.updateMsgWindow({
      message: `정상적으로 수정되었습니다.`,
      buttons: [
        {
          text: '확인',
          classText: 'confirm',
          callback() {
            history.back();
            fanclubStore.updateMsgWindowOpen('false');
          }
        }
      ]
    });
    fanclubStore.updateMsgWindowOpen('true');
  };

  // 받아온 정보에 따라 정보를 세팅한다.
  @action settingInfo = () => {
    const { fanclubStore } = this.props.store;
    const info = this.modifyItemInfo;

    console.group('글 수정 정보');
    console.log(info);
    console.groupEnd();

    this.postTitle = info.title;
    this.postContent = info.content;

    this.titleInput.value = this.postTitle;
    this.contentTextarea.value = this.postContent;

    switch (info.type) {
      case '3':
        this.currentType = 'text';
        break;
      case '4':
        this.currentType = 'image';
        this.postImageSrc = `${fanclubStore.IMAGE_SERVER_URL}/${info.image}`;
        break;
      case '5':
        this.currentType = 'video';
        if (info.video != '') {
          this.postVideoSrc = `${fanclubStore.IMAGE_SERVER_URL}/${info.video}`;
        } else if (info.youtube != '') {
          this.youtubeFlag = true;
          this.youtubeValidation = true;
          this.verifiedYoutubeLink = info.youtube;
        }

        break;
      case '6':
        this.currentType = 'vote';
        break;
      case '7':
        this.currentType = 'link';
        break;
    }
  };

  // Mount
  componentDidMount() {
    console.log('글 수정 마운트');
    window.scrollTo(0, 0);

    const { params } = this.props.store.router;

    if (params.post) {
      localStorage.setItem('MOD_ITEM', JSON.stringify(params.post));
      this.modifyItemInfo = params.post;
    } else {
      const modItem = localStorage.getItem('MOD_ITEM');
      this.modifyItemInfo = JSON.parse(modItem);
    }

    this.settingInfo();
  }

  render() {
    const { fanclubStore } = this.props.store;
    return (
      <div className="fanclub-write-container">
        <Loader loadingFlag={this.loadingFlag} />
        <ViewPageHedaer title={'글수정'} searchFlag={true} settingFlag={true} />

        <NoticeAnnouncement />

        <div className="write-type-selector box-type">
          {this.writeTypes.map((item, index) => (
            <button type="button" key={index} className={'wt-sel ' + item + (this.currentType === item ? ' active' : '')} onClick={() => this.changeType(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="tit-write-section box-type">
          <div className="inp-wrap">
            <input
              type="text"
              className="inp-text"
              ref={ref => {
                this.titleInput = ref;
              }}
              name="postTitle"
              placeholder="제목을 입력해 주세요."
              onChange={this.onChange}
            />
          </div>
        </div>

        {this.currentType === 'image' && (
          <div className="media-wrapper">
            <div className="media-upload">
              <label className="btn-type1 bg-color1">
                이미지 등록하기
                <input type="file" onChange={this.onChangeImage} name="postImage" accept="image/x-png,image/gif,image/jpeg" />
              </label>
            </div>
            <p className="img-area" style={{ display: this.postImageSrc != '' ? 'block' : 'none' }}>
              <img src={this.postImageSrc} />
            </p>
          </div>
        )}
        {this.currentType === 'video' && (
          <div className="media-wrapper">
            <div className="divide-container">
              <div className="media-upload">
                <label className="btn-type1 bg-color1 alter-type1" onClick={() => this.selectVideoType('video')}>
                  동영상 등록하기
                  <input type="file" onChange={this.onChangeVideo} name="postVideo" accept="video/*" />
                </label>
              </div>
              <div className="youtube-upload">
                <button type="button" className="btn-type1 bg-color2 alter-type1" onClick={() => this.selectVideoType('youtube')}>
                  유투브 등록하기
                </button>
              </div>
            </div>
            {this.postVideoSrc != '' && !this.youtubeFlag && (
              <div className="video-area">
                <video width="100%" preload="auto" controls playsInline>
                  <source src={this.postVideoSrc} type={this.postVideoType} />
                </video>
              </div>
            )}
            {this.youtubeFlag && (
              <div className="youtube-area">
                <div className="ya-head">
                  <div className="inp-wrap">
                    <input type="text" onChange={this.onChange} name="youtubeLink" placeholder="유투브 URL을 입력해 주세요." />
                  </div>
                  <button type="button" className="btn-type1 bg-color1 alter-type1" onClick={this.setYoutubeLink}>
                    불러오기
                  </button>
                </div>
                {this.youtubeValidation && (
                  <div className="video-container">
                    <iframe src={this.verifiedYoutubeLink} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="content-write-section box-type">
          <div className="inp-wrap">
            <textarea
              className="inp-textarea"
              ref={ref => {
                this.contentTextarea = ref;
              }}
              name="postContent"
              placeholder="내용을 입력해 주세요."
              cols="30"
              onChange={this.onChange}
            ></textarea>
          </div>

          <div className="vote-area" style={{ display: 'none' }}>
            <div className="vote-item">
              <div className="vote-input">
                <input type="text" placeholder="1.항목 입력하기" />
              </div>
              <div className="vote-img">
                <img src="../images/@img-vote1.png" alt="" />
              </div>
              <div className="add-photo">
                <button type="button">사진</button>
              </div>
            </div>
            <div className="vote-item">
              <div className="vote-input">
                <input type="text" placeholder="2.항목 입력하기" />
              </div>
              <div className="vote-img">
                <img src="../images/@img-vote2.png" alt="" />
              </div>
              <div className="add-photo">
                <button type="button">사진</button>
              </div>
            </div>
            <div className="add-vote-item">
              <button type="button">항목 추가하기</button>
            </div>
          </div>

          <div className="link-area" style={{ display: 'none' }}>
            <h3 className="la-tit">복사한 링크</h3>
            <input type="text" />
            <div className="link-content">크롤링 영역</div>
          </div>
        </div>

        <div className="bottom-btns-wrap">
          <button type="button" className="btn-type1 bg-color1" onClick={this.goRegister}>
            수정하기
          </button>
        </div>
      </div>
    );
  }
}
