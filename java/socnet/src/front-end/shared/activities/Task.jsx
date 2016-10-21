/**
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import React from 'react-mod'
import classnames from 'classnames'
import Moment from '../utils/Moment.jsx'

class Task extends React.Component
{
    render() {
        let item = this.props.item;
        let status = item.status == 'PRIMARY' ? <i className="fa fa-warning text-warning"/> : null
        let className = classnames([
            'pull-right',
            'semi-bold',
            (item.status == 'CRITICAL' ? 'text-danger' : 'text-muted')
        ]);
        let taskBar = item.width == 100 ?
            <span><i className="fa fa-check text-success"/> Complete</span> :
            <span>{item.width + '%'}</span>;

        return (
            <span>
			    <div className="bar-holder no-padding">
                    <p className="margin-bottom-5">
                        {status}
                        <strong>{item.status}:</strong> <i>{item.title}</i>
                        <span className={className}>
                            {taskBar}
                        </span>
                    </p>
                    <div className={classnames(['progress', item.progressClass])}>
                        <div className={classnames([
                            'progress-bar', {
                                'progress-bar-success': item.status == 'MINOR' || item.status == 'NORMAL',
                                'bg-color-teal': item.status == 'PRIMARY' || item.status == 'URGENT',
                                'progress-bar-danger': item.status == 'CRITICAL'
                            }
                        ])} style={{width: item.width + '%'}}></div>
                    </div>
                    <em className="note no-margin">
                        last updated on <Moment data={this.props.lastUpdate} format="MMMM Do, h:mm a"/>
                    </em>
                </div>
		    </span>
        )
    }
}

export default Task
