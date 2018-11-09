import React, { Component } from 'react';
import {champions, profileImage} from './champion';

export default class ChampionPage extends Component {

    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div>
          <div>
            <a href="/"><img className="back-arrow" src="https://image.flaticon.com/icons/png/512/7/7940.png"></img></a>
          </div>
          <div className="championpagecontainer">
            <div className="championpageleft">
              <div className="championTitle script">{this.props.match.params.champion}</div>
              <table className="championGames">
                <tr className="championGame">
                  <th>Match ID</th>
                  <th>Summoner Name</th>
                  <th>World Ranking</th>
                  <th>KDA</th>
                  <th>More Info</th>
                </tr>
                <tr className="championGame">
                  <td>Match ID</td>
                  <td>Summoner Name</td>
                  <td>World Ranking</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>Match ID</td>
                  <td>Summoner Name</td>
                  <td>World Ranking</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>Match ID</td>
                  <td>Summoner Name</td>
                  <td>World Ranking</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>Match ID</td>
                  <td>Summoner Name</td>
                  <td>World Ranking</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>Match ID</td>
                  <td>Summoner Name</td>
                  <td>World Ranking</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>Match ID</td>
                  <td>Summoner Name</td>
                  <td>World Ranking</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>Match ID</td>
                  <td>Summoner Name</td>
                  <td>World Ranking</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>Match ID</td>
                  <td>Summoner Name</td>
                  <td>World Ranking</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>Match ID</td>
                  <td>Summoner Name</td>
                  <td>World Ranking</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
                <tr className="championGame">
                  <td>Match ID</td>
                  <td>Summoner Name</td>
                  <td>World Ranking</td>
                  <td>KDA</td>
                  <td><button className="more-info-button">More Info</button></td>
                </tr>
              </table>
            </div>
            <div className="championpageright">
              <img className="championImage" src={profileImage(this.props.match.params.champion)} />
            </div>
          </div>
        </div>
      );
    }
}
