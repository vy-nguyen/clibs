/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import React        from 'react-mod';
import moment       from 'moment';
import StarRating   from 'react-star-rating';

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

class RatingInfo extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let { starSize } = this.props;

        if (starSize == null) {
            starSize = 15;
        }
        return (
            <div className="row">
                <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                    <LikeStat className="padding-10" data={this.props.likeStat}/>
                </div>
                <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                    <StarRating size={starSize}
                        totalStarts={5} rating={4} disabled={true}/>
                </div>
            </div>
        );
    }

    static getLikeStat(rank) {
        return {
            commentCount: rank.notifCount ? rank.notifCount : 0,
            likesCount  : rank.likes,
            sharesCount : rank.shares
        };
    }
}

export default LikeStat;
export { LikeStat, RatingInfo };
