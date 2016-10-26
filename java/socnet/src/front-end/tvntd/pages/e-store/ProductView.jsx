/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import React from 'react-mod'

let rawItems = require('json!../../mock-json/e-store-pview.json');

class ProductView extends React.Component
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

            <div className="col-sm-6 col-md-6 col-lg-6">
                <div className="product-content product-wrap clearfix">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 col-xs-12">
                            <div className="product-image">
                                <img src="/rs/img/demo/e-comm/1.png" alt="194x228" className="img-responsive"/> 
												<span className="tag2 hot">
													HOT
												</span>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 col-xs-12">
                            <div className="product-deatil">
                                <h5 className="name">
                                    <a href="#">
                                        Product Name Title Here <span>Category</span>
                                    </a>
                                </h5>
                                <p className="price-container">
                                    <span>$99</span>
                                </p>
                                <span className="tag1"></span>
                            </div>
                            <div className="description">
                                <p>Proin in ullamcorper lorem. Maecenas eu ipsum </p>
                            </div>
                            <div className="product-info smart-form">
                                <div className="row">
                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                        <a href="javascript:void(0);" className="btn btn-success">Add to cart</a>
                                    </div>
                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                        <div className="rating">
                                            <input type="radio" name="stars-rating" id="stars-rating-5"/>
                                            <label for="stars-rating-5"><i className="fa fa-star"></i></label>
                                            <input type="radio" name="stars-rating" id="stars-rating-4"/>
                                            <label for="stars-rating-4"><i className="fa fa-star"></i></label>
                                            <input type="radio" name="stars-rating" id="stars-rating-3"/>
                                            <label for="stars-rating-3"><i className="fa fa-star text-primary"></i></label>
                                            <input type="radio" name="stars-rating" id="stars-rating-2"/>
                                            <label for="stars-rating-2"><i className="fa fa-star text-primary"></i></label>
                                            <input type="radio" name="stars-rating" id="stars-rating-1"/>
                                            <label for="stars-rating-1"><i className="fa fa-star text-primary"></i></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-sm-6 col-md-6 col-lg-6">
                <div className="product-content product-wrap clearfix">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 col-xs-12">
                            <div className="product-image">
                                <img src="/rs/img/demo/e-comm/2.png" alt="194x228" className="img-responsive"/> 
												<span className="tag2 sale">
													Sale
												</span>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 col-xs-12">
                            <div className="product-deatil">
                                <h5 className="name">
                                    <a href="#">
                                        Product Name Title Here <span>Category</span>
                                    </a>
                                </h5>
                                <p className="price-container">
                                    <span>$109</span>
                                </p>
                                <span className="tag1"></span>
                            </div>
                            <div className="description">
                                <p>Proin in ullamcorper lorem. Maecenas eu ipsum </p>
                            </div>
                            <div className="product-info smart-form">
                                <div className="row">
                                    <div className="col-md-6 col-sm-6 col-xs-6"> <a href="javascript:void(0);" className="btn btn-success">Add to cart</a> </div>
                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                        <div className="rating">

                                            <input type="radio" name="stars-rating" id="stars-rating-5"/>
                                            <label for="stars-rating-5"><i className="fa fa-star"></i></label>
                                            <input type="radio" name="stars-rating" id="stars-rating-4"/>
                                            <label for="stars-rating-4"><i className="fa fa-star"></i></label>
                                                <input type="radio" name="stars-rating" id="stars-rating-3"/>
                                            <label for="stars-rating-3"><i className="fa fa-star text-primary"></i></label>
                                                <input type="radio" name="stars-rating" id="stars-rating-2"/>
                                            <label for="stars-rating-2"><i className="fa fa-star text-primary"></i></label>
                                                <input type="radio" name="stars-rating" id="stars-rating-1"/>
                                            <label for="stars-rating-1"><i className="fa fa-star text-primary"></i></label>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-sm-6 col-md-6 col-lg-4">
                <div className="product-content product-wrap clearfix">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 col-xs-12">
                            <div className="product-image">
                                <img src="/rs/img/demo/e-comm/3.png" alt="194x228" className="img-responsive"/> 
												<span className="tag2 hot">
													HOT
												</span>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 col-xs-12">
                            <div className="product-deatil">
                                <h5 className="name">
                                    <a href="#">
                                        Product Name Title Here <span>Category</span>
                                    </a>
                                </h5>
                                <p className="price-container">
                                    <span>$399</span>
                                </p>
                                <span className="tag1"></span>
                            </div>
                            <div className="description">
                                <p>Proin in ullamcorper lorem. Maecenas eu ipsum </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-sm-6 col-md-6 col-lg-4">
                <div className="product-content product-wrap clearfix">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 col-xs-12">
                            <div className="product-image">
                                <img src="/rs/img/demo/e-comm/4.png" alt="194x228" className="img-responsive"/> 
												<span className="tag2 sale">
													Sale
												</span>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 col-xs-12">
                            <div className="product-deatil">
                                <h5 className="name">
                                    <a href="#">
                                        Product Name Title Here <span>Category</span>
                                    </a>
                                </h5>
                                <p className="price-container">
                                    <span>$19</span>
                                </p>
                                <span className="tag1"></span>
                            </div>
                            <div className="description">
                                <p>Proin in ullamcorper lorem. Maecenas eu ipsum </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-sm-6 col-md-6 col-lg-4">
                <div className="product-content product-wrap clearfix">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 col-xs-12">
                            <div className="product-image">
                                <img src="/rs/img/demo/e-comm/5.png" alt="194x228" className="img-responsive"/> 
												<span className="tag2 sale">
													Sale
												</span>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 col-xs-12">
                            <div className="product-deatil">
                                <h5 className="name">
                                    <a href="#">
                                        Product Name Title Here <span>Category</span>
                                    </a>
                                </h5>
                                <p className="price-container">
                                    <span>$195</span>
                                </p>
                                <span className="tag1"></span>
                            </div>
                            <div className="description">
                                <p>Proin in ullamcorper lorem. Maecenas eu ipsum </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-sm-6 col-md-6 col-lg-4">
                <div className="product-content product-wrap clearfix">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 col-xs-12">
                            <div className="product-image">
                                <img src="/rs/img/demo/e-comm/7.png" alt="194x228" className="img-responsive"/> 
												<span className="tag2 sale">
													Sale
												</span>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 col-xs-12">
                            <div className="product-deatil">
                                <h5 className="name">
                                    <a href="#">
                                        Product Name Title Here <span>Category</span>
                                    </a>
                                </h5>
                                <p className="price-container">
                                    <span>$99</span>
                                </p>
                                <span className="tag1"></span>
                            </div>
                            <div className="description">
                                <p>Proin in ullamcorper lorem. Maecenas eu ipsum </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-sm-6 col-md-6 col-lg-4">
                <div className="product-content product-wrap clearfix">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 col-xs-12">
                            <div className="product-image">
                                <img src="/rs/img/demo/e-comm/8.png" alt="194x228" className="img-responsive"/> 
												<span className="tag2 sale">
													Sale
												</span>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 col-xs-12">
                            <div className="product-deatil">
                                <h5 className="name">
                                    <a href="#">
                                        Product Name Title Here <span>Category</span>
                                    </a>
                                </h5>
                                <p className="price-container">
                                    <span>$109</span>
                                </p>
                                <span className="tag1"></span>
                            </div>
                            <div className="description">
                                <p>Proin in ullamcorper lorem. Maecenas eu ipsum </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-sm-6 col-md-6 col-lg-4">
                <div className="product-content product-wrap clearfix">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 col-xs-12">
                            <div className="product-image">
                                <img src="/rs/img/demo/e-comm/9.png" alt="194x228" className="img-responsive"/> 
												<span className="tag2 sale">
													Sale
												</span>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 col-xs-12">
                            <div className="product-deatil">
                                <h5 className="name">
                                    <a href="#">
                                        Product Name Title Here <span>Category</span>
                                    </a>
                                </h5>
                                <p className="price-container">
                                    <span>$399</span>
                                </p>
                                <span className="tag1"></span>
                            </div>
                            <div className="description">
                                <p>Proin in ullamcorper lorem. Maecenas eu ipsum</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-sm-12 text-center">
                <a href="javascript:void(0);" className="btn btn-primary btn-lg">Load more <i className="fa fa-arrow-down"></i></a>
            </div>

        </div>
    </section>
</div>
        )
    }
}

export default ProductView;
