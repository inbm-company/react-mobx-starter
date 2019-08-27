import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Functions from 'Functions/Common';
import AuthorInfo from 'Components/TimeLine/AuthorInfo';
import PostInfo from 'Components/TimeLine/PostInfo';

@inject('store')
@observer
export default class TimelineText extends Component {
  static propTypes = {
    store: PropTypes.any,
    info: PropTypes.any
  };

  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;
    const {
      router: { goTo, params }
    } = store;

    const info = this.props.info;

    let content = info.content.replace(/(?:\r\n|\r|\n)/g, '<br />');

    content = Functions.urlToLink(content);

    return (
      <div className="timeline type-text">
        <div className="type-icon-wrap">
          <i className="type-icon type-image-icon"></i>
        </div>
        <div className="timeline-post">
          <AuthorInfo info={info} />
          <div className="timeline-content">
            <div className="tc-tit">{info.title}</div>
            <div className="img-content">
              <img src={`${fanclubStore.IMAGE_SERVER_URL}/${info.image}`} alt="" />
            </div>
            <div className="tc-comment" dangerouslySetInnerHTML={{ __html: content }}></div>
          </div>
          <PostInfo info={info} />
        </div>
      </div>
    );
  }
}
