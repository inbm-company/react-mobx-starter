import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'mobx-router';
import Views from 'Routers';

@inject('store')
@observer
export default class FanclubNavigation extends Component {
  static propTypes = {
    store: PropTypes.any,
    route: PropTypes.any
  };

  render() {
    const { store } = this.props,
      route = this.props.route ? this.props.route : '';

    return (
      <ul className="fc-o-nav">
        <li className="home">
          <Link view={Views.clubHome} store={store} className={route === 'now' ? 'active' : ''}>
            NOW!
          </Link>
        </li>
        <li className="members">
          <Link view={Views.member} store={store} className={route === 'member' ? 'active' : ''}>
            회원목록
          </Link>
        </li>
        <li className="fanclub-shop">
          <Link view={Views.fanshop} store={store} className={route === 'shop' ? 'active' : ''}>
            팬클럽샵
          </Link>
        </li>
        <li className="fandrive">
          <Link view={Views.drive} store={store} className={route === 'drive' ? 'active' : ''}>
            드라이브
          </Link>
        </li>
        <li className="single">
          <Link view={Views.single} store={store} className={route === 'single' ? 'active' : ''}>
            싱글
          </Link>
        </li>
      </ul>
    );
  }
}
