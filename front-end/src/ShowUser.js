import React, { Component } from 'react';
import {profileImage} from './champion';

export default class ShowUser extends Component {

    state = {
        matches: [
            { "champion": "Garen", "match_id": "2904531429", "kda": "18/3/4", "ranking": "" },
            { "champion": "Jinx", "match_id": "2893746282", "kda": "0/5/1", "ranking": "" },
            { "champion": "Illaoi", "match_id": "282639718", "kda": "8/8/3", "ranking": "" },
            { "champion": "Shaco", "match_id": "2330183648", "kda": "6/2/1", "ranking": "" },
            { "champion": "Garen", "match_id": "2313846292", "kda": "3/8/2", "ranking": "" },
            { "champion": "Blitzcrank", "match_id": "2298364937", "kda": "3/5/18", "ranking": "" },
        ]
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
                  <th>More Info</th>
                </tr>
            </thead>
            <tbody>
                {this.state.matches.map((match) => {
                return (
                   <tr key={match.match_id} className="championGame">
                    <td><img alt="{champion}" src={profileImage(match.champion)} /></td>
                    <td>{match.ranking}</td>
                    <td>{match.champion}</td>
                    <td>{match.match_id}</td>
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


