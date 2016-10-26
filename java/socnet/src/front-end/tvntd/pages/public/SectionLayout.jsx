/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React from 'react-mod';

import NewsFeed   from '../news-feed/NewsFeed.jsx';
import UserStore  from 'vntd-shared/stores/UserStore.jsx';

class MainPage extends React.Component
{
    render() {
        if (UserStore.isLogin()) {
            return <NewsFeed/>;
        }
        return (
            <div id="content">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <h1 className="page-title txt-color-blueDark text-center well">
                            Hello World<br/>
                            <small className="text-success">Something here</small>
                        </h1>
                    </div>
                </div>
                <section id="widget-grid" className="">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="well text-center">
                                <h5>
                                    Layout type "<strong>Navigation Minified</strong>"<br/>
                                    <small>Add the following className(s) to body tag <code>.minified</code></small>
                                </h5>
                                <h5>
                                    <small><i>Avalible options</i></small>
                                </h5>
                                <span className="label label-default">.fixed-navigation</span>
                                <span className="label label-default">.container</span>
                                <span className="label label-default">.fixed-page-footer</span>
                                <span className="label label-default">.fixed-header</span>
                                <span className="label label-default">.fixed-ribbon</span>
                                <span className="label label-default">.smart-rtl</span>
                                <br/>
                                <br/>
                                <img src="/rs/img/demo/layout-skins/layout-collapse.png"
                                    className="img-responsive center-block" style={{boxShadow: "0px 0px 3px 0px #919191"}}/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="well text-center">
                                <h5>
                                    Layout type "<strong>Hidden Navigation</strong>" <br/>
                                    <small>Add the following className(s) to body tag <code>.hidden-menu</code></small>
                                </h5>
                                <h5><small><i>Avalible options</i></small></h5>
                                <span className="label label-default">.fixed-navigation</span>
                                <span className="label label-default">.container</span>
                                <span className="label label-default">.fixed-page-footer</span>
                                <span className="label label-default">.fixed-header</span>
                                <span className="label label-default">.fixed-ribbon</span>
                                <span className="label label-default">.smart-rtl</span>
                                <br/>
                                <br/>
                                <img src="/rs/img/demo/layout-skins/layout-hidden.png"
                                    className="img-responsive center-block" style={{boxShadow: "0px 0px 3px 0px #919191;"}}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="well text-center">
                                <h5>
                                    Layout type "<strong>Menu on Top with center content</strong>" <br/>
                                    <small>Add the following className(s) to body tag <code>.top-navigation .container</code></small>
                                </h5>
                                <h5><small><i>Avalible options</i></small></h5>
                                <span className="label label-default">.fixed-navigation</span>
                                <span className="label label-default">.fixed-page-footer</span>
                                <span className="label label-default">.fixed-header</span>
                                <span className="label label-default">.fixed-ribbon</span>
                                <span className="label label-default">.smart-rtl</span>
                                <br/>
                                <br/>
                                <img src="/rs/img/demo/layout-skins/layout-menutop.png"
                                    className="img-responsive center-block" style={{boxShadow: "0px 0px 3px 0px #919191;"}}/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="well text-center">
                                <h5>
                                    Layout type "<strong>Center content with minified nav</strong>" <br/>
                                    <small>Add the following className(s) to body tag <code>.minified .container</code></small>
                                </h5>
                                <h5><small><i>Avalible options</i></small></h5>
                                <span className="label label-default">.top-navigation</span>
                                <span className="label label-default">.fixed-navigation</span>
                                <span className="label label-default">.fixed-page-footer</span>
                                <span className="label label-default">.fixed-header</span>
                                <span className="label label-default">.fixed-ribbon</span>
                                <span className="label label-default">.smart-rtl</span>
                                <br/>
                                <br/>
                                <img src="/rs/img/demo/layout-skins/layout-collapse-minified.png"
                                    className="img-responsive center-block" style={{boxShadow: "0px 0px 3px 0px #919191;"}}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="well text-center">
                                <h5>
                                    Layout type "<strong>RTL Layout</strong>" <br/>
                                    <small>Add the following className(s) to body tag <code>.smart-rtl</code></small>
                                </h5>
                                <h5><small><i>Avalible options</i></small></h5>
                                <span className="label label-default">.container</span>
                                <span className="label label-default">.hidden-menu</span>
                                <span className="label label-default">.fixed-page-footer</span>
                                <span className="label label-default">.fixed-header</span>
                                <span className="label label-default">.fixed-ribbon</span>
                                <span className="label label-default">.minified</span>
                                <br/>
                                <br/>
                                <img src="/rs/img/demo/layout-skins/layout-rtl.png"
                                    className="img-responsive center-block" style={{boxShadow: "0px 0px 3px 0px #919191;"}}/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="well text-center">
                                <h5>
                                    Layout type "<strong>RTL with Menu on Top</strong>"<br/>
                                    <small>Add the following className(s) to body tag <code>.smart-rtl .top-navigation</code></small>
                                </h5>
                                <h5><small><i>Avalible options</i></small></h5>
                                <span className="label label-default">.fixed-navigation</span>
                                <span className="label label-default">.container</span>
                                <span className="label label-default">.fixed-page-footer</span>
                                <span className="label label-default">.fixed-header</span>
                                <span className="label label-default">.fixed-ribbon</span>
                                <br/>
                                <br/>
                                <img src="/rs/img/demo/layout-skins/layout-rtl-menutop.png"
                                    className="img-responsive center-block" style={{boxShadow: "0px 0px 3px 0px #919191;"}}/>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default MainPage;
