import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import ArtistLiveItem from 'Components/Landing/ArtistLiveItem';
import PerfectScrollbar from 'react-perfect-scrollbar';

@inject('store')
@observer
export default class ArtistLive extends Component {
  static propTypes = {
    store: PropTypes.any
  };
  render() {
    const { fanclubStore } = this.props.store;

    return (
      <section className="artist-live-section">
        <div className="section-inner-wrap bt">
          <div className="section-tit">
            <h2 className="st">아티스트 라이브 방송</h2>
          </div>
          <PerfectScrollbar className="scroll-horizontal-container">
            <div className="list-type2" style={{ width: '900px' }}>
              {fanclubStore.artistLive.map((item, index) => (
                <ArtistLiveItem key={item.name + index} info={item} />
              ))}
            </div>
          </PerfectScrollbar>
        </div>
      </section>
    );
  }
}
