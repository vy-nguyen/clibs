/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

class TextOverImg extends React.Component
{
    constructor(props) {
        super(props);

        this._wrapper = {
            float   : "left",
            position: "relative"
        };
        this._description = {
            position : "absolute",
            bottom   : "0px",
            left     : "0px",
            width    : "100%",
            backgroundColor: "#6a6a6a",
            color    : "white",
            opacity  : "0.6",
            filter   : "alpha(opacity=60)"
        };
        this._content = {
            padding  : "10px",
            margin   : "0px",
            fontSize : "46px",
            textAlign: "center"
        };
    }

    render() {
        return (
            <div style={this._wrapper}>
                <img className={this.props.className} src={this.props.imgUrl}/>
                <div style={this._description}>
                    <p style={this._content}>
                        {this.props.text}
                    </p>
                </div>
            </div>
        );
    }
}

TextOverImg.propTypes = {
};

export default TextOverImg;
