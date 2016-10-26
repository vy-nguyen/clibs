/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import React from 'react-mod'

let rawItems = require('json!../../mock-json/e-store-pdetail.json');

class ProductDetail extends React.Component
{
    render() {
        return (
<div id="content">
    <div className="row">
        <div className="col-xs-12 col-sm-7 col-md-7 col-lg-4">
            <h1 className="page-title txt-color-blueDark">
                <i className="fa-fw fa fa-home"></i>
                E-commerce
							<span>>
								Products View
							</span>
            </h1>
        </div>
        <div className="col-xs-12 col-sm-5 col-md-5 col-lg-8 text-right">

            <a href="javascript:void(0);" className="btn btn-default shop-btn">
                <i className="fa fa-3x fa-shopping-cart"></i>
                <span className="air air-top-right label-danger txt-color-white padding-5">10</span>
            </a>
            <a href="javascript:void(0);" className="btn btn-default">
                <i className="fa fa-3x fa-print"></i>
            </a>

        </div>

    </div>
    {/*
        The ID "widget-grid" will start to initialize all widgets below
        You do not need to use widgets if you dont want to. Simply remove
        the <section></section> and you can use wells or panels instead
    */}
    <section id="widget-grid" className="">
        <div className="row">

            <div className="col-sm-12 col-md-12 col-lg-12">
                <div className="product-content product-wrap clearfix product-deatil">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 col-xs-12 ">
                            <div className="product-image">
                                <div id="myCarousel-2" className="carousel slide">
                                    <ol className="carousel-indicators">
                                        <li data-target="#myCarousel-2" data-slide-to="0" className=""></li>
                                        <li data-target="#myCarousel-2" data-slide-to="1" className="active"></li>
                                        <li data-target="#myCarousel-2" data-slide-to="2" className=""></li>
                                    </ol>
                                    <div className="carousel-inner">
                                        <div className="item active">
                                            <img src="/rs/img/demo/e-comm/detail-1.png" alt=""/>
                                        </div>
                                        <div className="item">
                                            <img src="/rs/img/demo/e-comm/detail-2.png" alt=""/>
                                        </div>
                                        <div className="item">
                                            <img src="/rs/img/demo/e-comm/detail-3.png" alt=""/>
                                        </div>
                                    </div>
                                    <a className="left carousel-control" href="#myCarousel-2" data-slide="prev"> <span className="glyphicon glyphicon-chevron-left"></span> </a>
                                    <a className="right carousel-control" href="#myCarousel-2" data-slide="next"> <span className="glyphicon glyphicon-chevron-right"></span> </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 col-xs-12">

                            <h2 className="name">
                                Product Name Title Here
                                <small>Product by <a href="javascript:void(0);">Adeline</a></small>
                                <i className="fa fa-star fa-2x text-primary"></i>
                                <i className="fa fa-star fa-2x text-primary"></i>
                                <i className="fa fa-star fa-2x text-primary"></i>
                                <i className="fa fa-star fa-2x text-primary"></i>
                                <i className="fa fa-star fa-2x text-muted"></i>
                                <span className="fa fa-2x"><h5>(109) Votes</h5></span>

                                <a href="javascript:void(0);">109 customer reviews</a>

                            </h2>
                            <hr/>
                            <h3 className="price-container">
                                $129.54
                                <small>*includes tax</small>
                            </h3>

                            <div className="certified">
                                <ul>
                                    <li><a href="javascript:void(0);">Delivery time<span>7 Working Days</span></a></li>
                                    <li><a href="javascript:void(0);">Certified<span>Quality Assured</span></a></li>
                                </ul>
                            </div>
                            <hr/>
                            <div className="description description-tabs">

                                <ul id="myTab" className="nav nav-pills">
                                    <li className="active"><a href="#more-information" data-toggle="tab" className="no-margin">Product Description </a></li>
                                    <li className=""><a href="#specifications" data-toggle="tab">Specifications</a></li>
                                    <li className=""><a href="#reviews" data-toggle="tab">Reviews</a></li>
                                </ul>
                                <div id="myTabContent" className="tab-content">
                                    <div className="tab-pane fade active in" id="more-information">
                                        <br/>
                                        <strong>Description Title</strong>
                                        <p>Integer egestas, orci id condimentum eleifend, nibh nisi pulvinar eros, vitae ornare massa neque ut orci. Nam aliquet lectus sed odio eleifend, at iaculis dolor egestas. Nunc elementum pellentesque augue sodales porta. Etiam aliquet rutrum turpis, feugiat sodales ipsum consectetur nec. </p>
                                    </div>
                                    <div className="tab-pane fade" id="specifications">
                                        <br/>
                                        <dl className="">
                                            <dt>Gravina</dt>
                                            <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
                                            <dd>Donec id elit non mi porta gravida at eget metus.</dd>
                                            <dd>Eget lacinia odio sem nec elit.</dd>
                                            <br/>

                                            <dt>Test lists</dt>
                                            <dd>A description list is perfect for defining terms.</dd>
                                            <br/>

                                            <dt>Altra porta</dt>
                                            <dd>Vestibulum id ligula porta felis euismod semper</dd>
                                        </dl>
                                    </div>
                                    <div className="tab-pane fade" id="reviews">
                                        <br/>
                                        <form method="post" className="well padding-bottom-10" onsubmit="return false;">
                                            <textarea rows="2" className="form-control" placeholder="Write a review"></textarea>
                                            <div className="margin-top-10">
                                                <button type="submit" className="btn btn-sm btn-primary pull-right">
                                                    Submit Review
                                                </button>
                                                <a href="javascript:void(0);" className="btn btn-link profile-link-btn" rel="tooltip" data-placement="bottom" title="" data-original-title="Add Location"><i className="fa fa-location-arrow"></i></a>
                                                <a href="javascript:void(0);" className="btn btn-link profile-link-btn" rel="tooltip" data-placement="bottom" title="" data-original-title="Add Voice"><i className="fa fa-microphone"></i></a>
                                                <a href="javascript:void(0);" className="btn btn-link profile-link-btn" rel="tooltip" data-placement="bottom" title="" data-original-title="Add Photo"><i className="fa fa-camera"></i></a>
                                                <a href="javascript:void(0);" className="btn btn-link profile-link-btn" rel="tooltip" data-placement="bottom" title="" data-original-title="Add File"><i className="fa fa-file"></i></a>
                                            </div>
                                        </form>

                                        <div className="chat-body no-padding profile-message">
                                            <ul>
                                                <li className="message">
                                                    <img src="/rs/img/avatars/1.png" className="online"/>
																<span className="message-text">
																	<a href="javascript:void(0);" className="username">
                                                                        Alisha Molly
                                                                        <span className="badge">Purchase Verified</span>
																		<span className="pull-right">
																			<i className="fa fa-star fa-2x text-primary"></i>
																			<i className="fa fa-star fa-2x text-primary"></i>
																			<i className="fa fa-star fa-2x text-primary"></i>
																			<i className="fa fa-star fa-2x text-primary"></i>
																			<i className="fa fa-star fa-2x text-muted"></i>
																		</span>
                                                                    </a>


																	Can't divide were divide fish forth fish to. Was can't form the, living life grass darkness very image let unto fowl isn't in blessed fill life yielding above all moved
																</span>
                                                    <ul className="list-inline font-xs">
                                                        <li>
                                                            <a href="javascript:void(0);" className="text-info"><i className="fa fa-thumbs-up"></i> This was helpful (22)</a>
                                                        </li>
                                                        <li className="pull-right">
                                                            <small className="text-muted pull-right ultra-light"> Posted 1 year ago </small>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li className="message">
                                                    <img src="/rs/img/avatars/2.png" className="online"/>
																<span className="message-text">
																	<a href="javascript:void(0);" className="username">
                                                                        Aragon Zarko
                                                                        <span className="badge">Purchase Verified</span>
																		<span className="pull-right">
																			<i className="fa fa-star fa-2x text-primary"></i>
																			<i className="fa fa-star fa-2x text-primary"></i>
																			<i className="fa fa-star fa-2x text-primary"></i>
																			<i className="fa fa-star fa-2x text-primary"></i>
																			<i className="fa fa-star fa-2x text-primary"></i>
																		</span>
                                                                    </a>


																	Excellent product, love it!
																</span>
                                                    <ul className="list-inline font-xs">
                                                        <li>
                                                            <a href="javascript:void(0);" className="text-info"><i className="fa fa-thumbs-up"></i> This was helpful (22)</a>
                                                        </li>
                                                        <li className="pull-right">
                                                            <small className="text-muted pull-right ultra-light"> Posted 1 year ago </small>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-sm-12 col-md-6 col-lg-6">

                                    <a href="javascript:void(0);" className="btn btn-success btn-lg">Add to cart ($129.54)</a>

                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="btn-group pull-right">
                                        <button className="btn btn-white btn-default"><i className="fa fa-star"></i> Add to wishlist </button>
                                        <button className="btn btn-white btn-default"><i className="fa fa-envelope"></i> Contact Seller</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12">
                <div className="product-content product-wrap clearfix product-deatil">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 col-xs-12 ">
                            <div className="product-image">
                                <div id="myCarousel-3" className="carousel fade">
                                    <ol className="carousel-indicators">
                                        <li data-target="#myCarousel-3" data-slide-to="0" className=""></li>
                                        <li data-target="#myCarousel-3" data-slide-to="1" className="active"></li>
                                        <li data-target="#myCarousel-3" data-slide-to="2" className=""></li>
                                    </ol>
                                    <div className="carousel-inner">
                                        <div className="item active">
                                            <img src="/rs/img/demo/e-comm/detail-1.png" alt=""/>
                                        </div>
                                        <div className="item">
                                            <img src="/rs/img/demo/e-comm/detail-2.png" alt=""/>
                                        </div>
                                        <div className="item">
                                            <img src="/rs/img/demo/e-comm/detail-3.png" alt=""/>
                                        </div>
                                    </div>
                                    <a className="left carousel-control" href="#myCarousel-3" data-slide="prev"> <span className="glyphicon glyphicon-chevron-left"></span> </a>
                                    <a className="right carousel-control" href="#myCarousel-3" data-slide="next"> <span className="glyphicon glyphicon-chevron-right"></span> </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 col-xs-12">

                            <h2 className="name">
                                Product Name Title Here
                                <small>Product by <a href="javascript:void(0);">Adeline</a></small>
                                <i className="fa fa-star fa-2x text-primary"></i>
                                <i className="fa fa-star fa-2x text-primary"></i>
                                <i className="fa fa-star fa-2x text-primary"></i>
                                <i className="fa fa-star fa-2x text-primary"></i>
                                <i className="fa fa-star fa-2x text-muted"></i>
                                <span className="fa fa-2x"><h5>(109) Votes</h5></span>

                                <a href="javascript:void(0);">109 customer reviews</a>

                            </h2>
                            <hr/>
                            <div className="row">

                                <div className="col-sm-6">
                                    <h3 className="price-container">
                                        $129.54
                                        <small>*includes tax</small>
                                    </h3>
                                </div>
                                <div className="col-sm-6 text-right">
                                    <a href="javascript:void(0);" className="btn btn-primary">Add to cart ($129.54)</a>
                                </div>
                            </div>


                            <hr/>
                            <div className="description description-tabs">


                                <ul id="myTab2" className="nav nav-tabs">
                                    <li className="active"><a href="#more-information2" data-toggle="tab" className="no-margin">Product Description </a></li>
                                    <li className=""><a href="#specifications2" data-toggle="tab">Specifications</a></li>
                                    <li className=""><a href="#reviews2" data-toggle="tab">Reviews</a></li>
                                </ul>
                                <div id="myTabContent2" className="tab-content">
                                    <div className="tab-pane fade active in" id="more-information2">
                                        <br/>
                                        <strong>Description Title</strong>
                                        <p>Integer egestas, orci id condimentum eleifend, nibh nisi pulvinar eros, vitae ornare massa neque ut orci. Nam aliquet lectus sed odio eleifend, at iaculis dolor egestas. Nunc elementum pellentesque augue sodales porta. Etiam aliquet rutrum turpis, feugiat sodales ipsum consectetur nec. </p>
                                    </div>
                                    <div className="tab-pane fade" id="specifications2">
                                        <br/>
                                        <dl className="">
                                            <dt>Gravina</dt>
                                            <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
                                            <dd>Donec id elit non mi porta gravida at eget metus.</dd>
                                            <dd>Eget lacinia odio sem nec elit.</dd>
                                            <br/>

                                            <dt>Test lists</dt>
                                            <dd>A description list is perfect for defining terms.</dd>
                                            <br/>

                                            <dt>Altra porta</dt>
                                            <dd>Vestibulum id ligula porta felis euismod semper</dd>
                                        </dl>
                                    </div>
                                    <div className="tab-pane fade" id="reviews2">
                                        <br/>
                                        <form method="post" className="well padding-bottom-10" onsubmit="return false;">
                                            <textarea rows="2" className="form-control" placeholder="Write a review"></textarea>
                                            <div className="margin-top-10">
                                                <button type="submit" className="btn btn-sm btn-primary pull-right">
                                                    Submit Review
                                                </button>
                                                <a href="javascript:void(0);" className="btn btn-link profile-link-btn" rel="tooltip" data-placement="bottom" title="" data-original-title="Add Location"><i className="fa fa-location-arrow"></i></a>
                                                <a href="javascript:void(0);" className="btn btn-link profile-link-btn" rel="tooltip" data-placement="bottom" title="" data-original-title="Add Voice"><i className="fa fa-microphone"></i></a>
                                                <a href="javascript:void(0);" className="btn btn-link profile-link-btn" rel="tooltip" data-placement="bottom" title="" data-original-title="Add Photo"><i className="fa fa-camera"></i></a>
                                                <a href="javascript:void(0);" className="btn btn-link profile-link-btn" rel="tooltip" data-placement="bottom" title="" data-original-title="Add File"><i className="fa fa-file"></i></a>
                                            </div>
                                        </form>

                                        <div className="chat-body no-padding profile-message">
                                            <ul>
                                                <li className="message">
                                                    <img src="/rs/img/avatars/1.png" className="online"/>
                                                    <span className="message-text"> <a href="javascript:void(0);" className="username">John Doe <small className="text-muted pull-right ultra-light"> 2 Minutes ago </small></a> Can't divide were divide fish forth fish to. Was can't form the, living life grass darkness very image let unto fowl isn't in blessed fill life yielding above all moved </span>
                                                    <ul className="list-inline font-xs">
                                                        <li>
                                                            <a href="javascript:void(0);" className="text-info"><i className="fa fa-reply"></i> Reply</a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0);" className="text-danger"><i className="fa fa-thumbs-up"></i> Like</a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0);" className="text-muted">Show All Comments (14)</a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0);" className="text-primary">Hide</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li className="message message-reply">
                                                    <img src="/rs/img/avatars/3.png" className="online"/>
                                                    <span className="message-text"> <a href="javascript:void(0);" className="username">Serman Syla</a> eget lacinia odio sem nec eliteget lacinia odio sem nec elit. <i className="fa fa-smile-o txt-color-orange"></i> </span>

                                                    <ul className="list-inline font-xs">
                                                        <li>
                                                            <a href="javascript:void(0);" className="text-muted">1 minute ago </a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0);" className="text-danger"><i className="fa fa-thumbs-up"></i> Like</a>
                                                        </li>
                                                    </ul>

                                                </li>
                                                <li className="message message-reply">
                                                    <img src="/rs/img/avatars/4.png" className="online"/>
                                                    <span className="message-text"> <a href="javascript:void(0);" className="username">Sadi Orlaf </a> Eet lacinia odio sem nec elit. <i className="fa fa-smile-o txt-color-orange"></i> </span>

                                                    <ul className="list-inline font-xs">
                                                        <li>
                                                            <a href="javascript:void(0);" className="text-muted">a moment ago </a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0);" className="text-danger"><i className="fa fa-thumbs-up"></i> Like</a>
                                                        </li>
                                                    </ul>

                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="btn-group">
                                        <button className="btn btn-white btn-default"><i className="fa fa-star"></i> Add to wishlist </button>
                                        <button className="btn btn-white btn-default"><i className="fa fa-envelope"></i> Contact Seller</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>


    </section>
</div>
        )
    }
}

export default ProductDetail;
