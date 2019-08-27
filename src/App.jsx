import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { MobxRouter } from 'mobx-router';
import axios from 'axios';
import MessageWindow from 'Components/Common/MessageWindow';
import FileUploadWindow from 'Components/Common/FileUploadWindow';
import PreviewFanclub from 'Components/Common/PreviewFanclub';
import FriendList from 'Components/FriendList';
import ProfileLayer from 'Components/Common/ProfileLayer';
import Loader from 'Components/Common/Loader';

@inject('store')
@observer
export default class App extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  componentWillMount() {}
  componentDidMount() {
    const { fanclubStore } = this.props.store;
    // setTimeout(() => {
    //   fanclubStore.updateFriendListLayerOpen(true);
    // }, 3000);
  }
  render() {
    const { store } = this.props;
    const { fanclubStore } = store;

    return (
      <div className="fanclub-container">
        <div className="router-container" style={{ display: fanclubStore.friendListLayerOpen ? 'none' : 'block' }}>
          <MobxRouter />
        </div>
        <MessageWindow />
        <FileUploadWindow />
        <PreviewFanclub />
        <div className="friend-router-container" style={{ display: fanclubStore.friendListLayerOpen ? 'block' : 'none' }}>
          <FriendList />
        </div>
        {fanclubStore.profileLayerOpen && <ProfileLayer />}
        <Loader loadingFlag={fanclubStore.loadingBgOpen} />
      </div>
    );
  }
}
