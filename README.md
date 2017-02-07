## Content Slider
A React component for building content sliders, including image carousels and "ticker"-type score/schedule sliders.

- Preact compatible
- flex container with style overrides
- event hooks for added flexibility
- touch enabled

## Use
```npm install @crossfield/content-slider```

## Props

*uniqueIdString*: {String}
_definition_: The unique id of the component. Will be added to element 'className' definitions. Used internally by the component to identify its constituent nodes for calculating resize and updating state.
_default_: Random number string

*children*: {Array of Elements}
_definition_: Array of slide content elements or compound components.
_default_: none

*showArrows*: {Boolean}
_definition_: Whether or not to show slider arrow controls.
_default_: true

*leftArrowIcon*: {Element}
_definition_: An element containing a src or className that refers to an icon, in whatever format. Will replace the default "prev" text if included.
_default_: none

*leftArrowIcon*: {Element}
_definition_: An element containing a src or className that refers to an icon, in whatever format. Will replace the default "next" text if included.
_default_: none

*showDots*: {Boolean}
_definition_: Whether to show slider "breadcrumb" buttons. Default style is dot.
_default_: true

*slideHalf*: {Boolean}
_definition_: Page through slider widths 1/2-width at a time. Doesn't make sense for image sliders, but may be desirable for sliders that show multiple slides in each frame -- ie, match score "ticker"-type sliders, "upcoming game" sliders, etc.
_default_: false

*easingDuration*: {Number}
_definition_: Length of transition from one frame to the next.
_default_: 0.3

*frameIndexOverride*: {Number}
_definition_: Index of the frame to show. You can pass this to initiate the slider on a frame index other than 0, or use the prop in conjunction with `clickHandlers` props or other external controls to drive the slider manually.
_default_: none

*clickHandlers*: {Object::shape: { onArrowLeft, onArrowRight }}
_definition_: Pass an object with callbacks you want to trigger on arrow button click events. Will receive the current frame index as an argument.
_default_: Empty object

*customStyles*: {Object}
_definition_: An object whose keys match one or more style definition on the component's `defaultStyles` object. Styles on these keys will be used to overwrite or augment default styles.
_default_: Empty object


## Developing and testing
```
# Run dev server

```

```
# Run tests

```
