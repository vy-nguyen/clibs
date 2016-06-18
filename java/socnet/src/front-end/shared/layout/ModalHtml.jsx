/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React       from 'react-mod';
import LoadHtml    from 'vntd-shared/utils/LoadHtml.jsx';
import ModalButton from 'vntd-shared/layout/ModalButton.jsx';

let ModalHtml = React.createClass({

    render: function() {
        let { url, ...other } = this.props;
        return (
            <ModalButton {...other}>
                <LoadHtml url={url || '/public/get-html/index'}/>
            </ModalButton>
        );
    }
});

export default ModalHtml;
