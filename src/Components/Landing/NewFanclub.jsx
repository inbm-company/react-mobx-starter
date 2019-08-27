import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import FanclubItem from 'Components/Landing/FanclubItem';

@inject('store')
@observer
export default class NewFanclub extends Component {
  static propTypes = {
    store: PropTypes.any
  };
  render() {
    const { fanclubStore } = this.props.store;
    return (
      <section className="new-fanclub-section">
        <div className="section-inner-wrap">
          <div className="section-tit">
            <h2 className="st">신규 팬클럽</h2>
          </div>
          <div className="list-type3">
            {fanclubStore.newFanclub.map(item => (
              <FanclubItem key={item.name} info={item} />
            ))}
          </div>
        </div>
      </section>
    );
  }
}
