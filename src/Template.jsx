import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Functions from 'Functions/Common.js';

@inject('store')
@observer
export default class App extends Component {
  static propTypes = {
    store: PropTypes.any
  };
  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    return <div>Template</div>;
  }
}
