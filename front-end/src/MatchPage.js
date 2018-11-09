import React, { Component } from 'react';
import request from "superagent";

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
            <div className="demoText">
                <h1>{this.props.summonerName}</h1>
                <p>{text}</p>
            </div>
        )
    }

}

