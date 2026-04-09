import React from 'react'

const ResCard = ({data}) => {
    if (!data.img) return null
    function parseOutfit(text) {
    if (!text) return []
    return text
    .split('\n')
    .filter(l => l.trim())
  }
  return (
    <div className="outfit-card">
        <div className="outfit-media">
            <img src={data.img} alt="Generated outfit preview" />
        </div>
        <div className="outfit-details">
            {parseOutfit(data.outfit).map((line, i) => (
                <div className="outfit-line" key={i}>{line}</div>
            ))}
        </div>
    </div>
  )
}

export default ResCard
