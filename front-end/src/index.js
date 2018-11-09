import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import SelectChampion from './SelectChampion';
import ChampionPage from './ChampionPage';
import MatchPage from './MatchPage';
import SummonerName from './SummonerName';
import './index.css';

class PrimaryLayout extends Component {

    state = {
        summonerName: null
    }

    changeSummonerName = (name) => {
        this.setState({
            "summonerName": name
        });
    }

    render() {
        if (!this.state.summonerName) {
            //return <Redirect to='/' />
        }
        return (
            <div className="primary-layout">
            <main>
            <Route path="/" exact render={(props) => <SummonerName changeSummonerName={this.changeSummonerName} summonerName={this.state.summonerName} {...props} />} />
            <Route path="/choose" render={(props) => <SelectChampion summonerName={this.state.summonerName} {...props} />} />} />
            <Route path="/:champion/leaderboard" render={ChampionPage} />} />
            <Route path="/match/:match_id" render={(props) => <MatchPage summonerName={this.state.summonerName} {...props} /> } />
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
