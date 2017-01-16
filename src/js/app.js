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
      hiCount:0,
      medCount:0,
      lowCount:0,
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
      let lowFreqArry = [];
      let medLowFreqArry = [];
      let medHighFreqArry = [];
      let hiCount = 0
      let medCount = 0
      let lowCount = 0
      // dataArray.forEach((data, i)=>{
      //   if(i<=24){
      //     lowFreqArry.push(data)
      //   }else if(i<=42){
      //     if(data>150){
      //       Ycount += .005
      //     }
      //     medLowFreqArry.push(data)
      //   }else if(i<=72){
      //     medHighFreqArry.push(data)
      //   }
      // })
      const freqSize = audio.sampleRate/analyser.fftSize;
      console.log('freq size is ' ,freqSize);
      setInterval(()=>{
        analyser.getByteFrequencyData(dataArray);
        dataArray.forEach((data, i)=>{
          if(i<=24){
            if(data>75){
              hiCount += .005
            }else{hiCount = 0}
          }else if(i<=42){
            if(data>75){
              medCount += .005
            }else{medCount = 0}
          }else if(i<=72){
            if(data>75){
              lowCount += .005
            }else{lowCount= 0}
          }
        });

        this.setState({hiCount:hiCount,medCount:medCount,lowCount:lowCount})
      },16)
      this.setState({
        lowFreqArry:lowFreqArry,
        medLowFreqArry:medLowFreqArry,
        medHighFreqArry:medHighFreqArry,
      });

    }).catch(err=>{
      console.log(err.message);
    });

  }



  render () {
    let aBall = null
    let ballh = `boundingBox: 1 1 1; mass: 3; velocity:0 ${this.state.hiCount}0`
    let ballm = `boundingBox: 1 1 1; mass: 3; velocity:0 ${this.state.medCount}0`
    let balll = `boundingBox: 1 1 1; mass: 3; velocity:0 ${this.state.lowCount}0`
    return (
      <Scene physics-world="gravity: 0 -9.8 0" >
        <Sky opacity='.6' color='#90C3D4'/>
        <Camera />
        <Entity
          geometry='primitive: box;'
          material='color:red; opacity:.5'
          physics-body={ballh}
          position={[2,0,-5]}
        />
        <Entity
          geometry='primitive: box;'
          material='color:#FCE562; opacity:.5'
          physics-body={ballm}
          position={[0,0,-5]}
        />
        <Entity
          geometry='primitive: box;'
          material='color:#62FC98; opacity:.5'
          physics-body={balll}
          position={[-2,0,-5]}
        />

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
