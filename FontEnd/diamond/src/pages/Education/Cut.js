import React from 'react';
import './Education.scss';
import data from './Education.json';
const EDUCATION_CUT = () => {
  return (
    <div className="education-wrapper">
    {data.Cut.title && <h1>{data.Cut.title}</h1>}
    {data.Cut.author && <p><strong>Author:</strong> {data.Cut.author}</p>}
    {data.Cut.date && <p><strong>Date:</strong> {data.Cut.date}</p>}
    {data.Cut.content && data.Cut.content.map((section, index) => (
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

  );
}

export default EDUCATION_CUT;
