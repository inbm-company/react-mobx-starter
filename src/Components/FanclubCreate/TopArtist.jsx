import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';

@inject('store')
@observer
export default class TopArtist extends Component {
  static propTypes = {
    store: PropTypes.any,
    isHidden: PropTypes.any,
    createDoing: PropTypes.any
  };

  @observable display = 'block';

  @action changeDisplay = state => {
    if (state) this.display = 'none';
    else this.display = 'block';
  };

  componentWillReceiveProps(nextProps) {
    this.changeDisplay(nextProps.isHidden);
  }

  render() {
    const { fanclubStore } = this.props.store;

    return (
      <div className="fanclub-top20-section" style={{ display: this.display }}>
        {this.isHidden}
        <h2 className="ft-tit">Top 20 팬클럽 아티스트</h2>
        <ul className="list">
          {fanclubStore.top20Artist.map((item, index) => (
            <li key={item.name + index}>
              <a href="#">
                {item.name} {item.engName}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
