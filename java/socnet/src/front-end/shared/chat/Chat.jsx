import React from 'react-mod'

import ChatStore   from '../stores/ChatStore.jsx'
import ChatActions from '../actions/ChatActions.jsx'
import ChatUsers   from './ChatUsers.jsx'
import ChatBody    from './ChatBody.jsx'
import ChatForm    from './ChatForm.jsx'

class Chat extends React.Component
{
    constructor(props) {
        super(props);
        this.state = ChatStore._getData();
    }

    render() {
        return (
            <div className={this.props.className}>
                <ChatUsers users={this.state.users} />
                <ChatBody messages={this.state.messages}/>
                <ChatForm />
            </div>
        )
    }
}

export default Chat
