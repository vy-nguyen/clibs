import React        from 'react-mod'
import classnames   from 'classnames'
import Moment       from '../utils/Moment.jsx'

import Message      from './Message.jsx'
import Notification from './Notification.jsx'
import Task         from './Task.jsx'

let Components = {
    Message     : Message,
    Notification: Notification,
    Task        : Task
};

class ActivitiesDropdown extends React.Component
{
    constructor(props) {
        super(props);
        this._active = false;
        this.state = {
            activity: {
                items: []
            },
            activities: [],
            lastUpdate: new Date()
        };
        this._update         = this._update.bind(this);
        this._setActivity    = this._setActivity.bind(this);
        this._toggleDropdown = this._toggleDropdown.bind(this);
    }

    render() {
        let activities = this.state.activities;
        let activity = this.state.activity;

        let count = _.sumBy(activities, function (a) {
            return a.length
        });
        let actRender = activities.map(function (_activity, idx) {
            return (
                <label className={classnames(["btn", "btn-default", {
                    active: _activity.name == activity.name }])}
                    key={'dropdown-' + idx}
                    onClick={this._setActivity.bind(this, _activity)}>
                    <input type="radio" name="activity"/>
                    {_activity.title} ({_activity.length})
                </label>
            )
        }.bind(this));
        let actComp = activity.items.map(function(item, idx) {
            let component = Components[item.type];
            return (
                <li key={idx}>
                    {React.createElement(component, {
                        item: item,
                        lastUpdated: this.state.lastUpdated
                    })}
                </li>
            )
        }.bind(this));
        return (
            <div>
                <span id="activity" onClick={this._toggleDropdown}
                    ref="dropdownToggle" className="activity-dropdown">
                    <i className="fa fa-user"/>
                    <b className="badge bg-color-red">{count}</b>
                </span>
                <div className="ajax-dropdown" ref="dropdown">
                    <div className="btn-group btn-group-justified" data-toggle="buttons">
                        {actRender}
                    </div>

                    {/* notification content */}
                    <div className="ajax-notifications custom-scroll">
                        <ul className="notification-body">
                        {actComp}
                        </ul>
                    </div>
                    {/* end notification content */}

                    {/* footer: refresh area */}
                    <span> Last updated on:
                        <Moment data={this.state.lastUpdate} format="h:mm:ss a"/>
                        <button type="button" onClick={this._update}
                            className="btn btn-xs btn-default pull-right">
                            <i ref="loadingSpin" className="fa fa-refresh"/>
                            <span ref="loadingText"/>
                        </button>
                    </span>
                </div>
            </div>
        )
    }

    _setActivity(_activity) {
        this.setState({
            activity: _activity
        })
    }

    _toggleDropdown(e) {
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
    }

    componentWillMount() {
        this._fetch()
    }

    _update() {
        $(this.refs.loadingText).html('Loading...');
        $(this.refs.loadingSpin).addClass('fa-spin');
        this._fetch().then(function(){
            $(this.refs.loadingText).html('');
            $(this.refs.loadingSpin).removeClass('fa-spin');
        }.bind(this))
    }

    _fetch() {
        return $.getJSON(this.props.url).then(function (activities) {
            this.setState({
                activities: activities,
                activity: activities[0],
                lastUpdate: new Date()
            })
        }.bind(this))
    }
}

export default ActivitiesDropdown;
