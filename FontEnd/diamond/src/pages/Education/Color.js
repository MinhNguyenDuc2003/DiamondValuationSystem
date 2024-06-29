import React from 'react';
import './Education.scss';
import data from './Education.json';

const EDUCATION_COLOR = () => {
  return (
    <div className="education-wrapper">
    {data.Color.title && <h1>{data.Color.title}</h1>}
    {data.Color.author && <p><strong>Author:</strong> {data.Color.author}</p>}
    {data.Color.date && <p><strong>Date:</strong> {data.Color.date}</p>}
    {data.Color.content && data.Color.content.map((section, index) => (
      <div key={index} className="section">
        {section.heading && <h2>{section.heading}</h2>}
        {section.paragraphs && section.paragraphs.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
        {section.listItems && (
          <ul>
            {section.listItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
  )
}

export default EDUCATION_COLOR;
