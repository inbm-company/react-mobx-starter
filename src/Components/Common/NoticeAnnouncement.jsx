import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('store')
@observer
export default class NoticeAnnouncement extends Component {
  static propTypes = {
    fanclubStore: PropTypes.any,
    type: PropTypes.any
  };

  render() {
    const { fanclubStore } = this.props,
      type = this.props.type ? this.props.type : '';

    return (
      <div className={'notice-announcement ' + type}>
        <a href="#" className="notice-txt">
          <span>[공지] 굿즈 구입시 불법 스캔본을 되파는 경우 엄정히 대처합니다aaaaaaaaaaaaaaaaaaa</span>
        </a>
      </div>
    );
  }
}
