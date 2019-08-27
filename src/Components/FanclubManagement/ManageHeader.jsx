import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';

@inject('store')
@observer
export default class ManageHeader extends Component {
  static propTypes = {
    store: PropTypes.any,
    changeCurrentMenu: PropTypes.any
  };

  @observable menu = 'member';

  @observable menuArray = [
    { menu: 'member', title: '회원관리' },
    { menu: 'shop', title: '샵 관리' },
    { menu: 'ally', title: '제휴관리' },
    // { menu: 'notice', title: '공지관리' },
    { menu: 'calendar', title: '일정관리' }
  ];

  @action changeMenu = menu => {
    this.menu = menu;
    this.props.changeCurrentMenu(menu);
  };

  render() {
    return (
      <header className="manage-menu">
        {this.menuArray.map(item => (
          <button key={item.menu} className={'manage-menu-button ' + (this.menu === item.menu && 'active')} onClick={() => this.changeMenu(item.menu)}>
            <i className={'manage-menu-ico manage-menu-ico-' + item.menu}></i>
            <span className="manage-menu-text">{item.title}</span>
          </button>
        ))}
      </header>
    );
  }
}
