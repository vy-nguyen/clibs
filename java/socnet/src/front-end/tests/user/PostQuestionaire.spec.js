/**
 * Written by Vy Nguyen (2017)
 * Test with React 14
 */
import React              from 'react';
import Enzyme, { mount, shallow } from 'enzyme';

import EnzymeAdapter      from 'enzyme-adapter-react-14';
import {expect}           from 'chai';

import PostQuestionare    from '../../tvntd/pages/user/PostQuestionare.jsx';

// Setup enzyme's react adapter
Enzyme.configure({
    adapter: new EnzymeAdapter()
});

describe('<PostQuestionare/>', function () {
    it('Something abc...', function () {
        const wrapper = shallow(<PostQuestionare/>);
        console.log(".....d dfsfs");
        console.log(wrapper);
    });

    it('Other tests...', function () {
        const wrapper = shallow(<PostQuestionare/>);
        console.log(wrapper);
    });
});
