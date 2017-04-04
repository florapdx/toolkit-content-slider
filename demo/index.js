import React from 'react';
import ReactDOM from 'react-dom';
import ContentSlider from '../src/content-slider';

const media = [
  <img src="http://www.crossfield.com/assets/social_img-312c420b0aa797fbd1470d9f42b914b6a860d391030251db0afbace10e4f80f5.png" />,
  <iframe width="100%" src="https://www.youtube.com/embed/C0DPdy98e4c" frameBorder="0" allowFullScreen></iframe>,
  <img src="http://www.crossfield.com/assets/work/icc/cms-7984cb41b4dfe42924fc0d1ba7675c2dfc94f5d533a6d2d7bbb7824205697f4e.png" />
];

const scores = [
  {
    matchTitle: 'Match-o-rama',
    a: { name: 'ATL', score: 30 },
    b: { name: 'SEA', score: 20 }
  },
  {
    matchTitle: 'Mismatch',
    a: { name: 'BOS', score: 50},
    b: { name: 'DAL', score: 40}
  },
  {
    matchTitle: 'Matchy-Matchy',
    a: { name: 'CLE', score: 20 },
    b: { name: 'PHI', score: 10 }
  },
  {
    matchTitle: 'Minimatch',
    a: { name: 'LAC', score: 60 },
    b: { name: 'LAK', score: 0 }
  },
  {
    matchTitle: 'Title Match',
    a: { name: 'HUS', score: 20 },
    b: { name: 'DAL', score: 20 }
  },
  {
    matchTitle: 'MC Match Lyte',
    a: { name: 'DET', score: 10 },
    b: { name: 'MIN', score: 0 }
  },
  {
    matchTitle: 'Matchless',
    a: { name: 'LSA' , score: 80 },
    b: { name: 'TEN', score: 40 }
  },
  {
    matchTitle: 'No Match',
    a: { name: 'POR', score: 40 },
    b: { name: 'SLC', score: 10 }
  }
];

ReactDOM.render(
  <div className="slider-demos">
    <div className="example-1">
      <h2>Example 1: Media slider</h2>
      <ContentSlider
        uniqueIdString="example-1"
      >
        {
          media.map((m, i) => <div key={i} style={{ height: '100%' }}>{m}</div>)
        }
      </ContentSlider>
    </div>
    <div className="example-2">
      <h2>Example 2: Half-width paginating score slider</h2>
      <ContentSlider
        uniqueIdString="example-2"
        slideHalf={true}
        customStyles={{
          slide: {
            display: 'inline-block',
            backgroundColor: '#efefef',
            width: 400,
            height: 200,
            border: '1px solid #ccc'
          }
        }}
      >
        {
          scores.map((ex, idx) =>
            <div key={idx} style={{ width: 200, height: 200, display: 'inline-block' }}>
              <p>{ex.matchTitle}</p>
              <div>{`${ex.a.name} - ${ex.a.score}`}</div>
              <div>{`${ex.b.name} - ${ex.b.score}`}</div>
            </div>
          )
        }
      </ContentSlider>
    </div>
  </div>,
  document.getElementById('app')
)