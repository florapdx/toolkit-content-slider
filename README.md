## Content Slider
A React component for building content sliders, including image carousels and "ticker"-type score/schedule sliders.

- Preact compatible
- flex container with style overrides
- event hooks for added flexibility
- touch enabled

Slider demos are staged [here](https://stagingslider-jorzfvbzug.now.sh/)


## Installation and use
ContentSlider is currently a private package, published under the `@crossfield` scope. As such, you'll need to obtain a crossfield npm token to install the editor in your project, and to build and deploy your project on remote servers.

```
# Install package and dependency
$ NPM_TOKEN=xxxx-xxxx-xxxxx-xx npm install @crossfield/content-slider

# Install postcssJS and autoprefixer in order to prefix inlined styles.
$ npm install json-loader

# These require you to add a couple things to your webpack configs:
## at depth 0 of config object
node: {
  fs: 'empty'
},

## inside modules.loaders or modules.rules
{
  test: /\.json$/,
  loader: 'json-loader'
}
```

There's a css file that contains some helpful styles for working w/iframes, images, and fix for mobile browsers that don't contain flexbox support w/o prefixing. There are additional hints in this css file for troubleshooting IE issues around flexbox and the height of slider content (TLDR - you may need to add height overrides for IE).


## Props

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| uniqueIdString | string | The unique id of the component. Will be added to element 'className' definitions. Used internally by the component to identify its constituent nodes for calculating resize and updating state. | generated random string |
| children | array of React elements | Array of slide content elements or compound components. | none |
| showArrows | boolean | Whether or not to show slider arrow controls. | true |
| isCircular | boolean | Whether the carousel slides back to start position when right arrow clicked on last slide, or to the last slide when left arrow clicked on the first slide. Requires showArrows to be true. | false |
| leftArrowIcon | React element | An element containing a src or className that refers to an icon, in whatever format. Will replace the default "prev" text if included. | none |
| rightArrowIcon | React element | An element containing a src or className that refers to an icon, in whatever format. Will replace the default "next" text if included. | none |
| showDots | boolean | Whether to show slider "breadcrumb" buttons. Default style is dot. | true |
| slideHalf | boolean | Page through slider widths 1/2-width at a time. Doesn't make sense for image sliders, but may be desirable for sliders that show multiple slides in each frame -- ie, match score "ticker"-type sliders, "upcoming game" sliders, etc. | false |
| easingDuration | number | Length of transition from one frame to the next. | 0.3 |
| maxAspectRatio | number | Slider content height relative to the width. Default value works for most media-only content, however you'll likely want to adjust the ratio for mixed content (or anything that would be constrained by this property on mobile). | 0.5625 (16:9 aspect ratio) |
| frameIndexOverride | number | Index of the frame to show. You can pass this to initiate the slider on a frame index other than 0, or use the prop in conjunction with `clickHandlers` props or other external controls to drive the slider manually. | none |
| clickHandlers | object::shape { onArrowLeft, onArrowRight } | Pass an object with callbacks you want to trigger on arrow button click events. Will receive the current frame index as an argument. | {} |
| customStyles | object | An object whose keys match one or more style definition on the component's `defaultStyles` object. Styles on these keys will be used to overwrite or augment default styles. | {} |

```
## custom styles keys:
{
  slider,
  container,
  list,
  slide,
  dots,
  dot,
  activeDot,
  arrowLeft,
  arrowRight,
  arrowsAfter
}
```

## Development
```
$ npm start
## dev demo running at localhost:3000

```

## Tests
Tests can be run via Node or in the browser:
```
## Node
$ npm test

## Browser
$ npm run test:browser
```

## Publishing
Steps to publish to npm:
1. Make sure you have group permissions, and log back into npm in your console:
  `npm login --scope=@crossfield --registry=https://registry.npmjs.org/`
2. Bump the version in `package.json` and commit
3. Add a git tag: `$ git tag #.#.#` (please follow semver :)
4. `$ git push origin #.#.#`
5. `$ npm publish`
