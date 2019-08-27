import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { action, observable } from 'mobx';
import PropTypes from 'prop-types';
import Loader from 'Components/Common/Loader';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import TopArtist from 'Components/FanclubCreate/TopArtist';
import SearchResult from 'Components/FanclubCreate/SearchResult';
import ClubCreate from 'Components/FanclubCreate/ClubCreate';
import Functions from 'Functions/Common.js';

@inject('store')
@observer
export default class FanclubCreate extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @observable searchWord = '';
  @observable searchDoingFlag = false;
  @observable searchResultList = [];
  @observable loadingFlag = false;
  @observable createDoingFlag = false;
  @observable artistItem = null;

  @observable pending = false;

  @action.bound
  onChange(event) {
    const { name, value } = event.target;
    this[name] = Functions.trim(value);

    if (this.searchWord === '') {
      this.searchResultList = [];
      this.searchDoingFlag = false;
    } else {
      this.searchDoingFlag = true;
    }

    this.nowSearching();
  }

  @action nowSearching = async () => {
    const self = this;
    const { fanclubStore } = this.props.store;

    const result = await fanclubStore.getArtistList({
      searchWord: this.searchWord
    });
    if (result.status === 200) self.searchResultList = result.data;
  };

  @action changeLoadingFlag = flag => {
    this.loadingFlag = flag;
  };

  @action setReset = () => {
    this.searchWord = '';
    this.searchDoingFlag = false;
  };

  @action selectArtist = item => {
    console.log('item :');
    console.log(item);
    this.artistItem = item;
    this.createDoingFlag = true;
  };

  render() {
    const { fanclubStore } = this.props.store;
    return (
      <div className="fanclub-create-container">
        <Loader loadingFlag={this.loadingFlag} />
        <ViewPageHedaer title={'팬클럽 만들기'} searchFlag={false} settingFlag={false} />

        <div className="fc-mid-content">
          <div className="name-input-section" style={{ display: this.createDoingFlag ? 'none' : 'flex' }}>
            <div className="inp-wrap">
              <input type="text" onChange={this.onChange} name="searchWord" className="inp" placeholder="대상 아티스트 이름을 입력하세요." />
            </div>
            <button type="button" className="btn-search2" onClick={this.nowSearching}>
              Search
            </button>
          </div>

          <div style={{ display: this.createDoingFlag ? 'none' : 'block' }}>
            <TopArtist isHidden={this.searchDoingFlag} />
            <SearchResult
              isHidden={this.searchDoingFlag}
              searchWord={this.searchWord}
              searchResultList={this.searchResultList}
              changeLoadingFlag={this.changeLoadingFlag}
              setReset={this.setReset}
              selectArtist={this.selectArtist}
            />
          </div>
          <ClubCreate createDoingFlag={this.createDoingFlag} artistItem={this.artistItem} changeLoadingFlag={this.changeLoadingFlag} />
        </div>

        <div className="fc-foot-wanring">
          <p>팬클럽은 팬과 아티스트 사이의 관계를 형성하고 새로운 커뮤니케이션을 위한 의미있는 만남입니다. 신중하게 만드시고 소중하게 키워주시기 바랍니다.</p>
        </div>
      </div>
    );
  }
}
