import React, { Component } from 'react';
import {champions, profileImage} from './champion';

export default class ChampionPage extends Component {

    constructor(props) {
      super(props);
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
            <div className="championpagetop">
              <img className="championImage" src={profileImage(this.props.match.params.champion)} />
              <div className="championTitle script">{this.props.match.params.champion}</div>
            </div>
            <div className="championpagebottom">
              <table className="championGames">
                <tr className="championGame">
                  <th>World Ranking</th>
                  <th>Summoner Name</th>
                  <th>Match ID</th>
                  <th>KDA</th>
                  <th>More Info</th>
                </tr>
                <tr className="championGame">
                  <td>World Ranking</td>
                  <td>Summoner Name</td>
                  <td>Match ID</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>World Ranking</td>
                  <td>Summoner Name</td>
                  <td>Match ID</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>World Ranking</td>
                  <td>Summoner Name</td>
                  <td>Match ID</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>World Ranking</td>
                  <td>Summoner Name</td>
                  <td>Match ID</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>World Ranking</td>
                  <td>Summoner Name</td>
                  <td>Match ID</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>World Ranking</td>
                  <td>Summoner Name</td>
                  <td>Match ID</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>World Ranking</td>
                  <td>Summoner Name</td>
                  <td>Match ID</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>World Ranking</td>
                  <td>Summoner Name</td>
                  <td>Match ID</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>World Ranking</td>
                  <td>Summoner Name</td>
                  <td>Match ID</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>World Ranking</td>
                  <td>Summoner Name</td>
                  <td>Match ID</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
              </table>
            </div>

          </div>
        </div>
      );
    }
}
