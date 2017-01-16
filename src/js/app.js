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
      fftData: [],
      color: 'red',
      ourFreq:[],
      lowFreqArry:[],
      medFreqArry:[],
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
    //that data is pushed to an array
    let dataArray = new Uint8Array(buffer);

    navigator.mediaDevices.getUserMedia =   navigator.mediaDevices.getUserMedia ||
                                            navigator.mediaDevices.webkitGetUserMedia ||
                                            navigator.mediaDevices.mozGetUserMedia ||
                                            navigator.mediaDevices.msGetUserMedia;
    navigator.mediaDevices.getUserMedia({video:false, audio:true}).then((stream)=>{

      const sound = audio.createMediaStreamSource(stream);
      sound.connect(analyser)

      let hiCount = 0
      let medCount = 0
      let lowCount = 0

      const freqSize = audio.sampleRate/analyser.fftSize;
      console.log('freq size is ' ,freqSize);
      setInterval(()=>{
        analyser.getByteFrequencyData(dataArray);
        let lowFreqArry = [];
        let medFreqArry = [];
        let highFreqArry = [];
        dataArray.forEach((data, i)=>{
          if(i<=24){
            highFreqArry.push(data)
          }else if(i<=42){
            medFreqArry.push(data)
          }else if(i<=72){
            lowFreqArry.push(data)
          }
        });

        this.setState({
          fftData: dataArray,
          lowFreqArry:lowFreqArry,
          medFreqArry:medFreqArry,
          highFreqArry: highFreqArry,
        })
      },17)
      // this.setState({
      //   lowFreqArry:lowFreqArry,
      //   medLowFreqArry:medLowFreqArry,
      //   medHighFreqArry:medHighFreqArry,
      // });

    }).catch(err=>{
      console.log(err.message);
    });

  }



  render () {
    let aBall = null

    return (
      <Scene >
        <Sky opacity='.6' color='#90C3D4'/>
        <Camera />

        <Entity position={[0,0,-40]}>
          { //array with the hightest freq to crete red blocks
            Array.map(this.state.highFreqArry, (n, i) => <Entity
              key={i}
              geometry='primitive: box;'
              material='color:red; opacity:.5'
              position={[i-10 ,n/8,0]}
            />)
          }
          {
            Array.map(this.state.medFreqArry, (n, i)=> <Entity
            key={i}
            geometry='primitive: sphere;'
            material='color:blue; opacity:.5'
            position={[i ,n/10,3]}
          />)
          }
          {
            Array.map(this.state.highFreqArry, (n, i)=> <Entity
            key={i}
            geometry='primitive: torus;'
            material='color:green; opacity:.5'
            position={[i-8 ,n/50,5]}
          />)
          }
        </Entity>


      </Scene>
    );
  }
}

ReactDOM.render(<VRScene/>, document.querySelector('.scene-container'));
