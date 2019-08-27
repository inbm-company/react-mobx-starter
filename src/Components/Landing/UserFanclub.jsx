import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import FanclubItem from 'Components/Landing/FanclubItem';

@inject('store')
@observer
export default class Header extends Component {
  static propTypes = {
    store: PropTypes.any
  };
  render() {
    const { fanclubStore } = this.props.store;
    return (
      <section className="user-fanclub-section">
        <div className="section-inner-wrap">
          <div className="section-tit">
            <h2 className="st">사용자 팬클럽</h2>
            {/* {fanclubStore.userFanclub.length > 0 && (
              <a href="#" className="see-all">
                전체보기
              </a>
            )} */}
          </div>
          <div className="list-type3">
            {fanclubStore.userFanclub.map(item => (
              <FanclubItem key={item.name} info={item} />
            ))}
          </div>
          {fanclubStore.userFanclub.length === 0 && <div className="no-data type1">사용자 팬클럽이 없습니다.</div>}
        </div>
      </section>
    );
  }
}
