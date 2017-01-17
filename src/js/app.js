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
      octaves:[],
      color: 'red',
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
    analyser.fftSize = 4096;
    const buffer = analyser.frequencyBinCount;
    //that data is pushed to an array
    let dataArray = new Uint8Array(buffer/4);
    console.log(dataArray.length);

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
      let dataMap = {}
      let freqSize = audio.sampleRate/analyser.fftSize;
      setInterval(()=>{

        analyser.getByteFrequencyData(dataArray);
        let freqArry = []


        dataArray.forEach((data, i)=>{
            let high = null;
            let med = null;
            let low = null;
            let lowLow = null;
            let freq = freqSize * i;
            let element = null;
            if(i<=128){
              high = <Entity
              key={'h' + i}
              geometry='primitive: sphere;'
              material={{color:'#56AEB0', opacity:data/10}}
              position={[i - 30, -4 + -(data/8), -20]}
            />
            }else if(i<=256){
              med = <Entity
              key={'m' + i }
              geometry='primitive: sphere;'
              material={{color:'#56B056', opacity:data/10}}
              position={[i- 148 ,-4 -(data/8),-20 + data/8]}
            />
            }else if(i<=384){
              low = <Entity
              key={'l' +i }
              geometry='primitive: box;'
              material={{color:'#D4CB4C', opacity:data/10}}
              position={[i - 486,-4 -(data/8),-20 + data/8]}
            />
            }else if(i<=512){
              lowLow =<Entity
              key={'ll'+ i}
              geometry='primitive: torus;'
              material={{color:'#EB7C5E', opacity:data/10}}
              position={[i - 404,-4 -(data/8),-20 + data/8]}
            />
            }
            if(freq <= 30.87 ){
              element= (<Entity
              key={i}
              geometry='primitive: box;'
              material={{color:'#FA0230'}}
              position={[17,data/15,data/8]}
            />)
          }if(freq <= 61.74 && freq >= 32.70){
            element = (<Entity
              key={i}
              geometry='primitive: box;'
              material={{color:'#ED6F87', opacity:.5}}
              position={[20,data/15,data/8]}
            />)
          }if(freq <= 123.47 && freq >= 65.41){
            element = (<Entity
              key={i}
              geometry='primitive: box;'
              material='color:#ED6FDA; opacity:.5'
              position={[23,data/15,data/8]}
            />)

          }if(freq <= 246.94 && freq >= 130.81){
            element = (<Entity
              key={i}
              geometry='primitive: box;'
              material='color:#DA6FED; opacity:.5'
              position={[26 ,data/15,data/8]}
            />)

          }if(freq <= 493.88 && freq >= 261.63 ){
            element = (<Entity
              key={i}
              geometry='primitive: box;'
              material='color:#936FED; opacity:.5'
              position={[29,data/15,data/8]}
            />)

          }if(freq <= 987.77 && freq >= 523.25){
            element = (<Entity
              key={i}
              geometry='primitive: box;'
              material='color:#6F7AED; opacity:.5'
              position={[31,data/15,data/8]}
            />)

          }if(freq <= 1975.53 && freq >= 1046.50){
            element = (<Entity
              key={i}
              geometry='primitive: box;'
              material='color:#6FA4ED; opacity:.5'
              position={[34,data/15,data/8]}
            />)

          }if(freq <= 3951.07 && freq >= 2093){
            element = (<Entity
              key={i}
              geometry='primitive: box;'
              material='color:#E1F50C; opacity:.5'
              position={[37,data/15,data/8]}
            />)

          }if(freq >= 4186.01){
            element = (<Entity
              key={i}
              geometry='primitive: box;'
              material='color:#F5880C; opacity:.5'
              position={[40,data/15,data/8]}
            />)
            }
            freqArry.push(
              {
              amount:data,
              freq:freq,
              element:element,
              high:high,
              med:med,
              low:low,
              lowLow:lowLow
              }
          );
        });
        this.setState({
          fftData:freqArry
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
    return (
      <Scene >
        <Sky opacity='.6' color='#90C3D4'/>
        <Camera />
        <Entity position={[-30,0,-50]}>
          { //this returns the octaves
            this.state.fftData.map(f=> f.element)
          }
          { //these are the lowest acctually
            this.state.fftData.map(f=> f.high)
          }
          { //amed
            this.state.fftData.map(f=> f.med)
          }
          { //high
            this.state.fftData.map(f=> f.low)
          }
          { //very high
            this.state.fftData.map(f=> f.lowLow)
          }

        </Entity>


      </Scene>
    );
  }
}

ReactDOM.render(<VRScene/>, document.querySelector('.scene-container'));
