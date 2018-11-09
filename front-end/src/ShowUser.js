import React, { Component } from 'react';
import request from "superagent";
import {profileImage} from './champion';

export default class ShowUser extends Component {

    state = {
        matches: []
    }

    componentDidMount() {

        const baseUrl = 'http://localhost:3000';
        //const baseUrl = 'http://roflmao.eastus.cloudapp.azure.com:3000';
        const url = baseUrl + '/match-history/' + localStorage.getItem("summonerName");
        const res = request.get(url);

        res.then((data) => {
            let matches = data.body.map((m) => {
                if (!m.champion[0]){
                    return false;
                }
                return {
                    "champion": m.champion[0].name,
                    "match_id": m.gameId,
                    "kda": "TBC",
                    "ranking": "TBC"
                }
            });
            matches = matches.filter((m) => m);

                 this.setState({
                     matches: matches
                 });
        });
    }

    render() {
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
              <div className="championTitle script">{localStorage.getItem('summonerName')}</div>
            <div className="championpagebottom">
              <table className="championGames">
            <thead>
                <tr className="championGame">
                  <th>Image</th>
                  <th>World Ranking</th>
                  <th>Summoner Name</th>
                  <th>Match ID</th>
                  <th>KDA</th>
                </tr>
            </thead>
            <tbody>
                {this.state.matches.map((match) => {
                return (
                   <tr key={match.match_id} className="championGame">
                    <td><img alt="{champion}" src={profileImage(match.champion)} /></td>
                    <td>{match.ranking}</td>
                    <td>{match.champion}</td>
                    <td><a href={"/match/" + match.match_id}>{match.match_id}</a></td>
                    <td>{match.kda}</td>
                    <td><a href={"roflmao://match-id/" + match.match_id} className="more-info-button">Download</a></td>
                   </tr>
                )
                })}
            </tbody>
              </table>
            </div>

          </div>
        </div>
        )
    }
}
