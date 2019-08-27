import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import Functions from 'Functions/Common.js';
import Views from 'Routers';

@inject('store')
@observer
export default class ViewPageHeader extends Component {
  static propTypes = {
    store: PropTypes.any,
    title: PropTypes.any,
    searchFlag: PropTypes.any,
    settingFlag: PropTypes.any
  };

  @observable fanclubFlag = false;

  @action goBack = () => {
    const currentRoute = this.props.store.router.currentView.path,
      store = this.props.store,
      goTo = this.props.store.router.goTo;

    if (this.fanclubFlag) {
      goTo(Views.home, {}, store);
    } else {
      Functions.goBack();
    }
  };

  componentDidMount() {
    const currentRoute = this.props.store.router.currentView.path;
    switch (currentRoute) {
      case '/now':
      case '/member':
      case '/fanshop':
      case '/drive':
      case '/single':
        this.fanclubFlag = true;
        break;
    }
  }

  render() {
    const { store } = this.props;
    const { fanclubStore } = store;
    const clubInfo = fanclubStore.currentFanclubInfo;
    const userInfo = fanclubStore.USER_INFO;
    const title = this.props.title;
    const searchFlag = this.props.searchFlag;
    const settingFlag = this.props.settingFlag;
    const {
      router: { goTo }
    } = store;

    let isAdminFlag = false;

    if (clubInfo.administrator === userInfo.userid) isAdminFlag = true;

    return (
      <div className="fanclub-create-container">
        <header className="view-page-header">
          <div className="view-page-wrapper">
            <button className="view-page-icon prev-button" onClick={this.goBack}></button>
            <h1 className="view-page-text">{title}</h1>
          </div>
          <div className="view-page-content">
            {searchFlag && <button className="view-page-icon search-button" onClick={() => goTo(Views.search, {}, store)}></button>}
            {settingFlag && isAdminFlag && <button className="view-page-icon setting-button" onClick={() => goTo(Views.management, {}, store)}></button>}
          </div>
        </header>
      </div>
    );
  }
}
