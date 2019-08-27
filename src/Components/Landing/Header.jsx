import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import Views from 'Routers';

@inject('store')
@observer
export default class Header extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @action logout = () => {
    localStorage.removeItem('auth-token');
    location.reload();
  };

  render() {
    const { store } = this.props;
    const {
      router: { goTo }
    } = store;

    const { fanclubStore } = this.props.store;

    return (
      <header className="page-header">
        {fanclubStore.WEB_DIRECT_LOGIN === true && (
          <div className="temp-logout">
            <button type="button" onClick={this.logout}>
              로그아웃
            </button>
          </div>
        )}
        <div className="section-tit">
          <h2 className="pt">팬클럽</h2>

          <button type="button" className="btn-search" onClick={() => goTo(Views.search, {}, store)}>
            Search
          </button>
        </div>
      </header>
    );
  }
}
