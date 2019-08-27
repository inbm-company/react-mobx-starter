import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { MobxRouter } from 'mobx-router';

@inject('store')
@observer
export default class App extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  componentDidMount() {
    const { dataStore } = this.props.store;
  }

  render() {
    const { store } = this.props;
    const { dataStore } = store;

    return (
      <div className="main-container">
        <div>Header</div>
        <MobxRouter />
      </div>
    );
  }
}
