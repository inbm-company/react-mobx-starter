import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';

@inject('store')
@observer
export default class FileUploadWindow extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @action getCamera = () => {
    const { fanclubStore } = this.props.store;

    // window.android.goCamera({
    //   callback(res) {
    //     fanclubStore.fuWindow.callback(res);
    //   }
    // });
    fanclubStore.fuWindow.callback('callback success!');
  };

  @action getAlbum = () => {
    const { fanclubStore } = this.props.store;

    // window.android.goCamera({
    //   callback(res) {
    //     fanclubStore.fuWindow.callback(res);
    //   }
    // });
    fanclubStore.fuWindow.callback('callback success!');
  };

  @action goCancel = () => {
    const { fanclubStore } = this.props.store;
    fanclubStore.fuWindow.close();
  };

  render() {
    const { fanclubStore } = this.props.store;

    return (
      <div className="module-file-upload" style={{ display: fanclubStore.fuWindowOpen === 'true' ? 'block' : 'none' }}>
        <div className={'mf-inner-wrap ' + (fanclubStore.fuWindowOpen === 'true' ? 'active' : '')}>
          <div className="mf-btns">
            <p className="line">
              <button type="button" className="from-camera" onClick={this.getCamera}>
                촬영하기
              </button>
            </p>
            <p className="line">
              <button type="button" className="from-album" onClick={this.getAlbum}>
                앨범에서 가져오기
              </button>
            </p>
          </div>
          <button type="button" className="b-cancel" onClick={this.goCancel}>
            취소
          </button>
        </div>
      </div>
    );
  }
}
