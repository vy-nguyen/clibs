/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import React        from 'react-mod';
import moment       from 'moment';

class LikeStat extends React.Component
{
    render() {
        let dateSplit = this.props.split ? <br/> : null,
            data = this.props.data,
            className = this.props.className ?
                "list-inline " + this.props.className : "list-inline";

        if (_.isEmpty(data)) {
            return null;
        }
        return (
            <ul className={className}>
                <li><i className="fa fa-comment"/> {data.commentCount}</li>
                <li><i className="fa fa-thumbs-up"/> {data.likesCount}</li>
                <li><i className="fa fa-share"/> {data.sharesCount}</li>
                {dateSplit}
                {data.dateString ?
                    <li> <i className="fa fa-calendar"/> {data.dateString}</li> : null}
                {data.dateMoment ?
                    <li> {moment(new Date(data.dateMoment)).fromNow()}</li> : null}
            </ul>
        );
    }
}

export default LikeStat;
