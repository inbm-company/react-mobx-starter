import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import TimeLineImage from './TimeLineImage';
import TimeLineText from './TimeLineText';
import TimeLineCalendar from './TimeLineCalendar';
import TimeLineLink from './TimeLineLink';
import TimeLineNotice from './TimeLineNotice';
import TimeLineVideo from './TimeLineVideo';
import TimeLineVote from './TimeLineVote';
import Views from 'Routers';
import Moment from 'react-moment';
import moment from 'moment';
import _ from 'lodash';

@inject('store')
@observer
export default class TimeLineContainer extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @observable today = moment(Date.now()).format('YYYYMD');
  @observable canPostFlag = false;

  @action getDate = date => {
    return moment(date).format('YYYYMD');
  };

  @action goWrite = () => {
    const { store } = this.props;
    const { goTo } = this.props.store.router;

    goTo(Views.write, {}, store);
  };

  componentDidMount() {
    const { fanclubStore } = this.props.store;

    const members = fanclubStore.currentFanclubInfo.members,
      userid = fanclubStore.USER_INFO.userid;

    const existFlag = _.find(members, item => {
      return item === userid;
    });

    console.log(existFlag);

    if (existFlag) this.canPostFlag = true;
  }

  render() {
    const { fanclubStore } = this.props.store;

    return (
      <div className="timeline-container">
        {fanclubStore.currentFanclubTimeline.map((item, index) => (
          <section key={index} className="timeline-section">
            <div className="timeline-wrap">
              <article className="day-title">
                <div className={'day-inner-wrap ' + (this.getDate(item.date) === this.today ? 'today' : '')}>
                  <h2 className="day">{this.getDate(item.date) === this.today ? '오늘' : <Moment format="M월 D일">{item.date}</Moment>}</h2>
                </div>
              </article>
              {item.posts.map((timeline, tIndex) => (
                <div key={tIndex} className="timeline-item">
                  {timeline.type === '1' && <TimeLineNotice key={tIndex} info={timeline} />}
                  {timeline.type === '2' && <TimeLineCalendar key={tIndex} info={timeline} />}
                  {timeline.type === '3' && <TimeLineText key={tIndex} info={timeline} />}
                  {timeline.type === '4' && <TimeLineImage key={tIndex} info={timeline} />}
                  {timeline.type === '5' && <TimeLineVideo key={tIndex} info={timeline} />}
                  {timeline.type === '6' && <TimeLineVote key={tIndex} info={timeline} />}
                  {timeline.type === '7' && <TimeLineLink key={tIndex} info={timeline} />}
                </div>
              ))}
            </div>
          </section>
        ))}
        {this.canPostFlag && <button className="fixed-post-button" onClick={this.goWrite}></button>}
      </div>
    );
  }
}
