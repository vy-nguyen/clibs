/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React         from 'react-mod'
import Reflux        from 'reflux';
import TabPanel      from 'vntd-shared/layout/TabPanel.jsx';

let MainBlog = React.createClass({

    getBlogTab: function() {
        return {
            getActivePane: this._getActivePane,
            setActivePane: this._setActivePane,

            tabItems: [ {
                domId  : 'politics',
                tabText: 'Chinh Tri',
                tabIdx : 0
            }, {
                domId  : 'economics',
                tabText: 'Kinh Te',
                tabIdx : 1
            }, {
                domId  : 'market',
                tabText: 'Thi Truong',
                tabIdx : 2
            }, {
                domId  : 'education',
                tabText: 'Giao Duc',
                tabIdx : 3
            }, {
                domId  : 'tech',
                tabText: 'Ky Thuat',
                tabIdx : 4
            }, {
                domId  : 'community',
                tabText: 'Cong Dong',
                tabIdx : 5
            } ]
        }
    },

    _getActivePane: function() {
        return 0;
    },

    _setActivePane: function(idx) {
    },

    render: function() {
        return (
            <div id="content">
                <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <TabPanel className="padding-top-10" context={this.getBlogTab()}>
                                <h1>Chinh Tri</h1>
                                <h1>Kinh Te</h1>
                                <h1>Thi Truong</h1>
                                <h1>Giao Duc</h1>
                                <h1>Ky Thuat</h1>
                                <h1>Cong Dong</h1>
                            </TabPanel>
                        </div>
                    </div>
            </div>
        )
    }
});

export default MainBlog;
