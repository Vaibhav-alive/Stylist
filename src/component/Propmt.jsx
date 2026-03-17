import React from 'react'

const Propmt = (props) => {

  return (
    <div className="box">
        <div className="label">{props.txt}: </div>
        <div className="drop">{props.option}</div>
        |
    </div>
  )
}

export default Propmt