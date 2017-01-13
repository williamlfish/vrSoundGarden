import {Entity} from 'aframe-react';
import React from 'react';

export default props => (
  <Entity
    physics-body={props.phys}
    // animation__yoyo="property: position; dir: alternate; dur: 1000;
    //                        easing: easeInSine; loop: true; to: 0 2 0"
    geometry={{primitive: 'sphere'}}
    scale={[.5,.5,.5]}
    material='color: red'
    position={props.pos}
  />
);
