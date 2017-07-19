/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                from 'lodash';
import React            from 'react-mod';
import Mesg             from 'vntd-root/components/Mesg.jsx'
import UserIcon         from 'vntd-root/components/UserIcon.jsx';
import AuthorLinks      from 'vntd-root/components/AuthorLinks.jsx';
import KeyValueTable    from 'vntd-shared/layout/KeyValueTable.jsx';
import {getRandomInt}   from 'vntd-shared/utils/Enum.jsx';

class Author extends React.Component
{
    constructor(props) {
        super(props);
        this.renderAboutMe = this.renderAboutMe.bind(this);
    }

    renderAboutMe(aboutList) {
        if (aboutList == null || _.isEmpty(aboutList)) {
            return null;
        }
        return aboutList.map(function(item, index) {
            let topicList = item.topicList.map(function(topic, idx) {
                return {
                    key    : topic.tag,
                    val    : topic.text,
                    keyFmt : topic.icon,
                    valRows: topic.text.constructor === Array ? true : false
                }
            });
            return (
                <div key={_.uniqueId('about-list-')}>
                    <hr/>
                    <strong><i className={item.topicIcon}></i>{item.topicText}</strong>
                    <KeyValueTable keyValueList={topicList}/>
                </div>
            );
        }.bind(this));
    }

    render() {
        if (!this.props.user) {
            return null;
        }
        let user = this.props.user,
            self = user.getUser(),
            coverIdx = getRandomInt(0, user.imgList.length - 1),
            infoStyle = {
                backgroundImage: 'url(' + user.imgList[coverIdx] + ')'
            },
            moneyKv = [{
                key: "Earned",
                val: self.moneyEarned
            }, {
                key: "Issued",
                val: self.moneyIssued
            }],
            creditKv = [{
                key: "Earned",
                val: self.creditEarned
            }, {
                key: "Issued",
                val: self.creditIssued
            }];

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
                    <div className="well well-sm"
                        style={{background: "rgba(255,255,255,0.8)"}}>
                        <div className="box-header">
                            <h1 className="profile-username text-center">
                                {self.firstName} <span className="semi-bold">{self.lastName}</span>
                                <br/>
                                <small>{self.userStatus}</small>
                            </h1>
                            <h4 className="font-md">
                                <strong>{self.followers}</strong>
                                <small><Mesg text=" Followers"/></small>
                            </h4>
                            <h4 className="font-md">
                                <strong>{self.connections}</strong>
                                <small><Mesg text=" Connections"/></small></h4>
                        </div>
                        <div className="box-body">
                            <strong>
                                <i className='fa fa-book margin-r-5'></i>
                                <Mesg text="Public Transactions"/>
                            </strong>
                            <p/>
                            <span className="label label-success">
                                <Mesg text="Money"/>
                            </span>
                            <KeyValueTable keyValueList={moneyKv}/>

                            <span className="label label-warning">
                                <Mesg text="Credit"/>
                            </span>
                            <KeyValueTable keyValueList={creditKv}/>

                            {this.renderAboutMe(this.props.user.aboutList)}

                            <p/>
                            <strong><i className="fa fa-book"/>
                                <Mesg text=" Favorite Posts"/>
                            </strong>
                            <AuthorLinks authorUuid={self.userUuid}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Author;
