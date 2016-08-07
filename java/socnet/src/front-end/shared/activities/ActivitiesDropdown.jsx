/*
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import React        from 'react-mod';
import _            from 'lodash';
import Reflux       from 'reflux';
import classnames   from 'classnames';
import Moment       from '../utils/Moment.jsx';

import Message      from './Message.jsx';
import Notification from './Notification.jsx';
import Task         from './Task.jsx';
import Actions      from 'vntd-root/actions/Actions.jsx';
import RenderStore  from 'vntd-root/stores/RenderStore.jsx';

let ActivitiesDropdown = React.createClass({

    mixins: [
        Reflux.connect(RenderStore),
        Reflux.listenTo(RenderStore, "_onRefreshNotify")
    ],

    _active: false,
    components: {
        Task:         Task,
        Message:      Message,
        Notification: Notification
    },

    componentWillMount: function() {
    },

    getInitialState: function() {
        this.setState({
            lastUpdated: new Date()
        });
    },

    render: function () {
        /* This state is the same as RenderStore data */
        let activities = this.state.notifyItems;
        let activity = this.state.activeNotify;

        if (activity == undefined || activity.items == undefined) {
            return null;
        }
        let count = _.sumBy(activities, function(a) {
            return a.length
        });
        let menu_header = activities.map(function(it, idx) {
            let cls_name = classnames(["btn", "btn-default", { active: it.name == activity.name }]);
            return (
                <label className={cls_name} key={_.uniqueId('menu-hdr-')} onClick={this._setActivity.bind(this, it)}>
                    <input type="radio" name="activity"/>{it.title} ({it.length})
                </label>
            );
        }.bind(this));

        let menu_body = activity.items.map(function(item, idx) {
            let component = this.components[item.type];
            let element = React.createElement(this.components[item.type], {
                item: item,
                lastUpdated: this.state.lastUpdated
            });
            return (
                <li key={_.uniqueId('menu-body-')}>{element}</li>
            );
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

                    <div className="ajax-notifications custom-scroll">
                        <ul className="notification-body">
                            {menu_body}
                        </ul>
                    </div>

                    <span> Last updated on: <Moment data={this.state.lastUpdated} format="h:mm:ss a"/>
                        <button type="button" onClick={this._update} className="btn btn-xs btn-default pull-right">
                            <i ref="loadingSpin" className="fa fa-refresh"/>
                            <span ref="loadingText"/>
                        </button>
                    </span>
                </div>
            </div>
        )
    },

    _setActivity: function(active) {
        this.setState({
            activeNotify: active
        });
        RenderStore.setActiveNotify(active);
        this.forceUpdate();
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
        this._update();
    },

    _update: function() {
        $(this.refs.loadingText).html('Loading...');
        $(this.refs.loadingSpin).addClass('fa-spin');
        Actions.refreshNotify();
    },

    _onRefreshNotify: function(data) {
        $(this.refs.loadingText).html("");
        $(this.refs.loadingSpin).removeClass("fa-spin");
        this.setState({
            notifyItems : data.notifyItems,
            activeNotify: data.activeNotify,
            lastUpdated : data.lastUpdated
        });
        this.forceUpdate();
    }
});

export default ActivitiesDropdown
