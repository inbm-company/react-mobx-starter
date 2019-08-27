import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import Views from 'Routers';
import ApplyItem from 'Components/FanclubManagement/ManageMember/ApplyItem';

@inject('store')
@observer
export default class ApplyLayer extends Component {
  static propTypes = {
    store: PropTypes.any,
    closeApplyLayer: PropTypes.any,
    members: PropTypes.any
  };

  @action goBack = () => {
    this.props.closeApplyLayer();
  };

  render() {
    const members = this.props.members;

    console.group('승인요청 레이어');
    console.log(members);
    console.groupEnd();

    return (
      <div className="fanclub-member-container">
        <div className="fanclub-create-container">
          <header className="view-page-header">
            <div className="view-page-wrapper">
              <button className="view-page-icon prev-button" onClick={this.goBack}></button>
              <h1 className="view-page-text">승인 요청</h1>
            </div>
            <div className="view-page-content">{/* {searchFlag && <button className="view-page-icon search-button" onClick={() => goTo(Views.search, {}, store)}></button>} */}</div>
          </header>
        </div>
        {members.length > 0 && (
          <div className="fanclub-member-list-wrapper">
            {members.map((member, index) => (
              <ApplyItem key={index} member={member} />
            ))}
          </div>
        )}
        {members.length === 0 && <div className="no-data type3">승인 요청한 회원이 없습니다.</div>}
      </div>
    );
  }
}
