/**
 * Code lifted from http://stackoverflow.com/questions/30915173/react-router-go-back-a-page-how-do-you-configure-history
 */
'use strict';

import React    from 'react-mod';
import {Router} from 'react-router';

let BackButton = React.createClass({
    mixins: [Router.Navigation],

    _navigateBack: function() {
        this.goBack();
    },

    render: function() {
        return (
            <button className="btn btn-lg icon-left" onClick={this._navigateBack}>Back</button>
        );
    }
});

export default BackButton
