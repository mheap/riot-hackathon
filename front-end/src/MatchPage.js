import React, { Component } from 'react';
import request from "superagent";
import {champions, profileImage} from './champion';

export default class MatchPage extends Component {

    state = {};
    //state = {
    //    game: {
    //            championId: 1234,
    //            position: 'Top',
    //            queueType: 'rankedsolo',
    //            rankTier: 'Gold',
    //            csDiffAtLaningEnd: -28,
    //            csPerMinute: 4,
    //            damagePerDeath: 1939,
    //            damagePerGold: 1834,
    //            damageShare: 18.3,
    //            goldDiffAtLaningEnd: -1022,
    //            kda: 0.18,
    //            killConversionRatio: 0.8,
    //            killParticipation: 66,
    //            objectiveControlRatio: 0.3,
    //            roamDominanceScore: 1093,
    //            utilityScore:  283,
    //            visionScorePerHour:  14,
    //        };

    //}
    componentDidMount() {
        console.log(this.props);
        // Load information
        const url = 'http://localhost:3000/match?matchId='+this.props.match.params.match_id+'&summonerName=' + localStorage.getItem("summonerName");
        const res = request.get(url);

        res.then((data) => {
            console.log(data.body);
            this.setState({
                champion: data.body.champData,
                stats: data.body.userParticipant[0].timeline
            });
        });
    }

    render() {
        let champion = this.state.champion;

        {/*if (!this.state || !this.state.champion) {
            return (
              <div>
                <a href="/">
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
                <div className="championpagecontainer">
                  <div className="championpagetop">
                    <div className="championTitle script">Loading...</div>
                  </div>
                </div>
              </div>
            );
        }*/}

        return (
            <div>
              <a href="/">
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
                      <div className="shadow text1 matchsummonername">Summoner Name</div>
                      <div>Rank "Number" "Champion Name" in "Region"</div>
                    </div>
                  </div>
                  <div className="matchpageleftbox">
                    <div>Match ID#: </div>
                    <div>Match Date: </div>
                    <button className="downloadbutton">WATCH REPLAY</button>
                  </div>
                  <div className="matchpageleftbox">
                    <div className="statbox">
                      <div className="stat">KDA: </div>
                      <div className="stat">Largest Killing Spree: </div>
                      <div className="stat">Game Time: </div>
                      <div className="stat">Time Stamp: </div>
                    </div>
                    <div className="statbox">
                      <div className="stat">Win/Loss: </div>
                      <div className="stat">Level: </div>
                      <div className="stat">CS: </div>
                      <div className="stat">Kill Participation: </div>
                    </div>
                  </div>
                </div>
                <div className="matchpageright">
                  <div className="championimagebox">
                    <img className="matchpagechampimg" src="https://i.imgur.com/ghyDiLCl.jpg" />
                  </div>
                  <div className="championname">Champion Name</div>
                  <div className="championdescription">Champion Description</div>
                </div>

              </div>
            </div>
        )
    }

}
