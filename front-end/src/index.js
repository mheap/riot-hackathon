import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import SelectChampion from './SelectChampion';
import ChampionPage from './ChampionPage';
import MatchPage from './MatchPage';
import SummonerName from './SummonerName';
import './index.css';

class PrimaryLayout extends Component {

    render() {
        if (window.location.pathname !== "/" && !localStorage.getItem("summonerName")){
            return <Redirect to='/' />
        }

        return (
            <div className="primary-layout">
            <main>
            <Route path="/" exact component={SummonerName} />
            <Route path="/choose" component={SelectChampion} />
            <Route path="/:champion/leaderboard" component={ChampionPage} />
            <Route path="/match/:match_id" component={MatchPage} />
            </main>
            </div>
        )
    }
}

const Base = () => (
    <BrowserRouter>
    <PrimaryLayout />
    </BrowserRouter>
)

ReactDOM.render(<Base />, document.getElementById('root'))
