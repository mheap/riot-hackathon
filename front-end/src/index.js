import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import SelectChampion from './SelectChampion';
import './index.css';

const ChampionPage = () => <div>Champion Page</div>

const PrimaryLayout = () => (
  <div className="primary-layout">
    <main>
      <Route path="/" exact component={SelectChampion} />
      <Route path="/:champion/leaderboard" component={ChampionPage} />
    </main>
  </div>
)

const Base = () => (
  <BrowserRouter>
    <PrimaryLayout />
  </BrowserRouter>
)

ReactDOM.render(<Base />, document.getElementById('root'))
