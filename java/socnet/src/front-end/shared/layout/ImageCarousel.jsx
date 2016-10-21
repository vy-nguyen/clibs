/**
 * Vy Nguyen (2016)
 * BSD License
 */
import _     from 'lodash';
import React from 'react';

class ImageCarousel extends React.Component
{
    render() {
        let carouselId = _.uniqueId('img-list-');
        let imgHdr = this.props.imageList.map(function(item, idx) {
            let index = idx.toString();
            let id = _.uniqueId('img-list-');

            if (index == this.props.select) {
                return <li key={id} data-target={'#' + carouselId} data-slide-to={index} className='active'></li>
            }
            return <li key={id} data-target={'#' + carouselId} data-slide-to={index} className=''></li>
        }.bind(this));

        let imgList = this.props.imageList.map(function(item, idx) {
            let id = _.uniqueId('img-list-');
            return (
                <div key={id} className={idx.toString() == this.props.select ? "item active" : "item"}>
                    <img src={item}/>
                </div>
            )
        }.bind(this));

        let fontStyle = {color: "black"};
        return (
            <div className="container">
                <div className="row">
                    <div id={carouselId} className="carousel slde" data-ride="carousel" data-interval="1000">
                        <ol className="carousel-indicators">
                            {imgHdr}
                        </ol>
                        <div className="carousel-inner">
                            {imgList}
                        </div>
                        <a className="left carousel-control" href={'#' + carouselId} role="button" data-slide="prev">
                            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true" style={fontStyle}></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="right carousel-control" href={'#' + carouselId} role="button" data-slide="next">
                            <span className="glyphicon glyphicon-chevron-right" aria-hidden="true" style={fontStyle}></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageCarousel;
