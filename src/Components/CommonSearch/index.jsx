import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import Functions from 'Functions/Common.js';

@inject('store')
@observer
export default class CommonSearch extends Component {
  static propTypes = {
    store: PropTypes.any
  };

  @action goBack = () => {
    Functions.goBack();
  };

  @observable searchWord = '';

  @action.bound
  onChange(event) {
    const { name, value } = event.target;
    this[name] = value;
  }

  @action clearInput = () => {
    this.searchWord = '';
  };

  render() {
    const { store } = this.props;
    const { fanclubStore } = this.props.store;

    return (
      <div className="fanclub-main-container">
        <section className="fanclub-search-section">
          <header className="search-header">
            <div className="inp-wrap">
              <input name="searchWord" value={this.searchWord} onChange={this.onChange} className="search-header-input" placeholder="찾고싶은 단어를 입력하세요" />
              {this.searchWord.length > 0 && (
                <button type="button" className="btn-del" onClick={this.clearInput}>
                  X
                </button>
              )}
            </div>
            <button onClick={this.goBack} className="search-header-cancel">
              취소
            </button>
          </header>

          <article className="search-content">
            <p className="search-result-wrapper">
              <span className="search-result-name-wrapper">
                &apos;<span className="search-result-name">아이유 패러디</span>&apos;
              </span>
              <span className="search-result-count-space">검색 결과 총</span>
              <span className="search-result-count">21</span>
              <span className="search-result-text">개의 게시글</span>
            </p>
            <div className="search-content-wrapper">
              <div className="search-content">
                <p className="search-content-title">아이유 패러디 봤냐</p>
                <p className="search-content-main">너무 웃겨서 공유 ㅋㅋㅋㅋㅋㅋㅋㅋ</p>
                <p className="search-content-footer">
                  <span className="search-content-type">Now</span>
                  <span className="search-content-name">강꽃님</span>
                  <span className="search-content-date">2019.03.11</span>
                </p>
              </div>

              <div className="search-content-image">
                <img src="../images/search/img-search1.png" alt="" />
                <i className="content-image-type"></i>
              </div>
            </div>

            <div className="search-content-wrapper">
              <div className="search-content">
                <p className="search-content-title">패러디의 역설ㆍㆍㆍ아이유가 던진 한마디는?</p>
                <p className="search-content-main">과거&lt;전설의 고향&gt;에서부터 영화 &lt;검은 사제들&gt;,드라마&lt;손 the guest&gt;, 이제 곧 개봉할 영화 &lt;사자&gt;까지, 대중문화에서 이런 오컬</p>
                <p className="search-content-footer">
                  <span className="search-content-type">Now</span>
                  <span className="search-content-name">강꽃님</span>
                  <span className="search-content-date">2019.03.11</span>
                </p>
              </div>
            </div>

            <div className="search-content-wrapper">
              <div className="search-content">
                <p className="search-content-title">아이유 가나 초콜렛 패러디 짤방</p>
                <p className="search-content-footer">
                  <span className="search-content-type">드라이브</span>

                  <span className="search-content-name">아이유덕후</span>

                  <span className="search-content-date">2019.07.21</span>
                </p>
              </div>

              <div className="search-content-image">
                <img src="../images/search/img-search2.png" alt="" />
                <i className="content-image-type"></i>
              </div>
            </div>

            <div className="search-content-wrapper">
              <div className="search-content">
                <p className="search-content-title">신보라 아이유 &apos;3단 고음&apos;패러디</p>
                <p className="search-content-footer">
                  <span className="search-content-type">Now</span>
                  <span className="search-content-name">강꽃님</span>
                  <span className="search-content-date">2019.03.11</span>
                </p>
              </div>

              <div className="search-content-image">
                <img src="../images/search/img-search3.png" alt="" />
                <i className="content-image-type"></i>
              </div>
            </div>

            <div className="search-content-wrapper">
              <div className="search-content">
                <p className="search-content-title">패러디의 역설ㆍㆍㆍ아이유가 던진 한마디는?</p>
                <p className="search-content-main">과거&lt;전설의 고향&gt;에서부터 영화 &lt;검은 사제들&gt;,드라마&lt;손 the guest&gt;, 이제 곧 개봉할 영화 &lt;사자&gt;까지, 대중문화에서 이런 오컬</p>
                <p className="search-content-footer">
                  <span className="search-content-type">Now</span>
                  <span className="search-content-name">강꽃님</span>
                  <span className="search-content-date">2019.03.11</span>
                </p>
              </div>
            </div>
          </article>
        </section>
        <section className="fc-favorite-fans alter-type1" style={{ border: '0 none', padding: '20px 0 50px' }}>
          <p className="search-user-wrapper">
            <span className="search-user-name-wrapper">
              &apos;<span className="search-user-name">아이유 패러디</span>&apos;
            </span>
            <span className="search-user-count-space">검색 결과 총</span>
            <span className="search-user-count">21</span>
            <span className="search-user-text">개의 사용자</span>
          </p>
          <div className="list-type5">
            <div className="item">
              <a href="#">
                <p className="img">
                  <span className="default-photo">
                    <img src="../images/@img-fan1.png" alt="" />
                  </span>
                  <i className="badge status"></i>
                  <i className="badge check"></i>
                </p>
                <p className="infos">
                  <span className="user-name-wrapper">
                    <strong className="user-name">남보라</strong>
                    <i className="user-name-ico"></i>
                    <i className="user-name-ico"> </i>
                  </span>

                  <span className="user-msg">꽃보다 아이유</span>
                </p>
              </a>
            </div>
            <div className="item">
              <a href="#">
                <p className="img">
                  <span className="default-photo">
                    <img src="../images/@img-fan2.png" alt="" />
                  </span>
                  <i className="badge"></i>
                  <i className="badge"></i>
                </p>
                <p className="infos">
                  <span className="user-name-wrapper">
                    <strong className="user-name">박소연</strong>
                    <i className="user-name-ico marked"></i>
                    <i className="user-name-ico"> </i>
                  </span>
                  <span className="user-msg">Music is My Life</span>
                </p>
              </a>
            </div>
            <div className="item">
              <a href="#">
                <p className="img">
                  <span className="default-photo">
                    <img src="../images/@img-fan5.png" alt="" />
                  </span>
                  <i className="badge"></i>
                  <i className="badge check"></i>
                </p>
                <p className="infos">
                  <span className="user-name-wrapper">
                    <strong className="user-name">박찬호</strong>
                    <i className="user-name-ico"></i>
                    <i className="user-name-ico"> </i>
                  </span>

                  <span className="user-msg">저 푸른 초원위에 그림같은 집을 짓고 아이유와 함께</span>
                </p>
              </a>
            </div>
            <div className="item">
              <a href="#">
                <p className="img">
                  <span className="default-photo">
                    <img src="../images/@img-fan4.png" alt="" />
                  </span>
                  <i className="badge"></i>
                  <i className="badge check"></i>
                </p>
                <p className="infos">
                  <span className="user-name-wrapper">
                    <strong className="user-name">정상훈</strong>
                    <i className="user-name-ico"></i>
                    <i className="user-name-ico"> </i>
                  </span>

                  <span className="user-msg"></span>
                </p>
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
