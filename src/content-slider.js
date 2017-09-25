import React, { PropTypes, Component, cloneElement } from 'react';
import postcssJS from 'postcss-js';
import autoprefixer from 'autoprefixer';
const prefixer = postcssJS.sync([ autoprefixer ]);

/*
 * Generic Slider.
 * Slider contains basic carousel and slider functionality, including the ability
 * to page through frames full-container-width or half-container-width at a time
 * via optional arrows and optional breadcrumbs/dots. As such, it's useful for
 * both image galleries and "ticker"-type interfaces, such as schedule and scores
 * sliders.
 * The slider contains basic styles, all of which are overwritable by passing
 * a `customStyles` prop with the appropriate keys (see end of file styles definition.)
 * There are also hooks for responding externally to arrow clicks, so you can
 * trigger some event in a parent on frame change.
 * To manually set current visible slide, pass in `frameIndexOverride` prop.
 *
 */

class ContentSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      left: 0,
      width: 'auto', // !important
      height: 0,
      currentFrameIndex: props.frameIndexOverride ? props.frameIndexOverride : 0
    };

    // selectors include unique identifier for cases where multiple sliders rendered
    this.uniqueIdStr = props.uniqueIdStr || `csfd-${Math.round(Math.random() * 1000)}`;
    this.containerSelector = `.${SLIDER_CONTAINER_CLASS}.${this.uniqueIdStr}`;
    this.contentSelector = `.${SLIDER_CONTENT_CLASS}.${this.uniqueIdStr}`;

    this.maxAspectRatio = props.maxAspectRatio || 0.5625; // 16:9
    this.getContainerWidth = this.getContainerWidth.bind(this);
    this.getContentWidth = this.getContentWidth.bind(this);
    this.getContentHeight = this.getContentHeight.bind(this);
    this.setSizeAndPosition = this.setSizeAndPosition.bind(this);

    this.handleArrowClick = this.handleArrowClick.bind(this);
    this.handleDotClick = this.handleDotClick.bind(this);

    this.swipeStart = null;
    this.handleSwipe = this.handleSwipe.bind(this);

    this.shiftLeft = this.shiftLeft.bind(this);
    this.shiftRight = this.shiftRight.bind(this);
    this.shiftToFrame = this.shiftToFrame.bind(this);

    this.handleContentLoad = this.handleContentLoad.bind(this);

    this.styles = {};
    this.buildStyles = this.buildStyles.bind(this);

    this.buildStyles(props.customStyles);
  }

  /*
   * Add resize listener.
   */
  componentDidMount() {
    window.addEventListener('resize', this.setSizeAndPosition, false);
    document.addEventListener('readystatechange', this.setSizeAndPosition, false);
    this.setSizeAndPosition();
  }

  /*
   * Reset width and position. Useful for cases where the component is
   * mounted, and then data loaded from elsewhere comes in and parent
   * wants to render more children (lazy-loading images, etc).
   */
  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.frameIndexOverride !== nextProps.frameIndexOverride) {
      this.setState({
        currentFrameIndex: nextProps.frameIndexOverride
      });
    }

    if (this.props.customStyles !== nextProps.customStyles) {
      this.buildStyles(nextProps.customStyles);
    }

    if (this.props.children.length !== nextProps.children.length) {
      this.setSizeAndPosition();
    }
  }

  /*
   * Remove resize binding
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.setSizeAndPosition, false);
    document.removeEventListener('readystatechange', this.setSizeAndPosition, false);
  }

  /*
   * Since media is loaded after render, it's possible for dimensions
   * to be calculated without consideration of the content. This may yeild
   * collapsed slider containers.
   * Because media tag onload events don't bubble, we normally wouldn't be
   * able to attach an onload to a parent of an arbitrarily nested media tag
   * as we are doing here. However, due to the quirks of React/preact's event
   * proxying model, we are able to catch a nested media onload event
   * from arbitrarily structured children and trigger dimensions calculation
   * here.
   */
  handleContentLoad() {
    this.setSizeAndPosition();
  }

  /*
   * Build styles up front so we don't have to recalculate all
   * styles on every render.
   */
  buildStyles(customStyles = {}) {
    Object.keys(defaultStyles).forEach(rule => {
      this.styles[rule] = {
        ...defaultStyles[rule],
        ...customStyles[rule]
      };
    });
    return;
  }

  /*
   * Return current container width.
   * This should be the currently visible content, excluding
   * off-screen overflow. CSS accordingly :)
   * Uses unique class for cases where more than one slider is rendered.
   */
  getContainerWidth() {
    const container = document.querySelector(this.containerSelector);
    return container.clientWidth;
  }

  /*
   * Return current content list width and height, respectively.
   * This should be the full width, including overflow,
   * of all child elements. CSS accordingly.
   * Uses unique class for cases where more than one slider is rendered.
   * Calculates based on child length since browser implementations of flex and
   * overflow differ.
   */
  getContentWidth() {
    const contentList = document.querySelector(this.contentSelector);
    const children = contentList.children;
    return children.length ? (children[0].clientWidth * children.length) : 0;
  }

  getContentHeight() {
    const contentList = document.querySelector(this.contentSelector);
    const height = contentList.children.length ? contentList.children[0].clientHeight : 0;
    const maxHeight = this.getContainerWidth() * this.maxAspectRatio;
    return height <= maxHeight ? height : maxHeight;
  }

  /*
   * (Re)set the current left position.
   * Called on mount, as well as on resize and on any call to
   * componentWillReceiveProps if the length of the children array has
   * changed.
   *
   * If we have a new `frameIndexOverride` prop that sets `currentFrameIndex`,
   * which can be passed in by the parent component, this is where we
   * update to accommodate that request. See `props.clickHandlers` for
   * external handler options.
   */
  setSizeAndPosition() {
    const { slideHalf } = this.props;
    const { currentFrameIndex, left } = this.state;

    const width = this.getContainerWidth();
    const nextHeight = this.getContentHeight();

    let nextLeft = 0;
    if (currentFrameIndex > 0) {
      nextLeft = slideHalf ? -(Math.round(width * currentFrameIndex / 2)) :
        -(width * currentFrameIndex);
    }

    this.setState({
      left: nextLeft,
      width: width,
      height: nextHeight
    });
  }

  /*
   * Move slider back/left.
   * If `slideHalf` prop is true, moves 1/2 content element width.
   * Otherwise moves full content element width.
   */
  shiftLeft() {
    const { left, width, currentFrameIndex } = this.state;
    const { children, slideHalf, isCircular } = this.props;

    const containerWidth = this.getContainerWidth();
    const contentWidth =this.getContentWidth();

    let nextLeft;
    let nextFrameIndex;
    if (left >= 0) {
      if (isCircular) {
        nextLeft = -(contentWidth - containerWidth);
        nextFrameIndex = children.length - 1;
      } else {
        return;
      }
    } else {
      nextLeft = slideHalf ? left + Math.round(containerWidth / 2) :
        left + containerWidth;
      nextFrameIndex = currentFrameIndex > 0 ? currentFrameIndex - 1 : 0;
    }

    this.setState({
      left: nextLeft <= 0 ? nextLeft : 0,
      currentFrameIndex: nextFrameIndex
    });
  }

  /*
   * Advance the slider - move right.
   * If `slideHalf` prop is true, moves 1/2 content element width.
   * Otherwise moves full content element width.
   */
  shiftRight() {
    const { left, currentFrameIndex } = this.state;
    const { children, slideHalf, isCircular } = this.props;

    const containerWidth = this.getContainerWidth();
    const contentWidth =this.getContentWidth();

    let nextLeft;
    let nextFrameIndex;
    if (left <= -(contentWidth - containerWidth)) {
      if (isCircular) {
        nextLeft = 0;
        nextFrameIndex = 0;
      } else {
        return;
      }
    } else {
      nextLeft = slideHalf ? left - Math.round(containerWidth / 2) :
        left - containerWidth;
      nextFrameIndex = currentFrameIndex + 1;
    }

    this.setState({
      left: nextLeft,
      currentFrameIndex: nextFrameIndex
    });
  }

  /*
   * Shift to specific frame.
   */
  shiftToFrame(toIndex) {
    const { slideHalf } = this.props;

    const width = this.getContainerWidth();
    const nextLeft = slideHalf ? -(Math.round(width * toIndex / 2)) :
      -(width * toIndex);

    this.setState({
      left: nextLeft,
      currentFrameIndex: toIndex
    });
  }

  /*
   * If arrows enabled, handle left or right arrow click.
   *
   * Calls clickHandler callbacks with the current frame index in case
   * you need another component to respond to the click.
   */
  handleArrowClick(direction) {
    const { clickHandlers } = this.props;
    const { currentFrameIndex } = this.state;

    if (direction === SHIFT_LEFT) {
      this.shiftLeft();

      if (clickHandlers.onArrowLeft) {
        clickHandlers.onArrowLeft(currentFrameIndex);
      }
    } else {
      this.shiftRight();

      if (clickHandlers.onArrowRight) {
        clickHandlers.onArrowRight(currentFrameIndex);
      }
    }
  }

  handleDotClick(index) {
    const { currentFrameIndex } = this.state;

    if (index === currentFrameIndex) {
      return;
    }

    this.shiftToFrame(index);
  }

  handleSwipe(event) {
    if (event.type === 'touchstart') {
      this.swipeStart = event.touches[0].pageX;
      return;
    }

    const diff = event.changedTouches[0].pageX - this.swipeStart;
    if (diff > 0) {
      this.shiftLeft();
    } else {
      this.shiftRight();
    }
  }

  render() {
    const {
      customStyles,
      children,
      showArrows,
      leftArrowIcon,
      rightArrowIcon,
      showDots,
      easingDuration
    } = this.props;
    const { uniqueIdStr } = this;

    const {
      left,
      width,
      height,
      currentFrameIndex
    } = this.state;

    const { styles } = this;

    styles.slider = {
      ...styles.slider,
      height: height
    };

    styles.list = prefixer({
      ...styles.list,
      transition: `${easingDuration}s ease`,
      transform: `translate3d(${left}px, 0, 0)`
    });
    // @TODO(plzmakebetter): Currently, user will need to add
    // appropriate fallback rules in an external stylesheet
    // for display:flex, since we can't provide multiple values inline.
    // This is a temp fix for bug that yeilds invalid value for
    // standard `display:flex` rule in prefixer() output.
    styles.list.display = 'flex';

    styles.slide = {
      ...styles.slide,
      width
    };

    if (customStyles.slide && customStyles.slide.width) {
      styles.slide.width = customStyles.slide.width;
    }

    styles.dots = prefixer({
      ...styles.dots,
      top: height - 50
    });

    return (
      <div
        className={`${SLIDER_CLASS} ${uniqueIdStr}`}
        style={styles.slider}
      >
        {
          showArrows &&
            <button
              className={`${SLIDER_LEFT_ARROW_CLASS} ${uniqueIdStr}`}
              style={styles.arrowLeft}
              onClick={() => this.handleArrowClick(SHIFT_LEFT)}
            >
              {
                leftArrowIcon ? leftArrowIcon :
                  <span style={styles.arrowsAfter}>prev</span>
              }
            </button>
        }
        <div
          className={`${SLIDER_CONTAINER_CLASS} ${uniqueIdStr}`}
          style={styles.container}
        >
          <ul
            className={`${SLIDER_CONTENT_CLASS} ${uniqueIdStr}`}
            style={styles.list}
            onTouchStart={this.handleSwipe}
            onTouchEnd={this.handleSwipe}
            onTouchCancel={this.handleSwipe}
          >
            {
              children.map((child, idx) => (
                <li
                  key={idx}
                  className={`${SLIDER_SLIDE_CLASS}`}
                  style={styles.slide}
                >
                { // support both unwrapped and wrapped media
                  (child.type === 'img' || child.type === 'iframe') ? child :
                    cloneElement(child, {
                      style: {
                        width: 'inherit', height: 'inherit'
                      },
                      onLoad: this.handleContentLoad
                    })
                }
                </li>
              ))
            }
          </ul>
        </div>
        {
          showArrows &&
            <button
              className={`${SLIDER_RIGHT_ARROW_CLASS} ${uniqueIdStr}`}
              style={styles.arrowRight}
              onClick={() => this.handleArrowClick(SHIFT_RIGHT)}
            >
              {
                rightArrowIcon ? rightArrowIcon :
                  <span style={styles.arrowsAfter}>next</span>
              }
            </button>
        }
        {
          showDots && (
            <ul
              className={`${SLIDER_DOTS_CLASS} ${uniqueIdStr}`}
              style={styles.dots}
            >
              {
                children.map((child, idx) =>
                  <button
                    key={idx}
                    className={`csfd-content-slider-dot ${idx === currentFrameIndex && 'active'}`}
                    style={idx === currentFrameIndex ? styles.activeDot : styles.dot}
                    onClick={() => this.handleDotClick(idx)}
                  ></button>
                )
              }
            </ul>
          )
        }
      </div>
    );
  }
}

ContentSlider.defaultProps = {
  showArrows: true,
  showDots: true,
  isCircular: false,
  slideHalf: false,
  easingDuration: 0.3,
  customStyles: {},
  clickHandlers: {}
};

ContentSlider.propTypes = {
  uniqueIdStr: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
  showArrows: PropTypes.bool,
  leftArrowIcon: PropTypes.element,
  rightArrowIcon: PropTypes.element,
  showDots: PropTypes.bool,
  slideHalf: PropTypes.bool,
  isCircular: PropTypes.bool,
  easingDuration: PropTypes.number,
  frameIndexOverride: PropTypes.number,
  customStyles: PropTypes.object,
  clickHandlers: PropTypes.shape({
    onArrowLeft: PropTypes.func,
    onArrowRight: PropTypes.func
  })
};

/*
 * Component constants
 */
const SHIFT_LEFT = 'left';
const SHIFT_RIGHT = 'right';

const SLIDER_CLASS = 'csfd-content-slider';
const SLIDER_CONTAINER_CLASS = 'csfd-content-slider-container';
const SLIDER_CONTENT_CLASS = 'csfd-content-slider-list';
const SLIDER_SLIDE_CLASS = 'csfd-content-slider-slide';

const SLIDER_LEFT_ARROW_CLASS = 'csfd-content-slider-arrow-left';
const SLIDER_RIGHT_ARROW_CLASS = 'csfd-content-slider-arrow-right';
const SLIDER_DOTS_CLASS = 'csfd-content-slider-dots';

/*
 * Default styles
 */
const arrowWidth = '6em';
const arrowHeight = '4em';
const arrowBaseStyles = {
  position: 'absolute',
  top: `calc(50% - (${arrowHeight} / 2))`,
  width: arrowWidth,
  height: arrowHeight,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  border: 0,
  zIndex: 100
};

const dotStyles = {
  width: 15,
  height: 15,
  backgroundColor: '#999',
  border: 0,
  borderRadius: '50%',
  padding: 0,
  margin: '0 8px'
};

const defaultStyles = {
  slider: {
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box'
  },
  container: {
    position: 'relative',
    height: 'inherit',
    overflow: 'hidden',
    boxSizing: 'border-box'
  },
  list: {
    position: 'absolute',
    display: 'flex',
    height: 'auto',
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box'
  },
  slide: {
    position: 'relative',
    width: '100%',
    height: 'inherit',
    boxSizing: 'border-box'
  },
  dots: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    zIndex: 100
  },
  dot: dotStyles,
  activeDot: {
    ...dotStyles,
    width: dotStyles.width + 5,
    height: dotStyles.height + 5,
    backgroundColor: '#fff',
  },
  arrowLeft: {
    ...arrowBaseStyles,
    left: 0
  },
  arrowRight: {
    ...arrowBaseStyles,
    right: 0
  },
  arrowsAfter: {
    color: '#fff',
    fontSize: 18
  }
};

export default ContentSlider;
