/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import classnames         from 'classnames';
import React, {PropTypes} from 'react-mod';

import Mesg               from 'vntd-root/components/Mesg.jsx';

class Wizard extends React.Component
{
    constructor(props) {
        super(props);

        this._updateState = this._updateState.bind(this);
        this.state = {
            activePane: 0
        };
        this._getActivePane = this._getActivePane.bind(this);
        this._setActivePane = this._setActivePane.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState() {
    }

    _getActivePane() {
        return this.state.activePane;
    }

    _setActivePane(index) {
        this.setState({
            activePane: index
        });
    }

    _selectTab(index) {
        this.props.context.setActivePane(index);
    }

    render() {
        let { context, proText, className } = this.props,
            proNow, proMax, tabHeader, tabContent, tabList, contentFmt, containerFmt,
            proPct, style = {};

        if (context == null) {
            return null;
        }
        if (context.getActivePane == null) {
            context.getActivePane = this._getActivePane;
            context.setActivePane = this._setActivePane;
        }
        proNow       = context.getActivePane();
        proMax       = context.tabItems.length;
        contentFmt   = context.contentFmt != null ? context.contentFmt : "tab-content";
        containerFmt = context.containerFmt != null ? context.containerFmt : "container";
        style['width'] = (((proNow + 1) * 100) / proMax).toString() + "%";

        tabHeader = context.tabItems.map(function(item, idx) {
            let fmt, hdr;

            if (idx == proNow) {
                fmt = "active";
                hdr = (
                    <a data-toggle="tab" href={'#' + item.domId}
                        id={'wizard-' + item.domId}
                        onClick={this._selectTab.bind(this, idx)}>
                        <Mesg text={item.tabText}/>
                    </a>
                );
            } else {
                fmt = (idx < proNow) ? "disabled" : "hidden";
                hdr = (
                    <a className="btn-default disabled" data-toggle="tab" href="#">
                        <Mesg text={item.tabText}/>
                    </a>
                );
            }
            return (
                <li key={_.uniqueId('wizard-')} className={fmt}>
                    {hdr}
                </li>
            );
        }.bind(this));

        tabList    = this.props.children;
        tabContent = context.tabItems.map(function(item, idx) {
            let tabRef  = tabList[item.tabIdx], clsname = "tab-pane fade";

            if (idx == proNow) {
                clsname = clsname + " in active";
            }
            return (
                <div key={_.uniqueId("wizard-")} id={item.domId} className={clsname}>
                    {tabRef}
                </div>
            );
        });

        return (
            <div className={containerFmt}>
                <div className="progress">
                    <div className="progress-bar progress-bar-success"
                        role="progressbar" style={style}>
                        <span><Mesg text={proText}/> {proNow + 1} of {proMax}</span>
                    </div>
                </div>
                <div className="navbar">
                    <div className="navbar-inner">
                        <ul className="nav nav-pills">
                            {tabHeader}
                        </ul>
                    </div>
                </div>
                <div className={contentFmt}>
                    {tabContent}
                </div>
            </div>
        );
    }
}

Wizard.propTypes = {
};

export default Wizard;
