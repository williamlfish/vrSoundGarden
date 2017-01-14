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
      ourFreq:[],
      lowFreqArry:[],
      medLowFreqArry:[],
      medHighFreqArry:[],
      highFreqArry:[],
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
    //we init the AudioContext
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    console.log(audio.sampleRate);
    //this analyser is used to get data
    const analyser = audio.createAnalyser()
    analyser.fftSize = 1024;
    const buffer = analyser.frequencyBinCount;
    console.log(buffer);
    //that data is pushed to an array
    let dataArray = new Uint8Array(buffer);
    console.log(dataArray.length);

    navigator.mediaDevices.getUserMedia =   navigator.mediaDevices.getUserMedia ||
                                            navigator.mediaDevices.webkitGetUserMedia ||
                                            navigator.mediaDevices.mozGetUserMedia ||
                                            navigator.mediaDevices.msGetUserMedia;
    navigator.mediaDevices.getUserMedia({video:false, audio:true}).then((stream)=>{

        const sound = audio.createMediaStreamSource(stream);
          // let merge = audio.createChannelMerger(2);

          // sound.connect(osc)
          // gain.connect(osc)
          sound.connect(analyser)

          // lowFilter.frequency.value = 440;
        // sound.connect(audio.destination)

      let Xcount = 0
      let Ycount = 0
      let Zcount = 0
      const freqSize = audio.sampleRate/analyser.fftSize;
      console.log('freq size is' ,freqSize);
      setInterval(()=>{
        analyser.getByteFrequencyData(dataArray);
        let ourFreq =[]
        let lowFreqArry = [];
        let medLowFreqArry = [];
        let medHighFreqArry = [];
        let highFreqArry = [];
        dataArray.forEach((data, i)=>{
          if(i<=97){
            ourFreq.push(data);
          }

          // if(medLowFreqArry[i]>50){
          //   Ycount+= .005;
          // }else if(medLowFreqArry[i]<50){
          //   Ycount=0
          // }
        })
        ourFreq.forEach((freq, i )=>{
            if(i<=24){
              lowFreqArry.push(freq)
            }else if(i<=42){
              medLowFreqArry.push(freq)
            }else if(i<=72){
              medHighFreqArry.push(freq)
            }else if(i<=96){
              highFreqArry.push(freq)
            }
        });
        this.setState({
          y:Ycount,
          lowFreqArry:lowFreqArry,
          medLowFreqArry:medLowFreqArry,
          medHighFreqArry:medHighFreqArry,
          highFreqArry:highFreqArry
        });

      },16)
    }).catch(err=>{
      console.log(err.message);
    });

  }



  render () {
    console.log(this.state.lowFreqArry);
    let aBall = null
    let ballP = `boundingBox: 1 1 1; mass: 3; velocity:0 ${this.state.y}0`
    return (
      <Scene physics-world="gravity: 0 -9.8 0" >
        <Sky opacity='.6' color='#90C3D4'/>
        <Camera />
        {this.state.balls.map((ball, i)=>{
          let num = Math.floor(Math.random() * (5 - 0 + 1 )) + 1
          let num2 = Math.floor(Math.random() * (5 - 0 + 1 )) + 5
          let num3 = Math.random() * (2 - .01) + .01
          return <Ball key={i} phys={ballP} pos={[num3, 0, -10]} ref={ball=>{aBall = ball}} >

          </Ball>
        })}
        {/* <Ball  phys={ballP} pos={[0, 0 ,-5]} />
        <Ball phys={ballP} pos={[0, 5 ,-5]} />
        <Ball phys={ballP} pos={[5, 0 ,-3]} /> */}
        <Entity
        geometry="primitive: box; depth: 100; height: 0.1; width: 100"
                  material="color: #2E3837"
                  physics-body="mass: 0; boundingBox: 50 0.1 50" position={[0,-2,2]}
                />
      </Scene>
    );
  }
}

ReactDOM.render(<VRScene/>, document.querySelector('.scene-container'));
