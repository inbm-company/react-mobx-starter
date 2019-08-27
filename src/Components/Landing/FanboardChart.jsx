import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';
import PropTypes from 'prop-types';
import Views from 'Routers';

@inject('store')
@observer
export default class FanboardChart extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @action gotoFanboardChart = e => {
    const { store } = this.props;
    const { fanclubStore } = store;
    const {
      router: { goTo, params }
    } = store;

    e.preventDefault();

    goTo(Views.fanboardChart, {}, store);
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { fanclubStore } = this.props.store;
    const style1 = {
      width: '55%'
    };
    const style20 = {
      left: 0,
      width: '80%'
    };
    const style21 = {
      left: '55%'
    };
    const style30 = {
      left: 0,
      width: '100%'
    };
    const style31 = {
      left: '80%'
    };

    return (
      <section className="fanboard-chart-section">
        <div className="section-inner-wrap bt">
          <div className="section-tit">
            <h2 className="st">팬보드 차트</h2>
            <a href="#" className="see-all" onClick={this.gotoFanboardChart}>
              전체보기
            </a>
          </div>
          <div className="chart-graph-wrap">
            <div className="graph-bar" style={style1}>
              <div className="t-area">
                <p className="a-name">EXO</p>
                <span className="num-amount">8,940</span>
                <span className="crown"></span>
              </div>
              <div className="b-area"></div>
            </div>
            <div className="graph-bar" style={style20}>
              <div className="t-area" style={style21}>
                <p className="a-name">BTS</p>
                <span className="num-amount">5,940</span>
              </div>
              <div className="b-area"></div>
            </div>
            <div className="graph-bar" style={style30}>
              <div className="t-area" style={style31}>
                <p className="a-name">아이유</p>
                <span className="num-amount">3,940</span>
              </div>
              <div className="b-area"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
