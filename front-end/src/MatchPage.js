import React, { Component } from 'react';
import request from "superagent";
import {champions, profileImage} from './champion';

export default class MatchPage extends Component {

    componentDidMount() {
        console.log(this.props);
        // Load information
        const url = 'http://localhost:3000/match?matchId='+this.props.match.params.match_id+'&summonerName=' + localStorage.getItem("summonerName");
        const res = request.get(url);

        res.then((data) => {
            this.setState({data: data.body});
        });
    }

    render() {
        let text = 'Loading...'

        if (this.state && this.state.data) {
            text = `In game ${this.props.match.params.match_id} you played ${this.state.data.champData.name}`
        }

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
                  <div className="left-1">
                    <div>
                      <img className="matchpagechampimg" src="https://vignette.wikia.nocookie.net/leagueoflegends/images/6/66/Fat_Poro_Icon.png/revision/latest?cb=20150215130030" />
                    </div>
                    <div>
                      <div>Summoner Name</div>
                      <div>Rank "Number" "Champion Name" in "Region"</div>
                    </div>
                    <div>
                      <div>Match Date</div>
                      <div>% Upvoted</div>
                    </div>
                  </div>
                  <div className="left-2">
                    <div>Match ID#</div>
                    <button>Download Replay</button>
                  </div>
                  <div className="left-3">
                    <div>KDA: </div>
                    <div>Largest Killing Spree: </div>
                    <div>Game Time: </div>
                    <div>Time Stamp: </div>
                  </div>
                  <div className="left-4">
                    <div>Win/Loss: </div>
                    <div>Level: </div>
                    <div>CS: </div>
                    <div>Kill Participation: </div>
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
