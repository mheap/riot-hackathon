import React, { Component } from 'react';
import {profileImage} from './champion';

export default class ShowUser extends Component {
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
                <tr className="championGame">
                  <th>Image</th>
                  <th>World Ranking</th>
                  <th>Summoner Name</th>
                  <th>Match ID</th>
                  <th>KDA</th>
                  <th>More Info</th>
                </tr>
                {['Garen', 'Jinx', 'Illaoi', 'Shaco', 'Garen', 'Blitzcrank'].map((champion) => {
                return (
                   <tr className="championGame">
                    <td><img alt="{champion}" src={profileImage(champion)} /></td>
                    <td>World Ranking</td>
                    <td>{champion}</td>
                    <td>Match ID</td>
                    <td>KDA</td>
                    <td><button className="more-info-button">More Info</button></td>
                   </tr>
                )
                })}
              </table>
            </div>

          </div>
        </div>
        )
    }
}


