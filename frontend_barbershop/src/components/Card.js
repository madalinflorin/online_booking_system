import React from 'react'

import { CardView } from 'react-card-with-image'
import 'react-card-with-image/dist/index.css'

function Card(props) {
  
  return (
    <div style={{backgroundColor : 'rgb(165, 139, 120)'}}>
    <CardView
      items={props.items}
      activeColor='#000'
      imageHeight='450px'
      imageWidth='500px'
      position= 'fixed'
    />
    <hr/>
    <br/>

    </div>
  )
}

export default Card