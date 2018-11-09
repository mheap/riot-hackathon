import React, { Component } from 'react';
import {profileImage} from './champion';

export default class ChampionPage extends Component {

    state = {
        "matches": []
    }

    componentDidMount() {
        let me = localStorage.getItem("summonerName");
        this.setState({
            matches: [
                {"summoner": me, "match_id": 2904903651},
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
                  <th>Summoner Name</th>
                  <th>Match ID</th>
                  <th>Download Replay</th>
                </tr>
                </thead>
                <tbody>
            {this.state.matches.map((match) => {
                return (<tr className="championGame">
                  <td>{match.summoner}</td>
                  <td><a href={"/match/" + match.match_id}>{match.match_id}</a></td>
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
