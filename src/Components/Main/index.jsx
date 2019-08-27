import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';

@inject('store')
@observer
export default class Landing extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  render() {
    const { dataStore } = this.props.store;

    return (
      <div className="main-page">
        Main Page
        {dataStore.test}
        <br />
        <br />
        <button type="button" onClick={dataStore.testFunc} style={{ border: '1px solid red' }}>
          Change Number
        </button>
      </div>
    );
  }
}
