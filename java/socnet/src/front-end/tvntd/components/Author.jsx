/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                from 'lodash';
import React            from 'react-mod';
import ProfileCover     from './ProfileCover.jsx';
import { htmlCodes }    from 'vntd-root/config/constants';
import UserIcon         from 'vntd-root/components/UserIcon.jsx';

let Author = React.createClass({

    renderTopics: function(items) {
        let out = [];
        out.push(<br key={_.uniqueId('topic-list-')}/>);
        _.forEach(items, function(it, idx) {
            out.push(<span key={_.uniqueId('author-list-')}><span className={it.icon}>{it.tag}</span> {it.text}<br/></span>);
        });
        return out;
    },

    renderAboutMe: function(aboutList) {
        if (aboutList == null) {
            return null;
        }
        return aboutList.map(function(item, index) {
            return (
                <div key={_.uniqueId('about-list-')}>
                    <hr/>
                    <strong><i className={item.topicIcon}></i>{item.topicText}</strong>
                    {this.renderTopics(item.topicList)}
                </div>
            );
        }.bind(this));
    },

    render: function() {
        if (!this.props.user) {
            return null;
        }
        let self = this.props.user.getUser();
        let infoStyle = {
            backgroundImage: 'url(' + this.props.user.coverImg + ')'
        };
        return (
            <div className="row">
                <div className="col-sm-12" style={infoStyle}>
                    <div className="row">
                        <div className="col-sm-5 profile-pic">
                            <UserIcon userUuid={self.userUuid} width="100" height="100"/>
                        </div>
                        <div className="col-sm-7">
                        </div>
                    </div>
                    <div className="well well-sm" style={{background: "rgba(255,255,255,0.8)"}}>
                        <div className="box-header">
                            <h1 className="profile-username text-center">
                            {self.firstName} <span className="semi-bold">{self.lastName}</span>
                            <br/>
                            <small>{self.userStatus}</small>
                            </h1>
                            <h4 className="font-md"><strong>{self.followers}</strong><small> Followers</small></h4>
                            <h4 className="font-md"><strong>{self.connections}</strong><small> Connections</small></h4>
                        </div>
                        <div className="box-body">
                            <strong><i className='fa fa-book margin-r-5'></i>Public Transactions</strong>
                            <p/>
                            <span className="label label-success">Money</span>
                            <table className="table">
                                <tbody>
                                    <tr className="info">
                                        <th><span className='label label-success'>Earned</span></th>
                                        <th>{self.moneyEarned}</th>
                                    </tr>
                                    <tr className="success">
                                        <th><span className='label label-danger'>Issued</span></th>
                                        <th>{self.moneyIssued}</th>
                                    </tr>
                                </tbody>
                            </table>
                            <p/>
                            <span className="label label-warning">Credit</span>
                            <table className="table">
                                <tbody>
                                    <tr className="info">
                                        <th><span className='label label-success'>Earned</span></th>
                                        <th>{self.creditEarned}</th>
                                    </tr>
                                    <tr className="success">
                                        <th><span className='label label-danger'>Issued</span></th>
                                        <th>{self.creditIssued}</th>
                                    </tr>
                                </tbody>
                            </table>
                            {this.renderAboutMe(this.props.user.aboutList)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default Author;
