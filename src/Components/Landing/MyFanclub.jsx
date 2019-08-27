import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'mobx-router';
import MyFanclubItem from 'Components/Landing/MyFanclubItem';
import Views from 'Routers';
import PerfectScrollbar from 'react-perfect-scrollbar';

@inject('store')
@observer
export default class MyFanclub extends Component {
  static propTypes = {
    store: PropTypes.any
  };
  componentDidMount() {}
  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;

    return (
      <section className="my-fanclub-section">
        <div className="section-inner-wrap">
          <div className="section-tit">
            <h2 className="st">내 팬클럽</h2>
          </div>
          <PerfectScrollbar className="scroll-horizontal-container">
            <div className="list-type1">
              <div className="item create">
                <Link view={Views.create} store={store}>
                  <p className="img"></p>
                  <p className="txt">만들기</p>
                </Link>
              </div>
              {fanclubStore.myFanclub.map(item => (
                <MyFanclubItem key={item.code} info={item} store={store} />
              ))}
            </div>
          </PerfectScrollbar>
        </div>
      </section>
    );
  }
}
