import React, { Component } from 'react';
import { GridGenerator, HexGrid, Layout, Path, Hexagon, Text, Pattern, Hex } from 'react-hexgrid';
import './App.css';
import {champions, profileImage} from './champion';

export default class SelectChampion extends Component {

    constructor(props) {
      super(props);
    }

    render() {
      var hexagons = GridGenerator.hexagon(7);

      return (
        <div className="App">
          <div className="plate">
            <p className="shadow text1">UPLOAD</p>
            <p className="shadow text2">ROFL</p>
          </div>
          <HexGrid width={1200} height={1250}>

            <Layout size={{ x: 4, y: 4 }}>
              {
                hexagons.map((hex, i) => {
                  var link = "/" + champions[i] + "/leaderboard";
                    if (!champions[i]) {
                        return "";
                    }

                    return (
                    <a href={link}>
                      <Hexagon fill={i.toString()} key={i} q={hex.q} r={hex.r} s={hex.s}>
                        <Text>{champions[i]}</Text>
                      </Hexagon>
                    </a>
                  )
                })
              }
            </Layout>

            {
              champions.map((champion, i) => {
                  return <Pattern id={i} link={profileImage(champion)} size={{ x: 4, y: 4 }} />
              })
            }
          </HexGrid>
        </div>
      );
    }
}
