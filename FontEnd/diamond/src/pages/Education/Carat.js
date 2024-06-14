import React from 'react';
import './Education.scss';
import data from './Education.json';

const EDUCATION_CARAT = () => {
  return (
    <div className="education-wrapper">
      {data.title && <h1>{data.title}</h1>}
      {data.author && <p><strong>Author:</strong> {data.author}</p>}
      {data.date && <p><strong>Date:</strong> {data.date}</p>}
      {data.content && data.content.map((section, index) => (
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

export default EDUCATION_CARAT;
