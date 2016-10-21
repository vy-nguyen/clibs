/*
 * Vy Nguyen (2016)
 */
'use strict';

import _            from 'lodash';
import React        from 'react-mod';
import classnames   from 'classnames';
import Moment       from 'vntd-shared/utils/Moment.jsx';

import Message      from 'vntd-shared/activities/Message.jsx';
import Notification from 'vntd-shared/activities/Notification.jsx';
import Task         from 'vntd-shared/activities/Task.jsx';
import Actions      from 'vntd-root/actions/Actions.jsx';
import RenderStore  from 'vntd-root/stores/RenderStore.jsx';

let Components = {
    Task        : Task,
    Message     : Message,
    Notification: Notification
};

class ActivitiesDropdown extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            lastUpdated: new Date()
        };
        this.active = false;
        this._update = this._update.bind(this);
        this._setActivity = this._setActivity.bind(this);
        this._toggleDropdown = this._toggleDropdown.bind(this);
        this._onRefreshNotify = this._onRefreshNotify.bind(this);
    }

    componentWillMount() {
        this._update();
    }

    componentDidMount() {
        this.unsub = RenderStore.listen(this._onRefreshNotify);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _setActivity(active) {
        this.setState({
            activeNotify: active
        });
        RenderStore.setActiveNotify(active);
    }

    _toggleDropdown(e) {
        e.preventDefault();
        let dropdown = $(this.refs.dropdown);
        let dropdownToggle = $(this.refs.dropdownToggle);

        if (this.active) {
            dropdown.fadeOut(150)
        } else {
            dropdown.fadeIn(150)
        }
        dropdownToggle.toggleClass('active', !this.active)
        this.active = !this.active;
    }

    _update() {
        $(this.refs.loadingText).html('Loading...');
        $(this.refs.loadingSpin).addClass('fa-spin');
        Actions.refreshNotify();
    }

    _onRefreshNotify(data) {
        $(this.refs.loadingText).html("");
        $(this.refs.loadingSpin).removeClass("fa-spin");

        this.setState({
            notifyItems : data.notifyItems,
            activeNotify: data.activeNotify,
            lastUpdated : data.lastUpdated
        });
    }

    render() {
        /* This state is the same as RenderStore data */
        let activities = this.state.notifyItems;
        let activity = this.state.activeNotify;

        if (activity == null || activity.items == null) {
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
            let component = Components[item.type];
            let element = React.createElement(Components[item.type], {
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
    }
}

export default ActivitiesDropdown
