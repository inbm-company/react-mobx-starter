import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';

@inject('store')
@observer
export default class TopArtist extends Component {
  static propTypes = {
    store: PropTypes.any,
    loadingFlag: PropTypes.any,
    top: PropTypes.any
  };

  @observable top = this.props.top + 'px';
  @observable display = this.props.loadingFlag ? 'block' : 'none';

  componentDidMount() {
    console.log(this.display);
  }

  componentWillReceiveProps(nextProps) {
    this.display = nextProps.loadingFlag ? 'block' : 'none';
    this.top = nextProps.top + 'px';
  }

  render() {
    const { fanclubStore } = this.props.store;

    return (
      <div
        className="progress-loader"
        style={{
          display: this.display,
          top: this.top
        }}
      >
        <div className="loader"></div>
      </div>
    );
  }
}
