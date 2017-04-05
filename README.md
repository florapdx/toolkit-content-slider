## Content Slider
A React component for building content sliders, including image carousels and "ticker"-type score/schedule sliders.

- Preact compatible
- flex container with style overrides
- event hooks for added flexibility
- touch enabled

Slider demos are staged [here](https://stagingslider-jorzfvbzug.now.sh/)


## Use

```
# Install package and dependency
$ npm install @crossfield/content-slider
$ npm install json-loader

# installs postcssJS and autoprefixer in order to prefix inlined styles.
# These require you to add a couple things to your webpack configs:

...
// at depth 0 of config object
node: {
  fs: 'empty'
},

// inside modules.loaders or modules.rules
{
  test: /\.json$/,
  loader: 'json-loader'
}
...

# @TODO: another solution that doesn't have dependencies?
```

There's a css file that contains some helpful styles for working w/iframes, images, and fix for mobile browsers that don't contain flexbox support w/o prefixing.


## Props

**uniqueIdString**: {String}

_definition_: The unique id of the component. Will be added to element 'className' definitions. Used internally by the component to identify its constituent nodes for calculating resize and updating state.

_default_: Random number string


**children**: {Array of Elements}

_definition_: Array of slide content elements or compound components.

_default_: none


**showArrows**: {Boolean}

_definition_: Whether or not to show slider arrow controls.

_default_: true


**leftArrowIcon**: {Element}

_definition_: An element containing a src or className that refers to an icon, in whatever format. Will replace the default "prev" text if included.

_default_: none


**rightArrowIcon**: {Element}

_definition_: An element containing a src or className that refers to an icon, in whatever format. Will replace the default "next" text if included.

_default_: none


**showDots**: {Boolean}

_definition_: Whether to show slider "breadcrumb" buttons. Default style is dot.

_default_: true


**slideHalf**: {Boolean}

_definition_: Page through slider widths 1/2-width at a time. Doesn't make sense for image sliders, but may be desirable for sliders that show multiple slides in each frame -- ie, match score "ticker"-type sliders, "upcoming game" sliders, etc.

_default_: false


**easingDuration**: {Number}

_definition_: Length of transition from one frame to the next.

_default_: 0.3


**maxAspectRatio**: {Number}

_definition_: Slider content height relative to the width. Default value works for most media-only content, however you'll likely want to adjust the ratio for mixed content (or anything that would be constrained by this property on mobile).

_default_: 0.5625 (16:9 aspect ratio)


**frameIndexOverride**: {Number}

_definition_: Index of the frame to show. You can pass this to initiate the slider on a frame index other than 0, or use the prop in conjunction with `clickHandlers` props or other external controls to drive the slider manually.

_default_: none


**clickHandlers**: {Object::shape: { onArrowLeft, onArrowRight }}

_definition_: Pass an object with callbacks you want to trigger on arrow button click events. Will receive the current frame index as an argument.

_default_: Empty object


**customStyles**: {Object}

_definition_: An object whose keys match one or more style definition on the component's `defaultStyles` object. Styles on these keys will be used to overwrite or augment default styles.

_default_: Empty object


## Development
```
# Run dev server
$ npm start

// open localhost:3000

```

## Tests
```
## TODO
```
