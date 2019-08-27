import { observable, action } from 'mobx';
import Functions from 'Functions/Common.js';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import jwt from 'jsonwebtoken';

export default class FanclubStore {
  // User Login Flag
  @observable USER_LOGIN_FLAG = false;

  // Web Direct Login Flag
  @observable WEB_DIRECT_LOGIN = false;

  // API TOKEN
  @observable API_TOKEN = '';

  // Error 메시지 공통
  @observable CONNECT_ERROR_MSG = `에러가 발생하였습니다. 다시 시도하시거나 관리자에게 문의해 주세요.`;

  // 유저 정보
  @observable USER_INFO = null;

  // API Base Url
  @observable API_BASE_URL = 'http://211.110.165.193:3000';
  @observable IMAGE_SERVER_URL = 'http://211.110.165.193:4000';

  // API Endpoint
  @observable API_ENDPOINT = {
    // 유저 정보
    getUserInfo: '/user/find',
    login: '/user/login',

    // 아티스트
    getArtistList: '/artist/find',
    registerWishArtist: '/artist/wish-request',

    // 파일 업로드
    fileUpload: '/file/upload',

    // 팬클럽
    registerFanclub: '/fanclub/register',
    getClubList: '/fanclub/find',
    getMyCreateFanclub: '/fanclub/mycreateclub',
    getNewFanclub: '/fanclub/newclub',
    getMyInClubList: '/fanclub/inclub',
    applyFanclub: '/fanclub/apply',
    acceptFanclub: '/fanclub/accept',

    // 타임라인 글
    registerPost: '/post/register',
    getPostList: '/post/find',
    deletePost: '/post/delete',
    modifyPost: '/post/modify',
    setPostInterest: '/post/update-interest',

    // 푸시
    pushNotification: '/push/notify',

    // Capture
    verifyYoutubeLink: '/capture/youtube-verify'
  };

  // Loading 화면
  @observable loadingBgOpen = false;

  // 친구목록 Layer 객체
  @observable friendListLayerOpen = false;

  // 프로필 설정 Layer 객체
  @observable myProfileLayerOpen = false;

  // MessageWindow 객체
  @observable msgWindowOpen = 'false';
  @observable msgWindow = {
    title: '시스템 메시지',
    message: '테스트<br>테스트',
    buttons: [
      {
        text: '취소',
        classText: 'cancel',
        callback() {
          console.log('hello');
        }
      }
    ]
  };

  // MessageWindow 객체
  @observable fuWindowOpen = 'false';
  @observable fuWindow = {
    callback() {},
    close() {
      this.fuWindowOpen = 'false';
    }
  };

  // 미리보기 팬클럽 정보
  @observable previewFanclubInfoOpen = 'false';
  @observable previewFanclubInfo = {
    title: '',
    titleImgSrc: '',
    administrator: '',
    adminPhoto: ''
  };

  // 프로필 레이어 정보
  @observable profileLayerOpen = false;
  @observable profileLayerInfo = {};

  // 현재 내가 보고 있는 팬클럽의 정보
  @observable currentFanclubInfo = {};

  // 현재 내가 보고 있는 팬클럽의 동맹 클럽 정보
  @observable currentFanclubAllianceInfo = [];

  // 현재 내가 보고 있는 팬클럽의 Post 목록
  @observable currentFanclubTimeline = [];

  // 현재 내가 보고 있는 팬클럽의 Post의 offset과 limit
  @observable currentPostOffset = 0;
  @observable currentPostLimit = 10;

  // 가입 승인 상태 변경
  @observable clubApplyStatusChange = false;

  // 아티스트 목록
  @observable allArtistList = [];

  // 내가 만든 팬클럽 목록
  @observable myFanclub = [
    // {
    //   imgSrc: '/images/fanclub/ico-chungha.png',
    //   name: '청하사랑',
    //   alarms: 0,
    //   users: '18.6k'
    // },
  ];

  // 아티스트 라이브 목록
  @observable artistLive = [
    {
      imgSrc: '/images/fanclub/ico-twice-big.png',
      name: 'Twice',
      users: '4.5k',
      createdTime: '세 시간 전'
    },
    {
      imgSrc: '/images/fanclub/ico-blackpink-big.png',
      name: 'BlackPink',
      users: '4.5k',
      createdTime: '한 시간 전'
    },
    {
      imgSrc: '/images/fanclub/ico-fengtimo-big.png',
      name: 'Fengtimo',
      users: '4.5k',
      createdTime: '20분 전'
    },
    {
      imgSrc: '/images/fanclub/ico-twice-big.png',
      name: 'Twice',
      users: '4.5k',
      createdTime: '세 시간 전'
    },
    {
      imgSrc: '/images/fanclub/ico-blackpink-big.png',
      name: 'BlackPink',
      users: '4.5k',
      createdTime: '한 시간 전'
    },
    {
      imgSrc: '/images/fanclub/ico-fengtimo-big.png',
      name: 'Fengtimo',
      users: '4.5k',
      createdTime: '20분 전'
    },
    {
      imgSrc: '/images/fanclub/ico-twice-big.png',
      name: 'Twice',
      users: '4.5k',
      createdTime: '세 시간 전'
    },
    {
      imgSrc: '/images/fanclub/ico-blackpink-big.png',
      name: 'BlackPink',
      users: '4.5k',
      createdTime: '한 시간 전'
    },
    {
      imgSrc: '/images/fanclub/ico-fengtimo-big.png',
      name: 'Fengtimo',
      users: '4.5k',
      createdTime: '20분 전'
    }
  ];

  // 신규 팬클럽 목록
  @observable newFanclub = [
    // {
    //   imgSrc: '/images/fanclub/ico-chungha2.png',
    //   alarms: 0,
    //   artist: 'Exo',
    //   name: '진격의 엑소, 우리들의 힐링',
    //   ally: 154,
    //   fans: '140k',
    //   createdDate: '2019-02-20'
    // },
  ];

  // 공식 팬클럽 목록
  @observable officialFanclub = [
    // {
    //   imgSrc: '/images/fanclub/img-iu.png',
    //   artist: '아이유',
    //   name: 'IU Official fanclub',
    //   ally: 3,
    //   fans: '5.6k',
    //   createdDate: '2019-02'
    // }
  ];

  // 유저 팬클럽 목록
  @observable userFanclub = [
    // {
    //   imgSrc: '/images/fanclub/ico-chungha2.png',
    //   alarms: 10,
    //   artist: '오마이걸',
    //   name: '오! 마이 여신님',
    //   ally: 154,
    //   fans: '140k',
    //   createdDate: '2019-02-20'
    // },
  ];

  // Top 20 Artist
  @observable top20Artist = [
    { name: '방탄소년단', engName: 'BTS' },
    { name: '엑소', engName: 'EXO' },
    { name: 'GOT7', engName: '' },
    { name: '워너원', engName: 'Wanner One' },
    { name: 'Nuest', engName: '' },
    { name: '여자친구', engName: 'GFRIEND' },
    { name: 'B.A.P', engName: '' },
    { name: '트와이스', engName: 'Twice' },
    { name: '레드벨벳', engName: 'Red Velvet' },
    { name: '방탄소년단', engName: 'BTS' },
    { name: '엑소', engName: 'EXO' },
    { name: 'GOT7', engName: '' },
    { name: '워너원', engName: 'Wanner One' },
    { name: 'Nuest', engName: '' },
    { name: '여자친구', engName: 'GFRIEND' },
    { name: 'B.A.P', engName: '' },
    { name: '트와이스', engName: 'Twice' },
    { name: '레드벨벳', engName: 'Red Velvet' },
    { name: 'GOT7', engName: '' },
    { name: '워너원', engName: 'Wanner One' }
  ];

  @observable AllyClub = [
    // {
    //   imgSrc: '/images/fanclub/ico-chungha2.png',
    //   alarms: 10,
    //   artist: '오마이걸',
    //   name: '오! 마이 여신님',
    //   ally: 154,
    //   fans: '140k',
    //   createdDate: '2019-02-20'
    // },
  ];

  @observable TimeLineItem = [
    // {
    //   date: '2019-08-08',
    //   items: [
    //     {
    //       contentType: 'image',
    //       imgAvatarSrc: '/images/@img-fan5.png',
    //       imgSrc: '/images/timeline/img-iu1.png',
    //       username: '유애나 러버',
    //       createdTime: '1시간 전',
    //       title: '오늘도 아이유 사진으로 시작!',
    //       comment: '',
    //       likeCount: '4021',
    //       unLikeCount: '0'
    //     }
    //   ]
    // }
  ];

  @observable artistNames = [];

  /*
   * Action: Update
   */

  // 로그인 여부를 변경한다.
  @action updateUSER_LOGIN_FLAG = flag => {
    this.USER_LOGIN_FLAG = flag;
  };

  // 웹에서 로그인 여부를 변경한다.
  @action updateWEB_DIRECT_LOGIN = flag => {
    this.WEB_DIRECT_LOGIN = flag;
  };

  // 개발용 환경을 세팅한다.
  @action updateDevelopmentSetting = () => {
    this.API_BASE_URL = 'http://192.168.10.76:3000';
    this.IMAGE_SERVER_URL = 'http://192.168.10.76:4000';
  };

  // 기본 유저 정보를 세팅한다.
  @action setBasicUserInfo = async token => {
    localStorage.setItem('auth-token', token);
    const decode = jwt.decode(token);

    console.group('TOKEN INFO');
    console.log(decode);
    console.groupEnd();

    this.API_TOKEN = token;

    const user = await this.getUserInfo({ _id: decode._id });

    if (user.status === 200) {
      this.USER_INFO = user.data;
      if (user.data.user_nickname === '') {
        this.USER_INFO.user_nickname = this.USER_INFO.userid;
      }
      return true;
    } else {
      alert('유저 정보를 불러오지 못했습니다. 새로고침하시거나 다시 로그인해주세요.');
      localStorage.removeItem('MOD_ITEM');
      localStorage.removeItem('auth-token');
      localStorage.removeItem('clubCode');
    }
  };

  // 로딩 화면을 보여주거나 감춘다.
  @action updateLoadingBgOpen = flag => {
    this.loadingBgOpen = flag;
  };

  // 친구목록 Layer 객체를 열거나 닫는다.
  @action updateFriendListLayerOpen = flag => {
    this.friendListLayerOpen = flag;
    if (this.friendListLayerOpen) {
      localStorage.setItem('CPAGE', 'friendlist');
    } else {
      localStorage.removeItem('CPAGE');
    }
  };

  // 프로필 설정 Layer 객체
  @action updateMyProfileLayerOpen = flag => {
    this.myProfileLayerOpen = flag;
  };

  // MessageWindow를 열거나 닫는다.
  @action updateMsgWindowOpen = flag => {
    this.msgWindowOpen = flag;
  };

  // MessageWindow 객체의 값을 업데이트한다.
  @action updateMsgWindow = value => {
    this.msgWindow = value;
  };

  // fuWindow를 열거나 닫는다.
  @action updateFuWindowOpen = flag => {
    this.fuWindowOpen = flag;
  };

  // fuWindow 객체의 값을 업데이트한다.
  @action updateFuWindow = value => {
    this.fuWindow = value;
  };

  // previewFanclubInfo를 열거나 닫는다.
  @action updatePreviewFanclubInfoOpen = flag => {
    this.previewFanclubInfoOpen = flag;
  };

  // previewFanclubInfo 객체의 값을 업데이트한다.
  @action updatePreviewFanclubInfo = value => {
    this.previewFanclubInfo = value;
  };

  // profileLayer를 열거나 닫는다.
  @action updateProfileLayerOpen = flag => {
    this.profileLayerOpen = flag;
  };

  // profileLayer를 객체의 값을 업데이트한다.
  @action updateProfileLayerInfo = ({ type, info }) => {
    this.profileLayerInfo = {
      type: type,
      info: info
    };
  };

  // clubApplyStatusChange 값을 변경한다.
  @action updateClubApplyStatusChange = flag => {
    this.clubApplyStatusChange = flag;
  };

  // currentFanclubInfo 객체의 값을 업데이트한다.
  @action updateCurrentFanclubInfo = item => {
    this.currentFanclubInfo = {
      code: item.code,
      artist_code: item.artist_code,
      title: item.title,
      official: item.official,
      access_level: item.access_level,
      administrator: item.administrator,
      administrator_sub: item.administrator_sub,
      main_image: item.main_image.path,
      thumb_image: item.thumb_image.path,
      club_rank: item.club_rank,
      created_date: item.created_date,
      running_status: item.running_status,
      latest_paused_date: item.latest_paused_date,
      closed_date: item.closed_date,
      members: item.members,
      member_size: item.member_size,
      fav_members: item.fav_members,
      post_id: item.post_id,
      shopping_mall_id: item.shopping_mall_id,
      fan_drive_id: item.fan_drive_id,
      alliances: item.alliances,
      waiting_members: item.waiting_members
    };

    const clubCode = localStorage.setItem('clubCode', item.code);
  };

  // currentFanclubAllianceInfo 객체의 값을 업데이트 한다.
  @action updateCurrentFanclubAllianceInfo = async alliances => {
    const self = this;
    self.currentFanclubAllianceInfo = [];
    if (alliances.length) {
      await alliances.map(item => {
        self.currentFanclubAllianceInfo.push({
          code: item.code,
          artist_code: item.artist_code,
          title: item.title,
          official: item.official,
          access_level: item.access_level,
          administrator: item.administrator,
          administrator_sub: item.administrator_sub,
          main_image: item.main_image.path,
          thumb_image: item.thumb_image.path,
          club_rank: item.club_rank,
          created_date: item.created_date,
          running_status: item.running_status,
          latest_paused_date: item.latest_paused_date,
          closed_date: item.closed_date,
          members: item.members,
          member_size: item.member_size,
          waiting_members: item.waiting_members,
          post_id: item.post_id,
          shopping_mall_id: item.shopping_mall_id,
          fan_drive_id: item.fan_drive_id,
          alliances: item.alliances
        });
      });
    }
  };

  // id로 글을 찾아 배열에서 삭제한다.
  @action deletePostById = async id => {
    const self = this;
    let arr = _.cloneDeep(this.currentFanclubTimeline);

    console.log(arr);
  };

  // timeline 객체를 날짜별로 다시 묶는다.
  @action resignPostsByDay = async posts => {
    const self = this;
    let arr = _.cloneDeep(this.currentFanclubTimeline);

    await posts.map(item => {
      let date = moment(item.created_date).format('YYYYMMDD');
      const existDate = _.find(arr, o => {
        return o.date === date;
      });
      if (existDate) {
        existDate.posts.push(item);
      } else {
        arr.push({
          date: date,
          posts: [item]
        });
      }
    });

    arr = arr.sort(function(a, b) {
      return parseInt(b.date) - parseInt(a.date);
    });

    for (let i in arr) {
      let posts = _.cloneDeep(arr[i].posts);
      posts = posts.sort(function(a, b) {
        return parseInt(b.created_date) - parseInt(a.created_date);
      });
      arr[i].posts = posts;
    }

    this.currentFanclubTimeline = _.cloneDeep(arr);

    return true;
  };

  // Post를 가져온다.
  @action getTimelinePost = async ({ code, offset, limit }) => {
    console.log('포스트 가져오기 전 정보 : ', code, offset, limit);
    // Post 가져오기
    const posts = await this.getPostList({
      code: code,
      offset: offset,
      limit: limit
    });

    console.log('포스트 가져온 결과 : ', posts);

    if (posts.data.length) await this.resignPostsByDay(posts.data);

    let size = 0;
    const timelineData = this.currentFanclubTimeline;

    for (let i = 0; i < timelineData.length; i++) {
      size += timelineData[i].posts.length;
    }

    return {
      postsize: size
    };
  };

  // currentPostOffset 값을 업데이트한다.
  @action updateCurrentPostOffset = num => {
    this.currentPostOffset = num;
  };

  // currentPostLimit 값을 업데이트한다.
  @action updateCurrentPostLimit = num => {
    this.currentPostLimit = num;
  };

  // 코드를 받아 currentFanclubInfo를 즉시 업데이트한다.
  @action async updateInstantCurrentFanclubInfo({ code, alliances }) {
    console.log('클럽 관련 데이터 초기화 및 불러옴');

    const currentClub = await this.getOneFanclubInfo({ code: code });

    console.log(currentClub);

    if (!currentClub.data.length) return false;
    await this.updateCurrentFanclubInfo(currentClub.data[0]);

    console.log('현재 클럽 정보 : ', currentClub);

    // 동맹 클럽
    if (alliances === true) {
      const allianceData = currentClub.data[0].alliances;
      console.log('동맹정보 : ', allianceData);
      if (allianceData.length) {
        console.log('동맹정보 세팅 시작');
        const currentClubAlliance = await this.getAllCodeFanclubList({ alliances: allianceData });
        await this.updateCurrentFanclubAllianceInfo(currentClubAlliance.data);
      } else {
        console.log('동맹정보 없음으로 세팅 시작');
        this.updateCurrentFanclubAllianceInfo([]);
      }
    }

    // 타임라인 초기화
    this.currentFanclubTimeline = [];
    this.currentPostOffset = 0;

    console.log('타임라인 초기화');

    console.log('제일 중요한 클럽 코드는?? ', code);

    // Post 가져옴
    const postResult = await this.getTimelinePost({
      code: code,
      offset: 0,
      limit: 10
    });

    console.log('현재 클럽 포스트 가져옴 : ', postResult);

    return true;
  }

  // currentFanclubNowScrollTop 값을 업데이트 한다.
  @action updateCurrentFanclubNowScrollTop = value => {
    this.currentFanclubNowScrollTop = value;
  };

  // myFanclub 객체의 값을 업데이트한다.
  @action updateMyFanclub = payload => {
    const self = this;
    self.myFanclub = [];
    for (let i in payload) {
      let item = payload[i];
      self.myFanclub.push({
        imgSrc: item.thumb_image.path,
        name: item.title,
        code: item.code,
        alarms: 0,
        users: item.members.length
      });
    }
  };

  // newFanclub 객체의 값을 업데이트한다.
  @action updateNewFanclub = async payload => {
    const self = this;
    self.newFanclub = [];

    for (let i in payload) {
      let item = payload[i];

      const artist = await _.find(self.allArtistList, artist => {
        return item.artist_code === artist.code;
      });

      console.log(item.alliances);

      self.newFanclub.push({
        imgSrc: item.thumb_image.path,
        alarms: 0,
        artist: artist.name,
        code: item.code,
        name: item.title,
        ally: item.alliances.length,
        fans: item.members.length,
        createdDate: moment(item.created_date).format('YYYY-MM-DD')
      });
    }
  };

  // officialFanclub을 업데이트한다.
  @action updateOfficialFanclub = async payload => {
    const self = this;
    self.officialFanclub = [];

    for (let i in payload) {
      let item = payload[i];

      const artist = await _.find(self.allArtistList, artist => {
        return item.artist_code === artist.code;
      });

      self.officialFanclub.push({
        imgSrc: item.main_image.path,
        artist: artist.name,
        code: item.code,
        name: item.title,
        ally: item.alliances.length,
        fans: item.members.length,
        createdDate: moment(item.created_date).format('YYYY-MM-DD')
      });
    }
  };

  // userFanclub을 업데이트한다.
  @action updateUserFanclub = payload => {
    const self = this;
    self.userFanclub = [];
    console.log('아티스트 목록 :');
    console.log(self.allArtistList);
    for (let i in payload) {
      let item = payload[i];
      console.log('item : ', item);
      const artist = _.find(self.allArtistList, o => {
        return o.code === item.artist_code;
      });
      console.log('thumb_src : ', item.thumb_image.path);

      self.userFanclub.push({
        imgSrc: item.thumb_image.path,
        alarms: 0,
        code: item.code,
        artist: artist.name,
        name: item.title,
        ally: item.alliances.length,
        fans: item.members.length,
        createdDate: item.created_date
      });
    }
  };

  // 아티스트 목록을 업데이트한다.
  @action updateAllArtistList = payload => {
    const self = this;
    self.allArtistList = [];
    for (let i in payload) {
      let item = payload[i];
      self.allArtistList.push({
        code: item.code,
        name: item.name,
        eng_name: item.eng_name,
        tags: item.tags,
        created_date: item.created_date,
        modify_date: item.modify_date != undefined ? item.modify_date : null
      });
    }
  };

  /*
   * Action: Artist Server API
   */

  // 특정 아티스트 목록을 가져온다.
  @action async getArtistList({ searchWord }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getArtistList;
    return axios
      .get(`${url}?name=${searchWord}`)
      .then(r => r)
      .catch(err => err);
  }

  // 모든 아티스트 목록을 가져온다.
  @action async getAllArtistList() {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getArtistList;
    return axios
      .get(`${url}`)
      .then(r => r)
      .catch(err => err);
  }

  // 희망 아티스트 이름을 등록한다.
  @action async registerWishArtist({ name, userid, callback }) {
    // console.log(name, userid, callback);
    const url = this.API_BASE_URL + this.API_ENDPOINT.registerWishArtist;
    const result = await axios
      .post(url, { name: name, userid: userid })
      .then(r => {
        callback({ success: 'sucess', data: r.data });
      })
      .catch(err => {
        callback({ error: err });
      });
  }

  /*
   * Action: Fanclub Server API
   */

  // 클럽 이름이 중복되는지 확인
  @action checkExistedClubName({ title, artistCode }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getClubList;
    return axios
      .get(`${url}?title=${title}&artist_code=${artistCode}`)
      .then(r => r)
      .catch(err => err);
  }

  // 팬클럽을 개설한다.
  @action async createFanclub({ title, artistCode, mainImage, thumbnailImage, admin, post }) {
    console.log(title);
    const url = this.API_BASE_URL + this.API_ENDPOINT.registerFanclub;
    return axios
      .post(url, { artist_code: artistCode, title: title, admin: admin, main_image: mainImage, thumb_image: thumbnailImage, post: post })
      .then(r => r.data)
      .catch(err => err);
  }

  // 내가 만든 팬클럽 목록을 가져온다.
  @action async getMyCreateFanclubList({ userid }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getMyCreateFanclub;
    return axios
      .get(`${url}?userid=${userid}`)
      .then(r => r)
      .catch(err => err);
  }

  // 내가 속한 팬클럽 목록을 가져온다.
  @action async getMyInClubList({ userid }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getMyInClubList;
    return axios
      .get(`${url}?userid=${userid}`)
      .then(r => r)
      .catch(err => err);
  }

  // 신규 팬클럽 목록을 가져온다. (days 일 전부터 생성된 모든 클럽)
  @action async getNewFanclubList({ days }) {
    const date = Functions.getBeforeDateFromNow(100);
    const url = this.API_BASE_URL + this.API_ENDPOINT.getNewFanclub;
    return axios
      .get(`${url}?date=${date}`)
      .then(r => r)
      .catch(err => err);
  }

  // 특정 코드의 팬클럽 정보를 가져온다.
  @action async getOneFanclubInfo({ code }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getClubList;
    const newCode = code;
    return axios
      .get(`${url}?code=${newCode}`)
      .then(r => r)
      .catch(err => err);
  }

  // 복수 코드로 OR 처리하여 팬클럽 정보를 모두 가져온다.
  @action async getAllCodeFanclubList({ alliances }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getClubList;
    console.log('alliances : ', encodeURI(alliances.join('**')));
    return axios
      .get(`${url}?alliances=${encodeURI(alliances.join('**'))}`)
      .then(r => r)
      .catch(err => err);
  }

  // 오피셜 팬클럽 정보를 가져온다.
  @action async getOfficialClub() {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getClubList;
    return axios
      .get(`${url}?official=true`)
      .then(r => r)
      .catch(err => err);
  }

  // 사용자 팬클럽(오피셜 팬클럽 제외) 정보를 가져온다.
  @action async getUserFanclubList() {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getClubList;
    return axios
      .get(`${url}?official=false`)
      .then(r => r)
      .catch(err => err);
  }

  // 팬클럽 가입 신청을 한다.
  @action async applyFanclub({ code, userid }) {
    console.log('가입 신청 : ', code, userid);
    const url = this.API_BASE_URL + this.API_ENDPOINT.applyFanclub;
    return axios
      .post(url, { code: code, userid: userid })
      .then(r => r)
      .catch(err => err);
  }

  // 팬클럽 가입 허가하거나 거절한다.
  @action async acceptFanclub({ code, userid, action }) {
    console.log('가입 허가, 거절 : ', code, userid, action);
    const url = this.API_BASE_URL + this.API_ENDPOINT.acceptFanclub;
    return axios
      .post(url, { code: code, userid: userid, action: action })
      .then(r => r)
      .catch(err => err);
  }

  /*
   * Action: File Upload API
   */

  // 이미지를 업로드한다.
  @action async uloadFiles({ formData }) {
    const self = this;
    const url = this.IMAGE_SERVER_URL + this.API_ENDPOINT.fileUpload;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Auth-Token': this.API_TOKEN
      }
    };
    return axios
      .post(url, formData, config)
      .then(r => r.data)
      .catch(err => {
        alert(self.CONNECT_ERROR_MSG);
        return { error: err };
      });
  }

  /*
   * Action: Post Server API
   */

  // 글을 등록한다.
  @action async registerPost(obj) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.registerPost;
    return axios
      .post(`${url}`, obj)
      .then(r => r)
      .catch(err => err);
  }

  // 글을 수정한다.
  @action async modifyPost(obj) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.modifyPost;
    return axios
      .post(`${url}`, obj)
      .then(r => r)
      .catch(err => err);
  }

  // 글을 가져온다.
  @action async getPostList({ code, offset, limit }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getPostList;
    return axios
      .get(`${url}?code=${code}&offset=${offset}&limit=${limit}`)
      .then(r => r)
      .catch(err => err);
  }

  // 글을 삭제한다.
  @action async deletePost({ code, _id }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.deletePost;
    return axios
      .post(url, { code: code, _id: _id })
      .then(r => r)
      .catch(err => err);
  }

  // 글에 좋아요, 싫어요를 누른다.
  @action async setPostInterest(obj) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.setPostInterest;
    return axios
      .post(url, obj)
      .then(r => r)
      .catch(err => err);
  }

  /*
   * Action: User API
   */

  // 유저 정보 가져오기 (_id, userids)
  @action async getUserInfo({ _id, userid, userids }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.getUserInfo;

    let query = '';

    if (_id != undefined) query += `_id=${_id}`;
    if (userid != undefined) query += `userid=${userid}`;
    if (userids != undefined) query += `&userids=${userids}`;

    return axios
      .get(`${url}?${query}`)
      .then(r => r)
      .catch(err => err);
  }

  /*
   * Action: Push API
   */

  // 유저에게 푸시 보내기
  @action async pushNotify({ userid, targetid, title, message, params }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.pushNotification;
    return axios
      .post(url, {
        userid: userid,
        targetid: targetid,
        title: title,
        message: message,
        params: JSON.stringify(params)
      })
      .then(r => r)
      .catch(err => err);
  }

  /*
   * Action: capture API
   */

  // 유투브 링크 검증하기
  @action async verifyYoutubeLink({ link }) {
    const url = this.API_BASE_URL + this.API_ENDPOINT.verifyYoutubeLink;
    return axios
      .get(`${url}?link=${link}`)
      .then(r => r)
      .catch(err => err);
  }
}
