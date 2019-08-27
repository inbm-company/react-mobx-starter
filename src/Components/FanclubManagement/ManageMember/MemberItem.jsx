import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import moment from 'moment';
import _ from 'lodash';

@inject('store')
@observer
export default class MemberItem extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  @action openProfile = (event, user) => {
    event.preventDefault();

    const { fanclubStore } = this.props.store;

    fanclubStore.updateProfileLayerInfo({
      type: 'clubmember',
      info: user
    });
    fanclubStore.updateProfileLayerOpen(true);
  };

  componentDidMount() {}

  render() {
    const { fanclubStore } = this.props.store;
    const clubInfo = fanclubStore.currentFanclubInfo;
    const { info } = this.props;

    console.log('개별 회원 정보');
    console.log(info);

    const thisClub = _.find(info.fanclubs, o => {
      return o.fc_code === clubInfo.code;
    });

    const date = moment(thisClub.fc_joining_date).format('YYYY-MM-DD');

    return (
      <div className="fanclub-member-list">
        <div className="fanclub-member-list-inforamtion" onClick={() => this.openProfile(event, info)}>
          <span className="default-photo">{info.user_photo != '' && <img src={`${fanclubStore.IMAGE_SERVER_URL}/${info.user_photo}`} alt="" />}</span>
          <div className="fanclub-member-list-status">
            <div className="fanclub-member-list-name-wrapper">
              <span className="fanclub-member-list-name">
                {info.user_nickname != '' && <strong className="user-name">{info.user_nickname}</strong>}
                {info.user_nickname === '' && <strong className="user-name">{info.userid}</strong>}
              </span>
              {/* <i className="fanclub-member-list-name-ico fanclub-member-list-name-ico-birthday"></i> */}
            </div>
            {info.status_msg && info.status != '' && <p className="fanclub-member-list-comment">{info.status_msg}</p>}
          </div>
        </div>
        <p className="fanclub-member-date">{date}</p>
      </div>
    );
  }
}
