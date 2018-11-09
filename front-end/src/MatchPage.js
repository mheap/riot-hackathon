import React, { Component } from 'react';
import request from "superagent";

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

        if (!this.state || !this.state.champion) {
            return (
                <div className="championpagecontainer">
                <div className="championpagetop">
                <div className="championTitle script">Loading...</div>
                </div>
                </div>
            );
        }

        return (
            <div className="championpagecontainer">
            <div className="championpagetop">
              <div className="championTitle script">{champion.name}</div>
              <div className="championTitle script">{champion.name}</div>
            </div>
        </div>
        )
    }

}

