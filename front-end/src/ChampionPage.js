import React, { Component } from 'react';
import {profileImage} from './champion';

export default class ChampionPage extends Component {

    state = {
        "matches": []
    }

    componentDidMount() {
        this.setState({
            matches: [
                {"summoner":"pseudonym117", "match_id": 1234}
            ]
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
            <div className="championpagetop">
              <img className="championImage" alt={this.props.match.params.champion} src={profileImage(this.props.match.params.champion)} />
              <div className="championTitle script">{this.props.match.params.champion}</div>
            </div>
            <div className="championpagebottom">
              <table className="championGames">
                <thead>
                <tr className="championGame">
                  <th>World Ranking</th>
                  <th>Summoner Name</th>
                  <th>Match ID</th>
                  <th>KDA</th>
                  <th>Download Replay</th>
                </tr>
                </thead>
                <tbody>
            {this.state.matches.map((match) => {
                return (<tr className="championGame">
                  <td>{match.ranking}</td>
                  <td>{match.summoner}</td>
                  <td>{match.match_id}</td>
                  <td>{match.kda}</td>
                  <td><a href={"roflmao://match-id/" + match.match_id} className="more-info-button">Download</a></td>
                </tr>)
            })}
                </tbody>
              </table>

            </div>

          </div>
        </div>
      );
    }
}
