import React from 'react';
import { Route } from 'mobx-router';
import Main from 'Components/Main';
import Intro from 'Components/Intro';

const views = {
  home: new Route({
    path: '/',
    onEnter: async (route, params, store) => {
      console.log('enter: home Landing');
    },
    beforeExit: () => {
      console.log('exit: home Landing');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    },
    component: <Main />
  }),
  intro: new Route({
    path: '/intro',
    onEnter: async (route, params, store) => {
      console.log('enter: intro');
    },
    beforeExit: () => {
      console.log('exit: intro');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    },
    component: <Intro />
  })
};

export default views;
