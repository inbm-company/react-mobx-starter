import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('store')
@observer
export default class MessageWindow extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  render() {
    const { fanclubStore } = this.props.store;

    const title = fanclubStore.msgWindow.title ? fanclubStore.msgWindow.title : null,
      message = fanclubStore.msgWindow.message,
      buttons = fanclubStore.msgWindow.buttons;

    return (
      <div className="module-layer" style={{ display: fanclubStore.msgWindowOpen === 'true' ? 'block' : 'none' }}>
        <div className="module-layer-inner">
          {title != null && <h2 className="alert-tit">{title}</h2>}
          <p className="alert-txt" dangerouslySetInnerHTML={{ __html: message }}></p>
          <div className="alert-btns-wrap">
            {buttons.map((item, index) => (
              <button type="button" key={index} className={item.classText} onClick={item.callback}>
                {item.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
