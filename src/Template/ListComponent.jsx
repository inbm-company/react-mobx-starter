import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('store')
@observer
export default class ListComponent extends Component {
  static propTypes = {
    store: PropTypes.any
  };
}
