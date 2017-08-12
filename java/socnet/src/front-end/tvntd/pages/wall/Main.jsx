/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import AdsBase            from 'vntd-shared/layout/AdsBase.jsx';
import AuthorBase         from 'vntd-shared/layout/AuthorBase.jsx';
import ProductBase        from 'vntd-shared/layout/ProductBase.jsx';
import { SectionWall }    from 'vntd-shared/layout/UserBase.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import DomainWall         from 'vntd-root/pages/personal/Domain.jsx';

class AdsWall extends AdsBase
{
    constructor(props) {
        super(props);
        this._renderAllAdsSections = this._renderAllAdsSections.bind(this);
    }

    _renderAllAdsSections() {
        return <h1>All ads</h1>;
    }

    render() {
        return (
            <SectionWall title="Ads" className="panel-info"
                render={this._renderAllAdsSections}/>
        );
    }
}

class ProdWall extends ProductBase
{
    constructor(props) {
        super(props);
        this._renderAllSections = this._renderAllSections.bind(this);
    }

    _renderAllSections() {
        return <h1>All Products</h1>;
    }

    render() {
        return (
            <SectionWall title="E-Store" className="panel-warning"
                render={this._renderAllSections}/>
        );
    }
}

class ServiceWall extends AuthorBase
{
    constructor(props) {
        super(props);
        this._renderAllSections = this._renderAllSections.bind(this);
    }

    _renderAllSections() {
        return <h1>{this.props.title}</h1>;
    }

    render() {
        return (
            <SectionWall title={this.props.title} className={this.props.className}
                render={this._renderAllSections}/>
        );
    }
}

class MainWall extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="content">
                <DomainWall/>
                <ServiceWall title="Publish Posts" className="panel-primary"/>
                <AdsWall/>
                <ServiceWall title="Services" className="panel-primary"/>
                <ProdWall/>
            </div>
        );
    }
}

export default MainWall;
