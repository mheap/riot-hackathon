import React, { Component } from 'react';

export default class ChampionPage extends Component {

    constructor(props) {
      super(props);
      console.log(props);
    }

    render() {
      return (
        <h1>{this.props.match.params.champion}</h1>
      );
    }
}
