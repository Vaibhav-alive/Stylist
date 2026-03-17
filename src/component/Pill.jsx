import React from 'react'

const Pill = (props) => {
    return (
        <>
            <div className="pill" style={{ right: props.right, top: props.top, left: props.left,bottom: props.bottom, background: props.grad }}>
                <div className="inside-pill" style={{background: props.grad}}></div>
            </div>
        </>

    )
}

export default Pill