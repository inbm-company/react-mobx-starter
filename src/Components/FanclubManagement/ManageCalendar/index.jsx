import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import ViewPageHedaer from 'Components/Common/ViewPageHeader';
import Views from 'Routers';
import PerfectScrollbar from 'react-perfect-scrollbar';

@inject('store')
@observer
export default class FanclubNow extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  render() {
    return (
      <div className="calendar-manage-container">
        <div className="timeline-section-alter1">
          <div className="timeline-calendar-text">다가오는 일정</div>

          <PerfectScrollbar className="scroll-horizontal-container">
            <div className="calendar-coming-wrapper" style={{ width: '700px' }}>
              <button className="calendar-add-button">+</button>
              <span className="calendar-comming">JTBC 아는 형님 출연</span>
              <span className="calendar-comming">가나 초콜렛 광고</span>
              <span className="calendar-comming">가나 초콜렛 광고</span>
            </div>
          </PerfectScrollbar>
        </div>
        <div className="timeline-section-alter1 ">
          <div className="timeline-calendar-text">오늘의 일정</div>
          <div className="timeline-calendar-wrapper">
            <p className="timeline-calendar">
              <span className="timeline-calendar-location-wrapper timeline-calendar-location-wrapper-alter">
                <span className="timeline-dot"></span>
                <span className="timeline-calendar-title">팬클럽 정기 모임</span>
                <span>-</span> <span className="timeline-calendar-loaction">경복궁</span>
              </span>
              <span className="timeline-calendar-date-wrapper">
                <span className="timeline-calendar-date">8월 12일 </span>
                <span className="timeline-calendar-time">10:00~13:00</span>
              </span>
            </p>

            <p className="timeline-calendar">
              <span className="timeline-calendar-location-wrapper timeline-calendar-location-wrapper-alter">
                <span className="timeline-dot"></span>
                <span className="timeline-calendar-title">팬클럽 정기 모임</span>
                <span>-</span> <span className="timeline-calendar-loaction">경복궁</span>
              </span>
              <span className="timeline-calendar-date-wrapper">
                <span className="timeline-calendar-date">8월 12일 </span>
                <span className="timeline-calendar-time">10:00~13:00</span>
              </span>
            </p>

            <p className="timeline-calendar">
              <span className="timeline-calendar-location-wrapper timeline-calendar-location-wrapper-alter">
                <span className="timeline-dot"></span>
                <span className="timeline-calendar-title">팬클럽 정기 모임</span>
                <span>-</span> <span className="timeline-calendar-loaction">경복궁</span>
              </span>
              <span className="timeline-calendar-date-wrapper">
                <span className="timeline-calendar-date">8월 12일</span>
                <span className="timeline-calendar-time">10:00~13:00</span>
              </span>
            </p>
          </div>
        </div>

        <div className="timeline-section timeline-section-alter1 timeline-section-alter2">
          <div className="timeline-calendar-last-wrapper">
            <div className="timeline-calendar-text">지난 일정</div>
            <div className="timeline-calendar-month">5월</div>
            <div className="timeline-calendar-wrapper">
              <p className="timeline-calendar timeline-calendar-alter">
                <span className="timeline-calendar-location-wrapper">
                  <span className="timeline-dot timeline-dot-gray"></span>
                  <span className="timeline-calendar-title">팬클럽 정기 모임</span>
                  <span>-</span> <span className="timeline-calendar-loaction">경복궁</span>
                </span>
                <span className="timeline-calendar-date-wrapper">
                  <span className="timeline-calendar-date">8월 12일 </span>
                  <span className="timeline-calendar-time">10:00~13:00</span>
                </span>
              </p>
              <p className="timeline-calendar timeline-calendar-alter">
                <span className="timeline-calendar-location-wrapper">
                  <span className="timeline-dot timeline-dot-gray"></span>
                  <span className="timeline-calendar-title">팬클럽 정기 모임</span>
                  <span>-</span> <span className="timeline-calendar-loaction">경복궁</span>
                </span>
                <span className="timeline-calendar-date-wrapper">
                  <span className="timeline-calendar-date">8월 12일 </span>
                  <span className="timeline-calendar-time">10:00~13:00</span>
                </span>
              </p>
            </div>
          </div>

          <div className="timeline-calendar-last-wrapper">
            <div className="timeline-calendar-month">5월</div>
            <div className="timeline-calendar-wrapper">
              <p className="timeline-calendar timeline-calendar-alter">
                <span className="timeline-calendar-location-wrapper">
                  <span className="timeline-dot timeline-dot-gray"></span>
                  <span className="timeline-calendar-title">팬클럽 정기 모임</span>
                  <span>-</span> <span className="timeline-calendar-loaction">경복궁</span>
                </span>
                <span className="timeline-calendar-date-wrapper">
                  <span className="timeline-calendar-date">8월 12일 </span>
                  <span className="timeline-calendar-time">10:00~13:00</span>
                </span>
              </p>
              <p className="timeline-calendar timeline-calendar-alter">
                <span className="timeline-calendar-location-wrapper">
                  <span className="timeline-dot timeline-dot-gray"></span>
                  <span className="timeline-calendar-title">팬클럽 정기 모임</span>
                  <span>-</span> <span className="timeline-calendar-loaction">경복궁</span>
                </span>
                <span className="timeline-calendar-date-wrapper">
                  <span className="timeline-calendar-date">8월 12일 </span>
                  <span className="timeline-calendar-time">10:00~13:00</span>
                </span>
              </p>
            </div>
          </div>
          <div className="timeline-calendar-last-wrapper">
            <div className="timeline-calendar-month">5월</div>
            <div className="timeline-calendar-wrapper">
              <p className="timeline-calendar timeline-calendar-alter">
                <span className="timeline-calendar-location-wrapper">
                  <span className="timeline-dot timeline-dot-gray"></span>
                  <span className="timeline-calendar-title">팬클럽 정기 모임</span>
                  <span>-</span> <span className="timeline-calendar-loaction">경복궁</span>
                </span>
                <span className="timeline-calendar-date-wrapper">
                  <span className="timeline-calendar-date">8월 12일 </span>
                  <span className="timeline-calendar-time">10:00~13:00</span>
                </span>
              </p>
              <p className="timeline-calendar timeline-calendar-alter">
                <span className="timeline-calendar-location-wrapper">
                  <span className="timeline-dot timeline-dot-gray"></span>
                  <span className="timeline-calendar-title">팬클럽 정기 모임</span>
                  <span>-</span> <span className="timeline-calendar-loaction">경복궁</span>
                </span>
                <span className="timeline-calendar-date-wrapper">
                  <span className="timeline-calendar-date">8월 12일 </span>
                  <span className="timeline-calendar-time">10:00~13:00</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
