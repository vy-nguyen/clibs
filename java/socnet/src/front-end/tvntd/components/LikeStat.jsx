/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React        from 'react-mod';
import moment       from 'moment';

let LikeStat = React.createClass({

    render: function() {
        let data = this.props.data;

        return (
            <ul className="list-inline">
                {data.dateString ? <li><i className="fa fa-calendar"/> {data.dateString}</li> : null}
                {data.dateMoment ? <li><i className="fa fa-calendar"/> {moment(data.dateMoment).fromNow()}</li> : null}
                <li><i className="fa fa-comment"/> {data.commentCount}</li>
                <li><i className="fa fa-thumbs-up"/> {data.likesCount}</li>
                <li><i className="fa fa-share"/> {data.sharesCount}</li>
            </ul>
        );
    }
});

export default LikeStat;
