/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _                from 'lodash';
import React            from 'react-mod';
import {Link}           from 'react-router';
import ReactSpinner     from 'react-spinjs';

import Gallery          from 'vntd-shared/layout/Gallery.jsx';
import ModalHtml        from 'vntd-shared/layout/ModalHtml.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import AboutUsStore     from 'vntd-root/stores/AboutUsStore.jsx';
import Lang             from 'vntd-root/stores/LanguageStore.jsx';
import NewsFeed         from '../news-feed/NewsFeed.jsx';
import ErrorNotify      from './ErrorNotify.jsx';

class PriceBox extends React.Component
{
    render() {
        let textList = [];
        _.forOwn(this.props.textList, function(it, idx) {
            textList.push(
                <li key={_.uniqueId("price-list-")}
                    dangerouslySetInnerHTML={{__html: it}}></li>
            );
        });
        return (
            <div className="col-xs-12 col-sm-6 col-md-3">
                <div className="panel panel-success pricing-big">
                    {this.props.headerImg}
                    <div className="panel-heading"
                        dangerouslySetInnerHTML={{__html: this.props.headerText}}>
                    </div>
                    <div className="panel-body no-padding text-align-center">
                        <div className="the-price"
                            dangerouslySetInnerHTML={{__html: this.props.headerDetail}}>
                        </div>
                        <div className="price-features">
                            <ul className="list-unstyled text-left">
                                {textList}
                            </ul>
                        </div>
                    </div>
                    <div className="panel-footer text-align-center">
                        <ModalHtml className="btn btn-primary btn-block"
                            modalTitle={this.props.modalTitle}
                            buttonText={this.props.footerText} url={this.props.modalUrl}/>
                        <div><i>{this.props.footerDetail}</i></div>
                    </div>
                </div>
            </div>
        );
    }
}

class TeamBio extends React.Component
{
    render() {
        return (
            <div className="col-xs-12 col-sm-3 col-md-3">
                <div className="team boxed-grey">
                    <div className="inner">
                        <h3>{this.props.name}</h3>
                        <p className="subtitle"><strong>{this.props.title}</strong></p>
                        <div className="avatar">
                            <img src={this.props.avatar}
                                alt="" className="img-responsive"/>
                        </div>
                        <p>{this.props.teamDesc}</p>
                    </div>
                </div>
            </div>
        );
    }
}

class FeatureBox extends React.Component
{
    render() {
        return (
            <div className="col-sm-3 col-md-3">
                <div className="service-box">
                    <div className="service-icon">
                        <i className={this.props.icon + " fa-3x"}></i>
                    </div>
                    <div className="service-desc">
                        <h5>{this.props.title}</h5>
                        {this.props.children}
                    </div>
                </div> 
            </div>
        );
    }
}

class FeatureSection extends React.Component
{
    render() {
        return (
            <section className={"home-section text-center " + this.props.format}>
                <div className="heading-about marginbot-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-lg-offset-2">
                                <div className="section-heading">
                                    <br/>
                                    <div style={{fontSize: "300%"}}>
                                        <h1><strong>{this.props.title}</strong></h1>
                                    </div>
                                    <br/>
                                    <p style={{fontSize: "140%"}}>
                                        {this.props.titleDetail}
                                    </p>
                                    <br/>
                                    <br/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        {this.props.children}
                    </div>
                </div>
            </section>
        );
    }
}

class TimeLineCenter extends React.Component
{
    render() {
        let entries = [];
        _.forEach(this.props.timeEvents, function(event) {
            entries.push(
                <article className={"timeline-entry" + event.entryFormat}>
                    <div className="timeline-entry-inner">
                        <time className="timeline-time" datetime={event.datetime}>
                            {event.timeMarker}
                        </time>
                        <div className={"timeline-icon " + event.iconFormat}>
                            <i className={event.icon}></i>
                        </div>
                        <div className="timeline-label">
                            <h2><a href="#">{event.eventTitle}</a>
                                <span>{event.eventBrief}</span>
                            </h2>
                            {event.eventText}
                        </div>
                    </div>
                </article>
            );
        });
        return (
            <div className="container">
                <div className="row">
                    <div className="timeline-centered">
                        {entries}
                    </div>
                </div>
            </div>
        );
    }
}

class TimeLineDev extends React.Component
{
    render() {
        let entries = [];
        _.forEach(this.props.timeEvents, function(event) {
            entries.push(
                <li key={_.uniqueId('front-tl-')}>
                    <div className={"smart-timeline-icon " + event.iconFormat}>
                        <i className={event.icon}></i>
                    </div>
                    <div className="smart-timeline-time">
                        <small>{event.timeMarker}</small>
                    </div>
                    <div className="smart-timeline-content">
                        <h2><a href="#">{event.eventTitle}</a></h2>
                        <h3><span>{event.eventBrief}</span></h3>
                        {event.eventText}
                    </div>
                </li>
            );
        });
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="well well-sm">
                            <div className="smart-timeline">
                                <ul className="smart-timeline-list">
                                    {entries}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class AboutUs extends React.Component
{
    constructor(props) {
        super(props);
        this._updateState = this._updateState.bind(this);
        this.state = AboutUsStore.getData();
    }

    componentDidMount() {
        this.unsub = AboutUsStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data) {
        this.setState(AboutUsStore.getData());
    }

    render() {
        let goalBoxes = [], featureBoxes = [], teamBoxes = [], screenBox,
            plan = this.state.plan,
            welcome = this.state.welcome,
            goals = this.state.goals,
            screen = this.state.screen,
            features = this.state.features;

        if (goals == null) {
            return (<ReactSpinner/>);
        }
        _.forOwn(goals.panes, function(item) {
            goalBoxes.push(
                <PriceBox key={_.uniqueId('goal-box-')}
                    headerText={item.header}
                    headerImg={null}
                    headerDetail={item.headerHL}
                    textList={item.bodyText}
                    modalUrl={item.modalUrl}
                    modalTitle={item.modalTitle}
                    footerText={item.footer}
                    footerDetail={item.footerHL}/>
            );
        });
        _.forOwn(features.features, function(item) {
            let text = [];
            let key = _.uniqueId('feature-box-');

            _.forOwn(item.text, function(it, idx) {
                text.push(<p key={key + idx}>{it}</p>);
            });
            featureBoxes.push(
                <FeatureBox key={key} icon={item.icon} title={item.title}>
                    {text} 
                </FeatureBox>
            );
        });
        _.forOwn(this.state.team.members, function(item) {
            teamBoxes.push(
                <TeamBio key={_.uniqueId('team-bio-')} name={item.name}
                    title={item.title} avatar={item.avatar} teamDesc={item.teamDesc}/>
            );
        });
        if (screen != null) {
            screenBox = (
                <FeatureSection title={this.state.screen.title}
                    titleDetail={this.state.screen.titleDetail}>
                    <Gallery imageList={this.state.screen.images}/>
                </FeatureSection>
            );
        } else {
            screenBox = null;
        }
        return (
            <div id="content">
                <ErrorNotify errorId="main-error"/>
                <FeatureSection title={welcome.title}
                    titleDetail={welcome.titleDetail} format="bg-gray">
                    <div className="panel-footer text-align-center">
                        <ModalHtml buttonFmt="btn btn-lg btn-primary"
                            modalTitle={Lang.translate("About This Project")}
                            buttonText="Read More" url="/public/get-html/vision"/>
                    </div>
                </FeatureSection>

                <FeatureSection title={goals.title} titleDetail={goals.titleDetail}>
                    {goalBoxes}
                </FeatureSection>

                <FeatureSection title={features.title}
                    titleDetail={features.titleDetail} format="bg-gray">
                    {featureBoxes}
                </FeatureSection>

                {screenBox}

                <FeatureSection title={this.state.team.title}
                    titleDetail={this.state.team.titleDetail} format="bg-gray">
                    {teamBoxes}
                </FeatureSection>

                <FeatureSection title={plan.title} titleDetail={plan.titleDetail}>
                    <TimeLineDev timeEvents={plan.events}/>
                </FeatureSection>

                <section className="home-section text-center">
                    <div className="container">
                        <Link to="/register/form" style={{fontSize: "250%"}}
                            className="btn btn-primary">
                            {this.state.register.text}
                        </Link>
                    </div>
                </section>
            </div>
        );
    }
}

class MainPage extends React.Component
{
    render() {
        if (UserStore.isLogin()) {
            return <NewsFeed/>;
        }
        return <AboutUs/>
    }
}

export { MainPage, AboutUs }
export default MainPage;
