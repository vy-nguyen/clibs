/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import React  from 'react-mod';

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
    static propTypes() {
        return {
            name       : React.PropTypes.string.isRequired,
            value      : React.PropTypes.number,
            editing    : React.PropTypes.bool,
            starFmt    : React.PropTypes.string,
            noStarFmt  : React.PropTypes.string,
            onStarClick: React.PropTypes.func
        };
    }

    static defaultProps() {
        return {
            value    : 0,
            editing  : false,
            starFmt  : 'text-primary',
            noStarFmt: 'text-muted'
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    render() {
        const { name, editing, noStarFmt, starFmt } = this.props;
        let rank = _starScores[this.state.value % 10];

        let solid = null;
        if (rank.solid > 0) {
            solid = [];
            for (let i = 0; i < rank.solid; i++) {
                const key = `${name}_${i}`;
                solid.push(<i key={`so_${key}`} className={'fa fa-star fa-2x ' + starFmt}></i>);
            }
        }

        let half = null;
        if (rank.half > 0) {
            half = <i className={'fa fa-star-half-o fa-2x ' + starFmt}></i>;
        }

        let hollow = null;
        console.log(rank);
        if (rank.hollow > 0) {
            hollow = [];
            if (editing === false) {
                for (let i = 0; i < rank.hollow; i++) {
                    const key = `${name}_${i}`;
                    hollow.push(<i key={`ho_${key}`} className={'fa fa-star-o fa-2x ' + noStarFmt}></i>);
                    console.log("hollow star " + key);
                }
            }
        }
        if (editing === false) {
            return (
                <div>
                    <span>{solid}{half}{hollow}</span>
                </div>
            );
        }
        return null;
    }
}

export default StarRating;
