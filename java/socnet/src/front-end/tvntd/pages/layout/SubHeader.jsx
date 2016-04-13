/**
 * Modified by Vy Nguyen
 */
'use strict';

import React              from 'react-mod';
import { htmlCodes }      from 'vntd-root/config/constants';
import SparklineContainer from 'vntd-shared/graphs/SparklineContainer.jsx';

let SubHeader = React.createClass({
    render: function () {
        let {className, ...props} = this.props
        return (
            <SparklineContainer className="col-xs-12 col-sm-5 col-md-5 col-lg-8">
                <ul id="sparks" className={className}>
                    <li className="sparks-info">
                        <h5> My Income <span className="txt-color-blue">$47,171</span></h5>
                        <div className="sparkline txt-color-blue hidden-mobile hidden-md hidden-sm">
                            1300, 1877, 2500, 2577, 2000, 2100, 3000, 2700, 3631, 2471, 2700, 3631, 2471
                        </div>
                    </li>
                    <li className="sparks-info">
                        <h5> My Orders <span className="txt-color-greenDark">
                            <i className="fa fa-shopping-cart"/>{htmlCodes.ocrCheck}</span>
                        </h5>
                        <div className="sparkline txt-color-greenDark hidden-mobile hidden-md hidden-sm">
                            110,150,300,130,400,240,220,310,220,300, 270, 210
                        </div>
                    </li>
                </ul>
            </SparklineContainer>
        )
    }
});

export default SubHeader
