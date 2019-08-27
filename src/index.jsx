import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { RouterStore, startRouter } from 'mobx-router';
import Views from 'Routers';
import FanclubStore from './Store/fanclub';
import App from './App';
import axios from 'axios';

// Styles
import 'Assets/styles/base.scss';
import 'Assets/styles/style.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';

const store = {
  router: new RouterStore(),
  fanclubStore: new FanclubStore()
};

// 기본 세팅
const { fanclubStore } = store;
if (process.env.NODE_ENV === 'development') {
  //fanclubStore.updateDevelopmentSetting();
}

// 새로고침 Club Code 확인
const currentClubCode = localStorage.getItem('clubCode');

const renderApp = () => {
  startRouter(Views, store);

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app-container')
  );
};

// 로컬저장소에 현재 클럽 코드가 있다면 클럽 정보를 받아와 store에 저장함
const codeCheck = async () => {
  const page = localStorage.getItem('CPAGE');

  console.log('CPAGE : ', page);

  if (page != null) {
    if (page === 'friendlist') fanclubStore.updateFriendListLayerOpen(true);
  }

  if (currentClubCode != null) {
    const result = await fanclubStore.updateInstantCurrentFanclubInfo({
      code: currentClubCode,
      alliances: true
    });

    renderApp();
  } else {
    renderApp();
  }
};

const userLogin = (id, pw) => {
  const url = store.fanclubStore.API_BASE_URL + store.fanclubStore.API_ENDPOINT.login;
  return axios
    .post(url, { userid: id, password: pw })
    .then(r => r)
    .catch(err => err);
};

const basicSetting = async () => {
  let token = '';

  if (window.android != undefined) {
    token = await window.android.getToken();
    if (token != '') store.fanclubStore.updateUSER_LOGIN_FLAG(true);

    axios.defaults.headers.common['Auth-Token'] = token; // for all requests
    const result = await fanclubStore.setBasicUserInfo(token);
    if (result) codeCheck();
  } else {
    const storageToken = localStorage.getItem('auth-token');

    if (!storageToken) {
      const userid = prompt('ID를 입력해주세요.');
      const password = prompt('Password를 입력해주세요.');

      if (userid === null || password === null || userid === '' || password === '') {
        location.reload();
        return false;
      }

      console.log(userid, password);

      const result = await userLogin(userid, password);

      console.log('result : ', result);

      if (result.data.error != undefined || result.status != 200) {
        location.reload();
      } else {
        token = result.headers['auth-token'];
      }
    } else {
      token = storageToken;
    }

    store.fanclubStore.updateWEB_DIRECT_LOGIN(true);
    axios.defaults.headers.common['Auth-Token'] = token; // for all requests
    const result = await fanclubStore.setBasicUserInfo(token);
    if (result) codeCheck();
  }
};

// 친구 목록으로 전환
window.gotoFriendList = async () => {
  const { fanclubStore } = store;
  fanclubStore.updateFriendListLayerOpen(true);
  localStorage.setItem('CPAGE', 'friendlist');
};

// 팬클럽으로 전환
window.gotoClubHome = async () => {
  const { fanclubStore, router } = store;
  const { goTo } = router;

  fanclubStore.updateFriendListLayerOpen(false);
  localStorage.setItem('CPAGE', 'fanclub');
};

// 특정 팬클럽으로 이동
window.gotoSomeClub = async code => {
  const { fanclubStore, router } = store;
  const { goTo } = router;

  fanclubStore.updateFriendListLayerOpen(false);
  localStorage.setItem('CPAGE', 'fanclub');

  const result = await fanclubStore.updateInstantCurrentFanclubInfo({
    code: code,
    alliances: true
  });
  if (result) goTo(Views.clubHome, {}, store);
};

// 프로필 화면으로 이동
window.gotoProfileSetting = async () => {
  const { fanclubStore } = store;

  localStorage.setItem('CPAGE', 'profile');
};

// 로컬스토레이지 삭제
window.clearStorage = () => {
  localStorage.removeItem('CPAGE');
  localStorage.removeItem('auth-token');
  localStorage.removeItem('clubCode');
};

// 앱 실행
basicSetting();
