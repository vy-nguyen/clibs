
'use strict';
import _        from 'lodash';
import React    from 'react-mod';
import ReactDom from 'react-dom';

import Moment      from '../utils/Moment.jsx';
import HtmlRender  from '../utils/HtmlRender.jsx';
import ChatStore   from '../stores/ChatStore.jsx';
import ChatActions from '../actions/ChatActions.jsx';

class ChatBody extends React.Component
{
    _messageTo(user) {
        ChatActions.messageTo(user)
    }

    componentDidUpdate() {
        var $ref = $(ReactDom.findDOMNode(this));
        $ref.animate({scrollTop: $ref[0].scrollHeight});
    }

    render() {
        let messages = this.props.messages || [];
        let mesgOut = messages.map(function(message, idx) {
            return (
                <li className="message" key={_uniqueId('chat-message-')}>
                    <img className="message-picture online" src={message.user.picture}/>
                    <div className="message-text">
                        <time>
                            <Moment date={message.date} />
                        </time>
                        <a onClick={this._messageTo.bind(this, message.user)} className="username">{message.user.username}</a>
                        <HtmlRender html={message.body}/>
                    </div>
                </li>
            );
        }.bind(this));

        return (
            <div id="chat-body" className="chat-body custom-scroll">
                <ul>
                    {mesgOut}
                </ul>
            </div>
        )
    }
}

export default ChatBody
