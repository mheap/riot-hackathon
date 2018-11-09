import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class SummonerName extends Component {

    state = {
        redirect: false,
        summonerName: this.props.summonerName
    }

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
        this.props.changeSummonerName(
            document.getElementById("summonerName").value
        );
        this.setState({"redirect": true});
    }

    render() {
        if (this.props.summonerName) {
            return <Redirect to='/choose' />
        }

        return (
            <div className="demoText">
                <h1>Choose a Summoner Name</h1>
                <input id="summonerName" />
                <button onClick={this.onSubmit}>Change</button>
            </div>
        )

    }
}
