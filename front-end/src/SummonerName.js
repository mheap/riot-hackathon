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
        localStorage.setItem('summonerName', document.getElementById("summonerName").value);
        this.setState({"redirect": true});
    }

    render() {
        if (localStorage.getItem('summonerName')) {
            return <Redirect to='/choose' />
        }

        return (
          <div>
            <div className="plate">
              <p className="shadow text2">ROFLMAO</p>
            </div>
            <div className="summonerName-wrapper">
              <div className="summonerNameBox">
                <div className="nametext">
                  <h1 id="enterName">Enter Your Summoner Name</h1>
                  <div id="inputBox">
                    <input id="summonerName" />
                  </div>
                  <button id="submitName" onClick={this.onSubmit}>Show Me the Leaderboard!</button>
                </div>
              </div>
            </div>
          </div>
        )

    }
}
