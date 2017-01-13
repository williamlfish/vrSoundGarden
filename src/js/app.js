import 'aframe';
import 'aframe-animation-component';
import 'aframe-text-component';
import 'babel-polyfill';
import {Entity, Scene} from 'aframe-react';
import 'aframe-physics-components'
import React from 'react';
import ReactDOM from 'react-dom';
import Ball from './components/Ball';
import Camera from './components/Camera';
import Text from './components/Text';
import Sky from './components/Sky';

class VRScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'red',
      x:0,
      y:0,
      z:0,
      balls:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,]
    };
  }
  componentDidMount(){
    this.getSound();
  }

  getSound(){
    let audio = new (window.AudioContext || window.webkitAudioContext)();;
    let analyser = audio.createAnalyser()
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 1;
    let buffer = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(buffer);

    navigator.mediaDevices.getUserMedia =   navigator.mediaDevices.getUserMedia ||
                                            navigator.mediaDevices.webkitGetUserMedia ||
                                            navigator.mediaDevices.mozGetUserMedia ||
                                            navigator.mediaDevices.msGetUserMedia;
    navigator.mediaDevices.getUserMedia({video:false, audio:true}).then((stream)=>{

        let sound = audio.createMediaStreamSource(stream);
        // sound.connect(osc)
        // gain.connect(osc)
        sound.connect(analyser)
        // analyser.connect(audio.destination)

      let Xcount = 0
      let Ycount = 0
      let Zcount = 0

      setInterval(()=>{

        analyser.getByteTimeDomainData(dataArray)
        dataArray.forEach(data=>{
          data = data/10
          if(data>13){
            Ycount+=0.005
          }if(Ycount > 6){
            Ycount = 0
          }
        })
        this.setState({y:Ycount, x:Xcount, z:Zcount})

      },26)
    }).catch(err=>{
      console.log(err.message);
    });

  }



  render () {
    let aBall = null
    let ballP = `boundingBox: 1 1 1; mass: 3; velocity:0 ${this.state.y}0`
    return (
      <Scene physics-world="gravity: 0 -9.8 0" >
        <Sky opacity='.6' color='#90C3D4'/>
        <Camera />
        {this.state.balls.map((ball, i)=>{
          let num = Math.floor(Math.random() * (5 - 0 + 1 )) + 1
          let num2 = Math.floor(Math.random() * (5 - 0 + 1 )) + 5
          let num3 = Math.floor(Math.random() * (5 - 0 + 1 )) + 3
          return <Ball key={i} phys={ballP} pos={[num, num2, num3]} ref={ball=>{aBall = ball}} >

          </Ball>
        })}
        {/* <Ball  phys={ballP} pos={[0, 0 ,-5]} />
        <Ball phys={ballP} pos={[0, 5 ,-5]} />
        <Ball phys={ballP} pos={[5, 0 ,-3]} /> */}
        <Entity
        geometry="primitive: box; depth: 50; height: 0.1; width: 50"
                  material="color: #2E3837"
                  physics-body="mass: 0; boundingBox: 50 0.1 50" position={[0,-2,2]}
                />
      </Scene>
    );
  }
}

ReactDOM.render(<VRScene/>, document.querySelector('.scene-container'));
