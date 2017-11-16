/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import React            from 'react-mod';
import PropTypes        from 'prop-types';

const _starScores = [
    { solid: 0, half: 0, hollow: 5 },  // 0
    { solid: 0, half: 1, hollow: 4 },  // 1
    { solid: 1, half: 0, hollow: 4 },  // 2
    { solid: 1, half: 1, hollow: 3 },  // 3
    { solid: 2, half: 0, hollow: 3 },  // 4
    { solid: 2, half: 1, hollow: 2 },  // 5
    { solid: 3, half: 0, hollow: 2 },  // 6
    { solid: 3, half: 1, hollow: 1 },  // 7
    { solid: 4, half: 0, hollow: 1 },  // 8
    { solid: 4, half: 1, hollow: 0 },  // 9
    { solid: 5, half: 0, hollow: 0 }   // 10
];

class StarRating extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    render() {
        let idx = 0;
        const { name, editing, noStarFmt, starFmt } = this.props;
        let rank = _starScores[this.state.value % 10];

        let solid = null;
        if (rank.solid > 0) {
            solid = [];
            for (let i = 0; i < rank.solid; i++, idx++) {
                const key = `star-${name}-${idx}`;
                const cls = `fa fa-star fa-2x ${starFmt}`;
                if (editing === false) {
                    solid.push(<i key={key} className={cls}></i>);
                } else {
                    solid.push(<input type='radio' name={name} id={key} key={key} ref={key}/>);
                    solid.push(
                        <label for={key}>
                            <i className={cls}></i>
                        </label>
                    );
                }
            }
        }

        let half = null;
        if (rank.half > 0) {
            const key = `star-${name}-${idx}`;
            const cls = `fa fa-star-half-o fa-2x ${starFmt}`;
            if (editing === false) {
                half = <i className={cls}></i>;
            } else {
                half = [];
                half.push(<input type='radio' name={name} id={key} key={key} ref={key}/>);
                half.push(
                    <label for={key}>
                        <i className={cls}></i>
                    </label>
                );
            }
            idx++;
        }

        let hollow = null;
        if (rank.hollow > 0) {
            hollow = [];
            for (let i = 0; i < rank.hollow; i++, idx++) {
                const key = `star-${name}-${idx}`;
                const cls = `fa fa-star-o fa-2x ${starFmt}`;
                if (editing === false) {
                    hollow.push(<i key={`ho_${key}`} className={'fa fa-star-o fa-2x ' + noStarFmt}></i>);
                } else {
                    hollow.push(<input type='radio' name={name} id={key} key={key} ref={key}/>);
                    hollow.push(
                        <label for={key}>
                            <i className={cls}></i>
                        </label>
                    );
                }
            }
        }
        let rating = (
            <div className='rating'>
                <span>{solid}{half}{hollow}</span>
            </div>
        );
        if (editing === false) {
            return rating;
        }
        return (
            <div className='smart-form'>
                {rating};
            </div>
        );
    }
}

StarRating.propTypes = {
    name       : PropTypes.string.isRequired,
    value      : PropTypes.number,
    editing    : PropTypes.bool,
    starFmt    : PropTypes.string,
    noStarFmt  : PropTypes.string,
    onStarClick: PropTypes.func
};

StarRating.defaultProps = {
    value    : 0,
    editing  : false,
    starFmt  : 'text-primary',
    noStarFmt: 'text-muted'
};

export default StarRating;
