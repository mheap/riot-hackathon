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
                items: data.body.userItems,
                gametime: data.body.gameDuration,
                killParticipation: data.body.rawGameScore.killParticipation,
                csPerMinute: data.body.rawGameScore.creepKillsPerMinute,
                matchId: this.props.match.params.match_id,
                dmgPercentage: data.body.rawGameScore.teamDamagePercentage,
                internalRanking: data.body.internalRanking
            });
        });
    }

    render() {
        let champion = this.state.champion;
        let stats = this.state.stats;
        let raw = this.state.raw;
        let items = this.state.items;
        let gametime = this.state.gametime;
        let killParticipation = this.state.killParticipation;
        let csPerMinute = this.state.csPerMinute;
        let matchId = this.state.matchId;
        let dmgPercentage = this.state.dmgPercentage;
        let sumIconID = this.state.sumIconID;

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
                      <img className="matchpagechampimg" src={"http://ddragon.leagueoflegends.com/cdn/8.22.1/img/profileicon/" + sumIconID + ".png"} />
                    </div>
                    <div>
                      <div className="shadow text1 matchsummonername">{localStorage.getItem('summonerName')}</div>
                      <div>Ranking: {this.state.internalRanking}</div>
                    </div>
                  </div>
                  <div className="matchpageleftbox">
                    <div>Match ID#: {matchId}</div>
                    <a href={"roflmao://match-id/" + matchId} className="downloadbutton">WATCH REPLAY</a>
                  </div>
                  <div className="matchpageleftbox">
                    <div>
                      <h4 className="itemstitle">Items</h4>
                      <div className="items">
                        {items.map((item) => {
                            if (!item) { return ""; }
                            return <span>-{item.name}</span>
                        })}
                      </div>
                    </div>

                    <div className="statbox">
                      <div className="stat">Game Time: {Math.round(gametime / 60)} mins</div>
                      <div className="stat">KDA: {raw.kills}/{raw.deaths}/{raw.assists} ({Math.round(stats.kda*100)/100})</div>
                      <div className="stat">Largest Killing Spree: {raw.largestKillingSpree}</div>
                    </div>
                    <div className="statbox">
                      <div className="stat">CS: {gametime * csPerMinute}</div>
                      <div className="stat">CS Per Min: {Math.round(csPerMinute * 100) / 100}</div>
                      <div className="stat">Kill Participation: {Math.round(killParticipation * 100)}%</div>
                      <div className="stat">Damage Dealt: {raw.totalDamageDealt}</div>
                      <div className="stat">Team Damage Share: {Math.round(dmgPercentage * 100)}%</div>
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
