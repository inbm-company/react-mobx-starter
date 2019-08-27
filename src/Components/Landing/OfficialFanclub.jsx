import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import OfficialFanclubItem from 'Components/Landing/OfficialFanclubItem';

@inject('store')
@observer
export default class Header extends Component {
  static propTypes = {
    store: PropTypes.any
  };
  render() {
    const { fanclubStore } = this.props.store;
    return (
      <section className="official-fanclub-section">
        <div className="section-inner-wrap">
          <div className="section-tit">
            <h2 className="st">공식 팬클럽</h2>
            {/* <a href="#" className="see-all">
              전체보기
            </a> */}
          </div>
          <div className="list-type4">
            {fanclubStore.officialFanclub.map(item => (
              <OfficialFanclubItem key={item.name} info={item} />
            ))}
          </div>
        </div>
      </section>
    );
  }
}
