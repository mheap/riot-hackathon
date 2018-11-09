import React, { Component } from 'react';
import request from "superagent";
import {profileImage} from './champion';

export default class MatchPage extends Component {

    state = {};
    componentDidMount() {
        // Load information
        const baseUrl = 'http://localhost:3000';
        //const baseUrl = 'http://roflmao.eastus.cloudapp.azure.com:3000';
        const url = baseUrl + '/match?matchId='+this.props.match.params.match_id+'&summonerName=' + localStorage.getItem("summonerName");
        console.log(url);
        const res = request.get(url);

        res.then((data) => {
            console.log(data.body);
            this.setState({
                champion: data.body.champData,
                stats: data.body.rawGameScore,
                raw: data.body.userParticipant[0].stats,
                items: data.body.userItems
            });
        });
    }

    render() {
        let champion = this.state.champion;
        let stats = this.state.stats;
        let raw = this.state.raw;
        let items = this.state.items;

        console.log(items);

        if (!champion) {
            return null;
        }

        return (
            <div>
              <a href="/me">
                <div id="arrowAnim">
                  <div className="arrowSliding">
                    <div className="arrow"></div>
                  </div>
                  <div className="arrowSliding delay1">
                    <div className="arrow"></div>
                  </div>
                  <div className="arrowSliding delay2">
                    <div className="arrow"></div>
                  </div>
                  <div className="arrowSliding delay3">
                    <div className="arrow"></div>
                  </div>
                </div>
              </a>



              <div className="matchpagecontainer">
                <div className="matchpageleft">
                  <div className="matchpageleftbox">
                    <div>
                      <img className="matchpagechampimg" src="https://vignette.wikia.nocookie.net/leagueoflegends/images/6/66/Fat_Poro_Icon.png/revision/latest?cb=20150215130030" />
                    </div>
                    <div>
                      <div className="shadow text1 matchsummonername">{localStorage.getItem('summonerName')}</div>
                      <div>Rank "Number" {champion.name} in "Region"</div>
                    </div>
                  </div>
                  <div className="matchpageleftbox">
                    <div>Match ID#: </div>
                    <div>Match Date: </div>
                    <button className="downloadbutton">WATCH REPLAY</button>
                  </div>
                  <div className="matchpageleftbox">
                    <div>
                    <h4>Items</h4>
                    <ul>
                    {items.map((item, i) => {
                        if (!item) { return ""; }
                        return <li key={i}>{item.name}</li>
                    })}
                    </ul>
                    </div>

                    <div className="statbox">
                      <div className="stat">KDA: {raw.kills}/{raw.deaths}/{raw.assists} ({Math.round(stats.kda*100)/100})</div>
                      <div className="stat">Largest Killing Spree: {raw.largestKillingSpree}</div>
                      <div className="stat">Game Time: </div>
                      <div className="stat">Time Stamp: </div>
                    </div>
                    <div className="statbox">
                      <div className="stat">Win/Loss: </div>
                      <div className="stat">Level: </div>
                      <div className="stat">CS: </div>
                      <div className="stat">Kill Participation: </div>

                      <div className="stat">Damage Dealt: {raw.totalDamageDealt}</div>
                      <div className="stat">Damage Taken: {raw.totalDamageTaken}</div>
                      <div className="stat">Vision Score: {raw.visionScore}</div>
                    </div>
                  </div>
                </div>
                <div className="matchpageright">
                  <div className="championimagebox">
                    <img className="matchpagechampimg" src={profileImage(champion.name)} />
                  </div>
                  <div className="championname">{champion.name}</div>
                  <div className="championdescription">{champion.blurb}</div>
                </div>

              </div>
            </div>
        )
    }

}
