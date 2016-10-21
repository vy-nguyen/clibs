/**
 * Vy Nguyen (2016)
 */
import React from 'react-mod'

class SearchMobile extends React.Component
{
    constructor(props) {
        super(props);
        this._toggleSearch = this._toggleSearch.bind(this);
    }

    _toggleSearch(e) {
        e.preventDefault();
        $('body').addClass('search-mobile');
        $('#cancel-search-js').on('click', function (e) {
            $('body').removeClass('search-mobile');
        });
    }

    render() {
        return (
            <div id="search-mobile" className={this.props.className} >
                <span>
                    <a href-void onClick={this._toggleSearch} title="Search">
                        <i className="fa fa-search"/>
                    </a>
                </span>
            </div>
        )
    }
}

export default SearchMobile;
