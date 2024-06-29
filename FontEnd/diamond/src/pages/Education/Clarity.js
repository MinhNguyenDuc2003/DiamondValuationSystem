import React from 'react';
import './Education.scss';
import data from './Education.json';
const EDUCATION_CLARITY = () => {
  return (

    <div className="education-wrapper">
      {data.Clarity.title && <h1>{data.Clarity.title}</h1>}
      {data.Clarity.author && <p><strong>Author:</strong> {data.Clarity.author}</p>}
      {data.Clarity.date && <p><strong>Date:</strong> {data.Clarity.date}</p>}
      {data.Clarity.content && data.Clarity.content.map((section, index) => (
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

export default EDUCATION_CLARITY;
