import React from 'react';
import { Route } from 'mobx-router';
import Landing from 'Components/Landing';
import FanclubCreate from 'Components/FanclubCreate';
import FanclubNow from 'Components/FanclubNow';
import FanclubMember from 'Components/FanclubMember';
import FanclubShop from 'Components/FanclubShop';
import FanDrive from 'Components/FanDrive';
import FanclubSingle from 'Components/FanclubSingle';
import FanclubWrite from 'Components/FanclubWrite';
import FanclubModify from 'Components/FanclubWrite/Modify';
import FanclubManagement from 'Components/FanclubManagement';
import CommonSearch from 'Components/CommonSearch';
import FanboardChart from 'Components/FanboardChart';

const views = {
  home: new Route({
    path: '/',
    onEnter: async (route, params, store) => {
      console.log('enter: Landing');
    },
    beforeExit: () => {
      console.log('exit: Landing');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    },
    component: <Landing />
  }),
  create: new Route({
    path: '/create',
    component: <FanclubCreate />,
    onEnter: () => {
      console.log('enter: create');
    },
    beforeExit: () => {
      console.log('exit: create');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  clubHome: new Route({
    path: '/now',
    component: <FanclubNow />,
    onEnter: async (route, params, store) => {
      const { fanclubStore } = store;
      const { goTo } = store.router;

      console.group('HOME:');
      console.log(fanclubStore.currentFanclubInfo.code);
      console.groupEnd();
      if (fanclubStore.currentFanclubInfo.code === undefined) {
        goTo(views.home, {}, store);
      }
    },
    beforeExit: () => {
      console.log('exit: FanclubNow');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  member: new Route({
    path: '/member',
    component: <FanclubMember />,
    onEnter: () => {
      console.log('enter: FanclubMember');
    },
    beforeExit: () => {
      console.log('exit: FanclubMember');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  fanshop: new Route({
    path: '/fanshop',
    component: <FanclubShop />,
    onEnter: () => {
      console.log('enter: FanclubShop');
    },
    beforeExit: () => {
      console.log('exit: FanclubShop');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  drive: new Route({
    path: '/drive',
    component: <FanDrive />,
    onEnter: () => {
      console.log('enter: FanDrive');
    },
    beforeExit: () => {
      console.log('exit: FanDrive');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  single: new Route({
    path: '/single',
    component: <FanclubSingle />,
    onEnter: () => {
      console.log('enter: FanclubSingle');
    },
    beforeExit: () => {
      console.log('exit: FanclubSingle');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  write: new Route({
    path: '/write',
    component: <FanclubWrite />,
    onEnter: () => {
      console.log('enter: FanclubWrite');
    },
    beforeExit: () => {
      console.log('exit: FanclubWrite');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  modify: new Route({
    path: '/modify',
    component: <FanclubModify />,
    onEnter: () => {
      console.log('enter: Post Modify');
    },
    beforeExit: () => {
      console.log('exit: Post Modify');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  search: new Route({
    path: '/search',
    component: <CommonSearch />,
    onEnter: () => {
      console.log('enter: CommonSearch');
    },
    beforeExit: () => {
      console.log('exit: CommonSearch');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  management: new Route({
    path: '/management',
    component: <FanclubManagement />,
    onEnter: (route, params, store) => {
      const { USER_INFO, currentFanclubInfo } = store.fanclubStore;

      console.group('enter: FanclubManagement');
      console.log(USER_INFO);
      console.log(currentFanclubInfo);
      console.groupEnd();
      if (USER_INFO.userid != currentFanclubInfo.administrator) history.back();
    },
    beforeExit: () => {
      console.log('exit: FanclubManagement');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  fanboardChart: new Route({
    path: '/chart',
    component: <FanboardChart />,
    onEnter: () => {
      console.log('enter: FanboardChart');
    },
    beforeExit: () => {
      console.log('exit: FanboardChart');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  })
};

export default views;
