import React, { Component } from 'react';
import { GridGenerator, HexGrid, Layout, Hexagon, Text, Pattern } from 'react-hexgrid';
import ReactDropzone from "react-dropzone";
import request from "superagent";
import './App.css';
import {champions, profileImage} from './champion';

export default class SelectChampion extends Component {

    state = {
        summonerName: localStorage.getItem("summonerName")
    }

    constructor(props) {
      super(props);
        this.state = {
          uploadText: 'Drop your replay here, ' + this.state.summonerName
        };
    }

    onDrop = (files) => {

        if (files.length > 1) {
            alert("Please upload one file at a time");
            return;
        }

        // POST to a test endpoint for demo purposes
        const req = request.post('http://localhost:5000/upload');

        files.forEach(file => {
            req.attach("file", file);
        });

        req.then((data) => {
            this.setState({
                "uploadText": `<a href="/match/${data.body.matchId}">Match ${data.body.matchId} uploaded</a>`
            });
        }).catch(console.log);
    }

    render() {
      var hexagons = GridGenerator.hexagon(7);

      return (
        <div className="App">
          <div className="plate">
            <p className="shadow text2">ROFLMAO</p>
          </div>
          <div className="upload-button">
          <ReactDropzone disableClick onDrop={this.onDrop}>
          <p dangerouslySetInnerHTML={{__html: this.state.uploadText}} />
          </ReactDropzone>
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
                    <a key={i.toString() + 'link'} href={link}>
                      <Hexagon fill={i.toString()} key={i.toString()} q={hex.q} r={hex.r} s={hex.s}>
                        <Text>{champions[i]}</Text>
                      </Hexagon>
                    </a>
                  )
                })
              }
            </Layout>

            {
              champions.map((champion, i) => {
                  return <Pattern key={i.toString()} id={i.toString()} link={profileImage(champion)} size={{ x: 4, y: 4 }} />
              })
            }
          </HexGrid>
        </div>
      );
    }
}
