/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _                from 'lodash';
import React            from 'react-mod';
import Reflux           from 'reflux';
import {renderToString} from 'react-dom-server';

import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import AboutUsStore     from 'vntd-root/stores/AboutUsStore.jsx';
import NewsFeed         from '../news-feed/NewsFeed.jsx';

let PriceBox = React.createClass({

    render: function() {
        let textList = [];
        _.forOwn(this.props.textList, function(it, idx) {
            textList.push(
                <li key={_.uniqueId("price-list-")} dangerouslySetInnerHTML={{__html: it}}></li>
            );
        });
        return (
            <div className="col-xs-12 col-sm-6 col-md-3">
                <div className="panel panel-success pricing-big">
                    {this.props.headerImg}
                    <div className="panel-heading" dangerouslySetInnerHTML={{__html: this.props.headerText}}></div>
                    <div className="panel-body no-padding text-align-center">
                        <div className="the-price" dangerouslySetInnerHTML={{__html: this.props.headerDetail}}></div>
                        <div className="price-features">
                            <ul className="list-unstyled text-left">
                                {textList}
                            </ul>
                        </div>
                    </div>
                    <div className="panel-footer text-align-center">
                        <a href="#" className="btn btn-primary btn-block" role="button"><span>{this.props.footerText}</span></a>
                        <div><a href="#"><i>{this.props.footerDetail}</i></a></div>
                    </div>
                </div>
            </div>
        );
    }
});

let TeamBio = React.createClass({

    render: function() {
        return (
            <div className="col-xs-12 col-sm-3 col-md-3">
                <div className="team boxed-grey">
                    <div className="inner">
                        <h5>{this.props.name}</h5>
                        <p className="subtitle">{this.props.title}</p>
                        <div className="avatar">
                            <img src={this.props.avatar} alt="" className="img-responsive"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

let FeatureBox = React.createClass({

    render: function() {
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
});

let FeatureSection = React.createClass({

    render: function() {
        return (
            <section className={"home-section text-center " + this.props.format}>
                <div className="heading-about marginbot-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-lg-offset-2">
                                <div className="section-heading">
                                    <h1>{this.props.title}</h1>
                                    <p style={{fontSize: "130%"}}>{this.props.titleDetail}</p>
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
});

let GallerySection = React.createClass({

    render: function() {
        let images = [];
        _.forEach(this.props.imageList, function(it) {
            images.push(
                <div className="col-md-3" key={_.uniqueId("img-box-")}>
                    <a href={it} title="Image" data-lightbox-gallery="gallery1" data-lightbox-hidpi="/rs/img/pattern/pattern.png">
                        <img src={it} className="img-responsive"/>
                    </a>
                </div>
            );
        });
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12" >
                        <div className="row gallery-item">
                            {images}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

let TimeLineCenter = React.createClass({

    render: function() {
        let entries = [];
        _.forEach(this.props.timeEvents, function(event) {
            entries.push(
                <article className={"timeline-entry" + event.entryFormat}>
                    <div className="timeline-entry-inner">
                        <time className="timeline-time" datetime={event.datetime}>{event.timeMarker}</time>
                        <div className={"timeline-icon " + event.iconFormat}>
                            <i className={event.icon}></i>
                        </div>
                        <div className="timeline-label">
                            <h2><a href="#">{event.eventTitle}</a><span>{event.eventBrief}</span></h2>
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
});

let TimeLineDev = React.createClass({

    render: function() {
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
});

let MainPage = React.createClass({

    mixins: [Reflux.connect(AboutUsStore)],

    getInitialState: function() {
        return AboutUsStore.getData();
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(AboutUsStore.getData());
    },

    render: function() {
        if (UserStore.isLogin()) {
            return <NewsFeed/>;
        }
        AboutUsStore.dumpData("About Us Store");

        let screen = {
            title: "Screen Shots",
            titleDetail: "Lorem ipsum dolor sit amet, no nisl mentitum recusabo per, vim at blandit qualisque dissentiunt. Diam efficiantur conclusionemque ut has"
        };
        let team = {
            title: "Our Team",
            titleDetail: "Lorem ipsum dolor sit amet, no nisl mentitum recusabo per, vim at blandit qualisque dissentiunt. Diam efficiantur conclusionemque ut has"
        };
        let images = [
            "/rs/img/superbox/superbox-full-1.jpg",
            "/rs/img/superbox/superbox-full-2.jpg",
            "/rs/img/superbox/superbox-full-3.jpg",
            "/rs/img/superbox/superbox-full-4.jpg",
            "/rs/img/superbox/superbox-full-5.jpg",
            "/rs/img/superbox/superbox-full-6.jpg",
            "/rs/img/superbox/superbox-full-7.jpg",
            "/rs/img/superbox/superbox-full-8.jpg"
        ];
        let update = {
            title: "Updates",
            titleDetail: "Lorem ipsum dolor sit amet, no nisl mentitum recusabo per, vim at blandit qualisque dissentiunt. Diam efficiantur conclusionemque ut has",
            events: [ {
                entryFormat: "",
                dateTime   : "2016-01-10",
                timeMarker : <span>Next Year</span>,
                iconFormat : "bg-success",
                icon       : "entypo-feather",
                eventTitle : "Patch was released today",
                eventBrief : <p>Tolerably earnestly middleton extremely distrusts she boy now not. Add and offered prepare how cordial two promise. Greatly who affixed suppose but enquire compact prepare all put. Added forth chief trees but rooms think may.</p>
            }, {
                entryFormat: "", //"left-aligned",
                dateTime   : "2017-01-10",
                timeMarker : <span>Next 2 Years</span>,
                iconFormat : "bg-secondary",
                icon       : "entypo-suitcase",
                eventTitle : <span>Yahoo buys a share of <strong>ABC</strong></span>,
                eventBrief : "Yahoo decided to buy a share of ABC"
            }, {
                entryFormat: "",
                dateTime   : "2018-02-28",
                timeMarker : <span>Next 3 Years</span>,
                iconFormat : "bg-info",
                icon       : "entypo-location",
                eventTitle : "Busy Day!",
                eventBrief : (
                    <div>
                        <blockquote>Place was booked till 3am!</blockquote>
                        <img src="/rs/img/util/map.png" alt="map" className="img-responsive"/>
                    </div>
                )
            }, {
                entryFormat: "left-aligned",
                dateTime   : "2019-03-30",
                timeMarker : <span>Next 4 Years</span>,
                iconFormat : "bg-warning",
                icon       : "entypo-camera",
                eventTitle : "We are the world",
                eventBrief : "We are the world"
            }, {
                entryFormat: "",
                dateTime   : "2020-03-12",
                timeMarker : <span>Next 5 Years</span>,
                iconFormat : "bg-secondary",
                icon       : "entypo-suitcase",
                eventTitle : "Someting important",
                eventBrief : "Something else isn't important"
            } ]
        };

        if (this.state.goals == null) {
            return (<h1>Waiting for data...</h1>);
        }
        let goalBoxes = [];
        let goals = this.state.goals;
        _.forOwn(goals.panes, function(item) {
            goalBoxes.push(
                <PriceBox key={_.uniqueId('goal-box-')}
                    headerText={item.header}
                    headerImg={null}
                    headerDetail={item.headerHL}
                    textList={item.bodyText}
                    footerText={item.footer}
                    footerDetail={item.footerHL}/>
            );
        });
        let features = this.state.features;
        let featureBoxes = [];
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
        let welcome = this.state.welcome;
        return (
            <div id="content">
                <FeatureSection title={welcome.title} titleDetail={welcome.titleDetail} format="bg-gray">
                </FeatureSection>

                <FeatureSection title={goals.title} titleDetail={goals.titleDetail}>
                    {goalBoxes}
                </FeatureSection>

                <FeatureSection title={features.title} titleDetail={features.titleDetail} format="bg-gray">
                    {featureBoxes}
                </FeatureSection>

                <FeatureSection title={screen.title} titleDetail={screen.titleDetail}>
                    <GallerySection imageList={images}/>
                </FeatureSection>

                <FeatureSection title={team.title} titleDetail={team.titleDetail} format="bg-gray">
                    <TeamBio name="TBD" title="TBD" avatar="/rs/img/avatars/male.png"/>
                    <TeamBio name="TBD" title="TBD" avatar="/rs/img/avatars/male.png"/>
                    <TeamBio name="TBD" title="TBD" avatar="/rs/img/avatars/male.png"/>
                    <TeamBio name="TBD" title="TBD" avatar="/rs/img/avatars/male.png"/>
                </FeatureSection>

                <FeatureSection title={update.title} titleDetail={update.titleDetail}>
                    <TimeLineDev timeEvents={update.events}/>
                </FeatureSection>
            </div>
        );
    {/*
        <section id="quotes" className="home-section text-center bg-gray">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                        <div className="quote"><i className="fa fa-quote-left fa-4x"></i></div>
                        <div className="carousel slide" id="fade-quote-carousel" data-ride="carousel" data-interval="3000">
                            <ol className="carousel-indicators">
                                <li data-target="#fade-quote-carousel" data-slide-to="0" className="active"></li>
                                <li data-target="#fade-quote-carousel" data-slide-to="1"></li>
                                <li data-target="#fade-quote-carousel" data-slide-to="2"></li>
                            </ol>
                            <div className="carousel-inner">
                                <div className="active item">
                                    <blockquote>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, veritatis nulla eum laudantium totam tempore optio doloremque laboriosam quas.</p>
                                    </blockquote>
                                    <div className="profile-circle" style="background-color: rgba(0,0,0,.2);"></div>
                                </div>
                                <div className="item">
                                    <blockquote>
                                        <p>Lorem ipsum dolor sit amet, eaque molestias odio aut eius animi. Impedit temporibus nisi accusamus.</p>
                                    </blockquote>
                                    <div className="profile-circle" style="background-color: rgba(77,5,51,.2);"></div>
                                </div>
                                <div className="item">
                                    <blockquote>
                                        <p>Consectetur adipisicing elit. Quidem, veritatis  aut eius animi. Impedit temporibus nisi accusamus.</p>
                                    </blockquote>
                                    <div className="profile-circle" style="background-color: rgba(145,169,216,.2);"></div>
                                </div>
                            </div>
                        </div>
                    </div>                          
                </div>
            </div>
        </section>
        */}
    }
});

export default MainPage;
