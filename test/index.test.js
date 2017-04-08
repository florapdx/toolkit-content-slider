import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import ContentSlider from '../src';

describe('ContentSlider', () => {
  let wrapper;
  let props;

  describe('initial render', () => {
    props = {
      uniqueIdStr: 'foobar'
    };

    wrapper = shallow(
      <ContentSlider {...props}>
        <div>foo</div>
        <div>bar</div>
      </ContentSlider>
    );

    it('should render a slide for each child passed in', () => {
      expect(wrapper.find('.slide')).length.to.equal(2);
    });

    it('should set default left position', () => {

    });

    it('should set initial width', () => {

    });

    it('should set initial height', () => {

    });

    it('should render arrows if showArrows true', () => {

    });

    it('should not render arrows if showArrows false', () => {

    });

    it('should show nav dots if showDots true', () => {

    });

    it('should not show nav dots if showDots false', () => {

    });

    it('should merge any styles passed in by the user', () => {

    });
  });

  describe('window resizing', () => {
    it('should reset slider width', () => {

    });

    it('should reset slider height', () => {

    });
  });

  describe('clicking through slides - full width', () => {
    it('should set left position one slide-width left on left arrow click', () => {

    });

    it('should set right position one slide-width right on right arrow click', () => {

    });

    it('should set left position one slide-width left on previous dot click', () => {

    });

    it('should set right position one slide-width right on next dot click', () => {

    });

    it('should not advance past the last slide', () => {

    });

    it('should not allow the user to page backwards from the first slide', () => {

    });
  });

  describe('swiping through slides', () => {

  });
});
