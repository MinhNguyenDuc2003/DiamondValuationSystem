import React from 'react';
import './Education.scss';
import data from './Education.json';

const EDUCATION_FLUORESCENCE = () => {
  return (
    <div className="education-wrapper">
    {data.Fluorescence.title && <h1>{data.Fluorescence.title}</h1>}
    {data.Fluorescence.author && <p><strong>Author:</strong> {data.Fluorescence.author}</p>}
    {data.Fluorescence.date && <p><strong>Date:</strong> {data.Fluorescence.date}</p>}
    {data.Fluorescence.content && data.Fluorescence.content.map((section, index) => (
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

export default EDUCATION_FLUORESCENCE;
