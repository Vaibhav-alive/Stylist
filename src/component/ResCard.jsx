import React from 'react'

const ResCard = ({data}) => {
    function parseOutfit(text) {
    if (!text) return []
    return text
    .split('\n')
    .filter(l => l.trim())
  }
  return (
    <div className="outfit-card">
        <img src={data.img} />
        <div className="outfit-details">
            {parseOutfit(data.outfit).map((line, i) => (
                <div className="outfit-line" key={i}>{line}</div>
            ))}
        </div>
    </div>
  )
}

export default ResCard