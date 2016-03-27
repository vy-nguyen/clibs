/*
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import React      from 'react-mod';
import classnames from 'classnames';
import Moment     from '../utils/Moment.jsx';

import Message      from './Message.jsx';
import Notification from './Notification.jsx';
import Task         from './Task.jsx';

let ActivitiesDropdown = React.createClass({

    _active: false,
    components: {
        Message: Message,
        Notification: Notification,
        Task: Task
    },
    data: {
        activity: {
            items: []
        },
        activities: [],
        lastUpdate: new Date()
    },

    getInitialState: function () {
        return this.data;
    },

    render: function () {
        let activities = this.state.activities;
        let activity = this.state.activity;

        let count = _.sumBy(activities, function(a) {
            return a.length
        });
        let menu_header = activities.map(function(it, idx) {
            let cls_name = classnames(["btn", "btn-default", { active: it.name == activity.name }]);
            return (
                <label className={cls_name} key={idx} onClick={this._setActivity.bind(this, it)}>
                    <input type="radio" name="activity"/>{it.title} ({it.length})
                </label>
            )
        }.bind(this));

        return (
            <div>
                <span id="activity" onClick={this._toggleDropdown} ref="dropdownToggle" className="activity-dropdown">
                    <i className="fa fa-user"/>
                    <b className="badge bg-color-red">{count}</b>
                </span>
                <div className="ajax-dropdown" ref="dropdown">
                    <div className="btn-group btn-group-justified" data-toggle="buttons">
                        {menu_header}
                    </div>

                    {/* notification content */}
                    <div className="ajax-notifications custom-scroll">
                        <ul className="notification-body">
                        {activity.items.map(function(item, idx){
                            let component = Components[item.type]
                            return  <li key={idx}>{React.createElement(component, {
                                    item: item,
                                    lastUpdated: this.state.lastUpdated
                                })}</li>
                        }.bind(this))}
                        </ul>
                    </div>
                    {/* end notification content */}

                    {/* footer: refresh area */}
                    <span> Last updated on: <Moment data={this.state.lastUpdate} format="h:mm:ss a"/>
                  <button type="button" onClick={this._update}
                          className="btn btn-xs btn-default pull-right">
                      <i ref="loadingSpin" className="fa fa-refresh"/>
                      <span ref="loadingText"/>
                  </button>
                  </span>
                    {/* end footer */}

                </div>
            </div>
        )
    },

    _setActivity: function(_activity) {
        this.setState({
            activity: _activity
        });
    },

    _toggleDropdown: function(e) {
        e.preventDefault();
        let $dropdown = $(this.refs.dropdown);
        let $dropdownToggle = $(this.refs.dropdownToggle);

        if (this._active) {
            $dropdown.fadeOut(150)
        } else {
            $dropdown.fadeIn(150)
        }

        this._active = !this._active;
        $dropdownToggle.toggleClass('active', this._active)
    },

    componentWillMount: function() {
        this._fetch()
    },

    _update: function(){
        $(this.refs.loadingText).html('Loading...');
        $(this.refs.loadingSpin).addClass('fa-spin');
        this._fetch().then(function() {
            $(this.refs.loadingText).html('');
            $(this.refs.loadingSpin).removeClass('fa-spin');
        }.bind(this))
    },

    _fetch: function () {
        return $.getJSON(this.props.url).then(function(activities) {
            this.setState({
                activities: activities,
                activity: activities[0],
                lastUpdate: new Date()
            })
        }.bind(this))
    }

});

export default ActivitiesDropdown
