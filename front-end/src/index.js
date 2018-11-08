import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import SelectChampion from './SelectChampion';
import ChampionPage from './ChampionPage';
import MatchPage from './MatchPage';
import './index.css';

const PrimaryLayout = (globalProps) => (
  <div className="primary-layout">
    <main>
      <Route path="/" exact render={(props) => <SelectChampion {...props} {...globalProps} />} />
      <Route path="/:champion/leaderboard" render={(props) => <ChampionPage {...props} {...globalProps} />} />
      <Route path="/match/:match_id" render={(props) => <MatchPage {...props} {...globalProps} />} />
    </main>
  </div>
)

const Base = () => (
  <BrowserRouter>
    <PrimaryLayout summonerName="Shiden" />
  </BrowserRouter>
)

ReactDOM.render(<Base />, document.getElementById('root'))
