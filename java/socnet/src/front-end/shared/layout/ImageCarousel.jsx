/**
 * Vy Nguyen (2016)
 * BSD License
 */
import _     from 'lodash';
import React from 'react';

class ImageCarousel extends React.Component
{
    constructor(props) {
        super(props);
        this.redStyle = { color: 'red' };
        this.yelStyle = { color: 'yellow' };
    }

    _renderLeftArrow(cTag) {
        let left = "glyphicon glyphicon-chevron-left";
        return (
            <a className="left carousel-control"
                href={cTag} role="button" data-slide="prev">
                <i className={left} style={this.yelStyle}/>
                <span className="sr-only">Previous</span>
            </a>
        );
    }

    _renderRightArrow(cTag) {
        let right = "glyphicon glyphicon-chevron-right";
        return (
            <a className="right carousel-control"
                href={cTag} role="button" data-slide="next">
                <i className={right} style={this.yelStyle}/>
                <span className="sr-only">Next</span>
            </a>
        );
    }

    render() {
        let imgHdr, imgList,
            carouselId = _.uniqueId('img-list-'), cTag = '#' + carouselId;

        imgHdr = this.props.imageList.map(function(item, idx) {
            let index = idx.toString(),
                classn = index === this.props.select ? 'active' : '';

            return (
                <li key={_.uniqueId('img-')} data-target={cTag}
                    data-slide-to={index} className={classn}></li>
            );
        }.bind(this));

        imgList = this.props.imageList.map(function(item, idx) {
            let classn = idx.toString() === this.props.select ? 'item active' : 'item';
            return (
                <div key={_.uniqueId('img-')} className={classn}>
                    <img src={item}/>
                </div>
            )
        }.bind(this));

        return (
            <div className="container">
                <div className="row">
                    <div id={carouselId} className="carousel slde"
                        data-ride="carousel" data-interval="1000">
                        <ol className="carousel-indicators">
                            {imgHdr}
                        </ol>
                        <div className="carousel-inner">
                            {imgList}
                        </div>
                        {this._renderLeftArrow(cTag)}
                        {this._renderRightArrow(cTag)}
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageCarousel;
