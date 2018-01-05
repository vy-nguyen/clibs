/**
 * Written by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';
import { Link }          from 'react-router';

import ComponentBase     from 'vntd-shared/layout/ComponentBase.jsx';
import BusinessStore     from 'vntd-root/stores/BusinessStore.jsx';
import { ColWidthMap }   from 'vntd-root/config/constants.js';

class BoostFooter extends ComponentBase
{
    constructor(props) {
        super(props, null, [BusinessStore]);
    }

    _renderSection(section, render) {
        let out = [], title;

        if (section.route != null) {
            if (section.items != null) {
                title = <h4>{section.title}</h4>;
            } else {
                title = <span>{section.title}</span>;
            }
            title = (
                <Link to={section.route}>{title}</Link>
            );
        } else {
            title = (
                <Link to=""><h4>{section.title}</h4></Link>
            );
        }
        out.push(<li key={_.uniqueId()} className="no-padding">{title}</li>);

        if (section.items != null) {
            _.forEach(section.items, function(it) {
                this._renderSection(it, out);
            }.bind(this));
        }
        render.push(
            <ul key={_.uniqueId()} className="nav nav-footer no-padding">
                {out}
            </ul>
        );
    }

    render() {
        let owner, design, fmt, out = [],
            { footer, copyright } = this.props;

        if (footer == null || copyright == null) {
            return null;
        }
        fmt = ColWidthMap[footer.length];
        _.forEach(footer, function(section) {
            let sectOut = [];

            this._renderSection(section, sectOut);
            out.push(
                <div className={fmt}>
                    {sectOut}
                </div>
            );
        }.bind(this));

        owner  = copyright.owner;
        design = copyright.design;
        return (
            <div>
                <footer className="footer">
                    <div className="container">
                        <div className="row">
                            {out}
                        </div>
                    </div>
                </footer>
                <div style={copyright.format}>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <div style={owner.format}>
                                    {owner.title}
                                </div>
                            </div>
                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <div style={design.format}>
                                    {design.title}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BoostFooter;
