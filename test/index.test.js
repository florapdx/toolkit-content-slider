import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import ContentSlider from '../src';

describe('ContentSlider', () => {
  let wrapper;
  let props;
  let mountTarget;

  const SLIDER_CLASS = '.csfd-content-slider';
  const SLIDER_CONTAINER_CLASS = '.csfd-content-slider-container';
  const SLIDER_CONTENT_CLASS = '.csfd-content-slider-list';
  const SLIDER_SLIDE_CLASS = '.csfd-content-slider-slide';

  const SLIDER_LEFT_ARROW_CLASS = '.csfd-content-slider-arrow-left';
  const SLIDER_RIGHT_ARROW_CLASS = '.csfd-content-slider-arrow-right';
  const SLIDER_DOTS_CLASS = '.csfd-content-slider-dots';
  const SLIDER_DOT_CLASS = '.csfd-content-slider-dot';

  before(() => {
    const targetEl = document.createElement('section');
    document.body.appendChild(targetEl);
    document.querySelector('section').id = 'target';
    mountTarget = document.querySelector('#target');
  });

  describe('initial render', () => {
    describe('default props', () => {
      const styles = {width: '200px', height: '100px'};
      before(() => {
        wrapper = mount(
          <ContentSlider>
            <div className="test-slide">
              <div style={styles}>Slide A</div>
            </div>
            <div className="test-slide">
              <div>Slide B</div>
            </div>
          </ContentSlider>,
          { attachTo: mountTarget }
        );
      });

      after(() => {
        wrapper.unmount();
      });

      it('should render a slide for each child passed in', () => {
        expect(wrapper.find(SLIDER_SLIDE_CLASS)).to.have.length(2);
      });

      it('should set default left position in state', () => {
        expect(wrapper.state().left).to.equal(0);
      });

      it('should set initial width', () => {
        const expected = document.querySelector(SLIDER_CONTAINER_CLASS).clientWidth;
        expect(wrapper.state().width).to.equal(expected);
      });

      it('should set initial height', () => {
        const expected = document.querySelector(SLIDER_CONTENT_CLASS).clientHeight;
        expect(wrapper.state().height).to.equal(expected);
      });

      it('should render arrows', () => {
        expect(wrapper.find(SLIDER_RIGHT_ARROW_CLASS)).to.have.length(1);
        expect(wrapper.find(SLIDER_LEFT_ARROW_CLASS)).to.have.length(1);
      });

      it('should render nav dots', () => {
        expect(wrapper.find(SLIDER_DOTS_CLASS)).to.have.length(1);
      });

      it('should render a dot for each slide', () => {
        expect(wrapper.find(SLIDER_DOTS_CLASS).props().children).to.have.length(2);
      });
    });

    describe('custom props', () => {
      const uniqueIdStr = 'my-test-slider';
      const slideBGColor = 'black';

      before(() => {
        wrapper = mount(
          <ContentSlider
            uniqueIdStr={uniqueIdStr}
            showArrows={false}
            showDots={false}
            customStyles={{
              slide: {
                backgroundColor: slideBGColor
              }
            }}
            frameIndexOverride={1}
          >
            <div className="test-slide">
              <div>Slide A</div>
            </div>
            <div className="test-slide">
              <div>Slide B</div>
            </div>
          </ContentSlider>,
          { attachTo: mountTarget }
        );
      });

      after(() => {
        wrapper.unmount();
      });

      it('should render a slider with the uniqueIdStr appended to root classList', () => {
        expect(wrapper.find(`${SLIDER_CLASS}.${uniqueIdStr}`)).to.have.length(1);
      });

      it('should not render arrows if showArrows false', () => {
        expect(wrapper.find(SLIDER_RIGHT_ARROW_CLASS)).to.have.length(0);
        expect(wrapper.find(SLIDER_LEFT_ARROW_CLASS)).to.have.length(0);
      });

      it('should not show nav dots if showDots false', () => {
        expect(wrapper.find(SLIDER_DOTS_CLASS)).to.have.length(0);
      });

      it('should merge any styles passed in by the user', () => {
        const styleProps = wrapper.first(SLIDER_SLIDE_CLASS).node.styles;
        expect(styleProps.slide.backgroundColor).to.equal(slideBGColor);
      });

      it('should show frame (n * container width) per given frameIndexOverride', () => {
        const state = wrapper.state();
        expect(state.left).to.equal(-1 * state.width);
      });
    });
  });

  describe('window resizing', () => {
    let component;
    let stub;

    before(() => {
      stub = sinon.stub(ContentSlider.prototype, 'setSizeAndPosition');
      component = (
        <ContentSlider>
          <div className="test-slide" />
          <div className="test-slide" />
        </ContentSlider>
      );

      wrapper = mount(
        component,
        { attachTo: mountTarget }
      );
    });

    after(() => {
      wrapper.unmount();
      stub.restore();
    });

    it('should reset slider size and position', () => {
      expect(stub.callCount).to.equal(1);
      window.dispatchEvent(new Event('resize'));
      expect(stub.callCount).to.equal(2);
    });
  });

  describe('clicking through slides - full width', () => {
    let width;
    before(() => {
      wrapper = mount(
        <ContentSlider>
          <div className="test-slide">
            <div>Slide A</div>
          </div>
          <div className="test-slide">
            <div>Slide B</div>
          </div>
        </ContentSlider>,
        { attachTo: mountTarget }
      );

      width = wrapper.state().width;
    });

    after(() => {
      wrapper.unmount();
    });

    it('should start at correct position', () => {
      expect(wrapper.state().left).to.equal(0);
      expect(wrapper.state().currentFrameIndex).to.equal(0);
      expect(wrapper.state().width).to.equal(document.body.clientWidth);
    });

    it('should not allow the user to page backwards from the first slide', () => {
      wrapper.find(SLIDER_LEFT_ARROW_CLASS).simulate('click');
      const state = wrapper.state();

      expect(state.currentFrameIndex).to.equal(0);
      expect(state.left).to.equal(0);
    });

    it('should slide to the next slide on right arrow click', () => {
      wrapper.find(SLIDER_RIGHT_ARROW_CLASS).simulate('click');
      const state = wrapper.state();

      expect(state.currentFrameIndex).to.equal(1);
      expect(state.left).to.equal(-1 * width);
    });

    it('should slide to the previous slide on left arrow click', () => {
      wrapper.find(SLIDER_LEFT_ARROW_CLASS).simulate('click');
      const state = wrapper.state();

      expect(state.currentFrameIndex).to.equal(0);
      expect(state.left).to.equal(0);
    });

    it('should not advance past the last slide', () => {
      wrapper.find(SLIDER_LEFT_ARROW_CLASS).simulate('click');
      const state = wrapper.state();

      expect(state.currentFrameIndex).to.equal(0);
      expect(state.left).to.equal(0);
    });

    it('should slide to the next slide on right dot click', () => {
      wrapper.find(SLIDER_DOT_CLASS).at(1).simulate('click');
      const state = wrapper.state();

      expect(state.currentFrameIndex).to.equal(1);
      expect(state.left).to.equal(-1 * width);
    });

    it('should slide to the previous slide on left dot click', () => {
      wrapper.find(SLIDER_DOT_CLASS).at(0).simulate('click');
      const state = wrapper.state();

      expect(state.currentFrameIndex).to.equal(0);
      expect(state.left).to.equal(0);
    });
  });
});
