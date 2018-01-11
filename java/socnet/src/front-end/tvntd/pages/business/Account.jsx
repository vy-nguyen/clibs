/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import InputBase          from 'vntd-shared/layout/InputBase.jsx';
import BusinessStore      from 'vntd-root/stores/BusinessStore.jsx';

class Account extends InputBase
{
    constructor(props) {
        let userUuid;

        super(props, _.uniqueId(), [BusinessStore]);
    }

    render() {
        return (
            <div id="content">
                <div className="wrap">
                    <div className="menu">
                        <div className="mini-menu">
                            <ul>
                                <li className="sub">
                                    <a href="#">WOMAN</a>
                                    <ul>
                                        <li><a href="#">Jackets</a></li>
                                        <li><a href="#">Blazers</a></li>
                                        <li><a href="#">Suits</a></li>
                                        <li><a href="#">Trousers</a></li>
                                        <li><a href="#">Jenas</a></li>
                                        <li><a href="#">Shirts</a></li> 
                                    </ul>
                                </li>
                                <li className="sub">
                                    <a href="#">MAN</a>
                                    <ul>
                                        <li><a href="#">Jackets</a></li>
                                        <li><a href="#">Blazers</a></li>
                                        <li><a href="#">Suits</a></li>
                                        <li><a href="#">Trousers</a></li>
                                        <li><a href="#">Jenas</a></li>
                                        <li><a href="#">Shirts</a></li> 
                                    </ul>
                                </li>
                                <li className="sub">
                                    <a href="#">KIDS</a>
                                    <ul>
                                        <li><a href="#">Jackets</a></li>
                                        <li><a href="#">Blazers</a></li>
                                        <li><a href="#">Suits</a></li>
                                        <li><a href="#">Trousers</a></li>
                                        <li><a href="#">Jenas</a></li>
                                        <li><a href="#">Shirts</a></li> 
                                    </ul>
                                </li>
                                <li className="sub">
                                    <a href="#">Shoes&Bags</a>
                                    <ul>
                                        <li><a href="#">Jackets</a></li>
                                        <li><a href="#">Blazers</a></li>
                                        <li><a href="#">Suits</a></li>
                                        <li><a href="#">Trousers</a></li>
                                        <li><a href="#">Jenas</a></li>
                                        <li><a href="#">Shirts</a></li> 
                                    </ul>
                                </li>
                            </ul>
                        </div>
            <div className="menu-colors menu-item">
                <div className="header-item" >Colors</div>
            <ul className="color-row1">
                <li className="color-circle" style={{background:"#4286f4"}}></li>
                <li className="color-circle" style={{background:"#2acc4b"}}></li>
                <li className="color-circle" style={{background:"#343534"}}></li>
                <li className="color-circle" style={{background:"#5f605f"}}></li>
                <li className="color-circle" style={{background:"#929392"}}></li>
            </ul>
            <ul className="color-row2">
                <li className="color-circle" style={{background:"#9e8045"}}></li>
                <li className="color-circle" style={{background:"#d3d3d3"}}></li>
                <li className="color-circle" style={{background:"#6b6666"}}></li>
                <li className="color-circle" style={{background:"#999797"}}></li>
                <li className="color-circle" style={{background:"#923476"}}></li>
            </ul>
            </div>
            <div className="menu-size menu-item">
                <div className="header-item" >Size</div>
            <ul className="color-row1">
                <li className="color-circle size-circle" ><p className="sizedouble">XS</p></li>
                <li className="color-circle size-circle" style={{backgroundColor:"#343534"}} ><p style={{color:"#999"}} className="size">S</p></li>
                <li className="color-circle size-circle" ><p className="size">M</p></li>
                <li className="color-circle size-circle" ><p className="size">L</p></li>
                <li className="color-circle size-circle" ><p className="sizedouble">XL</p></li>
            </ul>
            </div>
            <div className="menu-price menu-item">
                <div className="header-item" >Price</div>
            <p>
                <input type="text" readonly id="amount"  style={{border:0, color:"#f6931f", fontWeight:" bold"}}/>
                </p>
            <div id="slider-range"></div>
            </div>

            </div>

            <div className="items">

                <div className="items">
                    <div data-price="290" className="item">
                        <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSS8oEITt9vJtsCPRH0mvi2pRf8YZfN6YnkASdjsibLyayVVlidSUwG64QIWw" alt="jacket" className="img-item"></img>
                        <div className="info">
                            <h3>Our Legacy Splash Jacquard Knit</h3>
                            <p className="descroption">Black Grey Plants</p>
                            <h5>$290</h5>
                        </div>
            </div>
            <div data-price="900" className="item">
                <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSS8oEITt9vJtsCPRH0mvi2pRf8YZfN6YnkASdjsibLyayVVlidSUwG64QIWw" alt="jacket" className="img-item" ></img>
                <div className="info">
                    <h3>Our Legacy Splash Jacquard Knit</h3>
                    <p className="descroption">Black Grey Plants</p>
                    <h5>$900</h5>
                </div>
            </div>
            <div data-price="600" className="item">
                <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSS8oEITt9vJtsCPRH0mvi2pRf8YZfN6YnkASdjsibLyayVVlidSUwG64QIWw" alt="jacket" className="img-item"></img>
                <div className="info">
                    <h3>Our Legacy Splash Jacquard Knit</h3>
                    <p className="descroption">Black Grey Plants</p>
                    <h5>$600</h5>
                </div>
            </div>
            <div data-price="457" className="item">
                <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSS8oEITt9vJtsCPRH0mvi2pRf8YZfN6YnkASdjsibLyayVVlidSUwG64QIWw" alt="jacket" className="img-item"></img>
                <div className="info">
                    <h3>Our Legacy Splash Jacquard Knit</h3>
                    <p className="descroption">Black Grey Plants</p>
                    <h5>$457</h5>
                </div>
            </div>
            <div data-price="674" className="item">
                <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSS8oEITt9vJtsCPRH0mvi2pRf8YZfN6YnkASdjsibLyayVVlidSUwG64QIWw" alt="jacket" className="img-item"></img>
                <div className="info">
                    <h3>Our Legacy Splash Jacquard Knit</h3>
                    <p className="descroption">Black Grey Plants</p>
                    <h5>$647</h5>
                </div>
            </div>
            <div data-price="315" className="item">
                <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSS8oEITt9vJtsCPRH0mvi2pRf8YZfN6YnkASdjsibLyayVVlidSUwG64QIWw" alt="jacket" className="img-item"></img>
                <div className="info">
                    <h3>Our Legacy Splash Jacquard Knit</h3>
                    <p className="descroption">Black Grey Plants</p>
                    <h5>$315</h5>
                </div>
            </div>
            <div data-price="987" className="item">
                <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSS8oEITt9vJtsCPRH0mvi2pRf8YZfN6YnkASdjsibLyayVVlidSUwG64QIWw" alt="jacket" className="img-item"></img>
                <div className="info">
                    <h3>Our Legacy Splash Jacquard Knit</h3>
                    <p className="descroption">Black Grey Plants</p>
                    <h5>$987</h5>
                </div>
            </div>
            <div data-price="777" className="item">
                <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSS8oEITt9vJtsCPRH0mvi2pRf8YZfN6YnkASdjsibLyayVVlidSUwG64QIWw" alt="jacket" className="img-item"></img>
                <div className="info">
                    <h3>Our Legacy Splash Jacquard Knit</h3>
                    <p className="descroption">Black Grey Plants</p>
                    <h5>$777</h5>
                </div>
            </div>
            <div data-price="504" className="item">
                <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSS8oEITt9vJtsCPRH0mvi2pRf8YZfN6YnkASdjsibLyayVVlidSUwG64QIWw" alt="jacket" className="img-item"></img>
                <div className="info">
                    <h3>Our Legacy Splash Jacquard Knit</h3>
                    <p className="descroption">Black Grey Plants</p>
                    <h5>$504</h5>
                </div>
            </div>
            </div>
            <button className="loadmore">Load More</button>
            </div>
            </div>
            </div>
        );
    }
}

export default Account;
