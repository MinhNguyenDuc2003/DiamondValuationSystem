import React from 'react';
import './Education.scss';
import data from './Education.json';

const EDUCATION_CARAT = () => {
  return (
    <div className="education-wrapper">
      {data.Carat.title && <h1>{data.Carat.title}</h1>}
      {data.Carat.author && <p><strong>Author:</strong> {data.Carat.author}</p>}
      {data.Carat.date && <p><strong>Date:</strong> {data.Carat.date}</p>}
      {data.Carat.content && data.Carat.content.map((section, index) => (
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
