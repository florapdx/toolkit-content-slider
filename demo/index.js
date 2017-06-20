import React from 'react';
import ReactDOM from 'react-dom';
import ContentSlider from '../src';
import '../css/index.css';
import './index.css';

const media = [
  <img src="http://news.nationalgeographic.com/content/dam/news/2016/03/04/grizzly_delisting/01grizzlydelisting.jpg" />,
  <img src="http://mediad.publicbroadcasting.net/p/kufm/files/styles/x_large/public/201603/grizzly-bear_Nathan-Rupert-CC-BY-NC-ND_0.jpg" />,
  <iframe src="https://www.youtube.com/embed/4dXxojR818w?ecver=2" width="100%" height="auto" style={{position: 'absolute'}} frameBorder="0" allowFullScreen></iframe>,
  <img src="http://tetonvalleylodge.com/wp-content/uploads/2015/04/grizzly-bear-idaho.jpg" />,
  <img src="https://s-media-cache-ak0.pinimg.com/originals/1b/2c/e3/1b2ce374303c79ea98b2c3589c929c87.jpg" />
];

const news = [
  {
    headline: 'Yellowstone Grizzly Expands Habitat',
    image: 'http://www.motherjones.com/files/grizzly1_0.jpg',
    body: 'Nulla ut justo in dolor condimentum rhoncus. Etiam quis malesuada lorem, vitae feugiat turpis. Donec a quam et felis dictum mollis a id diam. Sed facilisis egestas dolor, in vulputate risus ornare vitae.'
  },
  {
    headline: 'Will grizzly bears again roam the north cascades?',
    image: 'https://secure.nrdconline.org/images/content/pagebuilder/bears_large.jpg',
    body: 'Nulla ut justo in dolor condimentum rhoncus. Etiam quis malesuada lorem, vitae feugiat turpis. Donec a quam et felis dictum mollis a id diam. Sed facilisis egestas dolor, in vulputate risus ornare vitae.'
  },
  {
    headline: 'National Park Service considers relocating grizzly bears',
    image: 'https://s-media-cache-ak0.pinimg.com/originals/8e/3d/0b/8e3d0be389c31f227101a3916edb1826.jpg',
    body: 'Nulla ut justo in dolor condimentum rhoncus. Etiam quis malesuada lorem, vitae feugiat turpis. Donec a quam et felis dictum mollis a id diam. Sed facilisis egestas dolor, in vulputate risus ornare vitae.'
  },
  {
    headline: 'Scientists see continued expansion of grizzly bear habitat',
    image: 'http://www.stephenoachs.com/photos/hallo-sow-cubs1.jpg',
    body: 'Nulla ut justo in dolor condimentum rhoncus. Etiam quis malesuada lorem, vitae feugiat turpis. Donec a quam et felis dictum mollis a id diam. Sed facilisis egestas dolor, in vulputate risus ornare vitae.'
  },
  {
    headline: 'Grizzly bears waking up at Yellowstone National Park',
    image: 'http://www.nwf.org/~/media/Content/National%20Wildlife%20Magazine%20Layouts/2006/Grizzly_Bears_spreads03.ashx?w=534&h=350&as=1',
    body: 'Nulla ut justo in dolor condimentum rhoncus. Etiam quis malesuada lorem, vitae feugiat turpis. Donec a quam et felis dictum mollis a id diam. Sed facilisis egestas dolor, in vulputate risus ornare vitae.'
  },
  {
    headline: 'Crossroads for grizzly bears',
    image: 'http://www.skolaiimages.com/journal/wp-content/uploads/2013/10/13_sep7763.jpg',
    body: 'Nulla ut justo in dolor condimentum rhoncus. Etiam quis malesuada lorem, vitae feugiat turpis. Donec a quam et felis dictum mollis a id diam. Sed facilisis egestas dolor, in vulputate risus ornare vitae.'
  }
];

ReactDOM.render(
  <div className="slider-demos">
    <div className="example-1">
      <h2>Example 1: Media slider (full-width shift)</h2>
      <ContentSlider
        uniqueIdString="example-1"
        isCircular={true}
      >
        {
          media.map((m, i) => <div key={i} style={{ position: 'relative', height: '100%' }}>{m}</div>)
        }
      </ContentSlider>
    </div>
    <div className="example-2">
      <h2>Example 2: News slider (half-width shift)</h2>
      <ContentSlider
        uniqueIdString="example-2"
        slideHalf={true}
        isCircular={true}
        showDots={false}
        maxAspectRatio={1.5}
        customStyles={{
          slide: {
            display: 'inline-block',
            backgroundColor: '#efefef',
            width: 400,
            height: 'auto',
            border: '1px solid #ccc'
          }
        }}
      >
        {
          news.map(({ headline, image, body }, idx) =>
            <div
              key={idx}
              className="news"
              style={{ width: 200, display: 'inline-block' }}
            >
              <img src={image} />
              <h3>{headline}</h3>
              <p>{body}</p>
            </div>
          )
        }
      </ContentSlider>
    </div>
  </div>,
  document.getElementById('app')
)