import React from 'react';
import './Education.scss';

const EDUCATION_CUT = () => {
  return (

    <div className="education-wrapper">
      <section id="carat" className="section">
        <h2>Carat: The Weight of Diamonds</h2>
        <p><strong>Understanding Carat:</strong> Carat is the unit of weight for diamonds. One carat is equivalent to 200 milligrams. The weight of a diamond is often measured to the hundredth decimal place.</p>
        <p><strong>Impact of Carat on Value:</strong></p>
        <ul>
          <li><strong>Larger Carat, Higher Price:</strong> Larger diamonds are typically more valuable due to their rarity.</li>
          <li><strong>Quality and Size:</strong> However, size alone doesn't determine value. The quality of the diamond is also crucial.</li>
        </ul>
        <p><strong>Tips for Choosing Carat:</strong> Opting for diamonds just below major carat weights, like 0.9 carats instead of 1 carat, can save money while maintaining a similar size.</p>
      </section>

      <section id="cut" className="section">
        <h2>Cut: The Craftsmanship of Diamond Cutting</h2>
        <p><strong>Understanding Cut:</strong> Cut refers not only to the shape but also to how well a diamond's facets are cut and aligned. This is the only factor in the 4Cs (Carat, Color, Clarity, Cut) that humans can control.</p>
        <p><strong>Impact of Cut on Value:</strong></p>
        <ul>
          <li><strong>Brilliance:</strong> A well-cut diamond reflects light beautifully, enhancing its sparkle.</li>
          <li><strong>Balancing Factors:</strong> A diamond with an excellent cut can mask minor inclusions and lesser color quality.</li>
        </ul>
        <p><strong>Cut Grades:</strong></p>
        <ul>
          <li><strong>Excellent:</strong> Reflects nearly all light, offering maximum brilliance.</li>
          <li><strong>Very Good:</strong> Reflects most light, still highly brilliant.</li>
          <li><strong>Good:</strong> Reflects some light, less brilliant.</li>
          <li><strong>Fair and Poor:</strong> Reflects very little light, least brilliant.</li>
        </ul>
      </section>

      <section id="color" className="section">
        <h2>Color: The Hue of Diamonds</h2>
        <p><strong>Understanding Color:</strong> Natural diamonds can come in various colors, but colorless diamonds are the most valued. The GIA (Gemological Institute of America) color scale ranges from D (completely colorless) to Z (light yellow or brown).</p>
        <p><strong>Impact of Color on Value:</strong></p>
        <ul>
          <li><strong>Near Colorless:</strong> Diamonds from D to F are considered colorless and are highly valuable.</li>
          <li><strong>Slight Hues:</strong> G to J have very slight hues, decreasing in value.</li>
          <li><strong>Visible Color:</strong> K to Z have visible color, further reducing value.</li>
        </ul>
        <p><strong>Tips for Choosing Color:</strong> Diamonds in a yellow gold setting can appear whiter even with a lower color grade like G or H.</p>
      </section>

      <section id="clarity" className="section">
        <h2>Clarity: The Purity of Diamonds</h2>
        <p><strong>Understanding Clarity:</strong> Clarity measures the amount and location of inclusions (internal flaws) and blemishes (surface flaws) in a diamond. The GIA clarity scale includes:</p>
        <ul>
          <li><strong>FL (Flawless):</strong> No inclusions or blemishes visible under 10x magnification.</li>
          <li><strong>IF (Internally Flawless):</strong> No internal inclusions, minor surface blemishes.</li>
          <li><strong>VVS1, VVS2 (Very, Very Slightly Included):</strong> Very tiny inclusions, difficult to see under 10x magnification.</li>
          <li><strong>VS1, VS2 (Very Slightly Included):</strong> Minor inclusions, slightly easier to see under 10x magnification.</li>
          <li><strong>SI1, SI2 (Slightly Included):</strong> Noticeable inclusions, possibly visible to the naked eye.</li>
          <li><strong>I1, I2, I3 (Included):</strong> Obvious inclusions, easily visible to the naked eye.</li>
        </ul>
        <p><strong>Impact of Clarity on Value:</strong></p>
        <ul>
          <li><strong>Higher Clarity, Higher Value:</strong> Diamonds with fewer and smaller inclusions are more valuable.</li>
          <li><strong>Visibility of Inclusions:</strong> Visible inclusions can significantly decrease a diamond's value.</li>
        </ul>
        <p><strong>Tips for Choosing Clarity:</strong> VS1 or VS2 diamonds often offer the best balance of clarity and cost, with inclusions that are hard to see without magnification.</p>
      </section>

      <section id="fluorescence" className="section">
        <h2>Fluorescence: The Glow of Diamonds</h2>
        <p><strong>Understanding Fluorescence:</strong> Fluorescence refers to a diamond's ability to emit a soft glow when exposed to ultraviolet (UV) light. About 25-35% of natural diamonds exhibit some level of fluorescence.</p>
        <p><strong>Impact of Fluorescence on Value:</strong></p>
        <ul>
          <li><strong>Positive or Negative Effects:</strong> Fluorescence can make a diamond appear whiter in daylight, but strong fluorescence might make it look hazy or milky.</li>
        </ul>
        <p><strong>Fluorescence Levels:</strong></p>
        <ul>
          <li><strong>None:</strong> No glow under UV light.</li>
          <li><strong>Faint:</strong> Slight glow.</li>
          <li><strong>Medium:</strong> Moderate glow.</li>
          <li><strong>Strong and Very Strong:</strong> Intense glow.</li>
        </ul>
      </section>
    </div>

  );
}

export default EDUCATION_CUT;
