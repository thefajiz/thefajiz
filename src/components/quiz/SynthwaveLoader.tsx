/**
 * Synthwave Loader Component
 * Design: Synthwave Arcade Cabinet — retro car driving on neon grid road with sunset
 * Adapted from Uiverse.io by BlackisPlay
 */
import "./SynthwaveLoader.css";

export default function SynthwaveLoader() {
  return (
    <div id="synthwave">
      <div id="stars">
        <div id="star0"></div>
        <div id="star1"></div>
        <div id="star2"></div>
        <div id="star3"></div>
        <div id="star4"></div>
        <div id="star5"></div>
        <div id="star6"></div>
        <div id="star7"></div>
        <div id="star8"></div>
        <div id="star9"></div>
        <div id="star10"></div>
        <div id="star11"></div>
        <div id="star12"></div>
        <div id="star13"></div>
      </div>
      <div id="sun">
        <div id="ball"></div>
        <div id="stripe0"></div>
        <div id="stripe1"></div>
        <div id="stripe2"></div>
        <div id="stripe3"></div>
        <div id="stripe4"></div>
        <div id="stripe5"></div>
        <div id="stripe6"></div>
      </div>
      <div id="fog"></div>
      <div id="fog2"></div>
      <div id="land">
        <div id="roadSide0">
          <div id="roadSideGrid0"></div>
        </div>
        <div id="roadSide1">
          <div id="roadSideGrid1"></div>
        </div>
        <div id="roadLines">
          <div id="lines">
            <div id="line0"></div>
            <div id="line1"></div>
            <div id="line2"></div>
            <div id="line3"></div>
            <div id="line4"></div>
            <div id="line5"></div>
            <div id="line6"></div>
            <div id="line7"></div>
          </div>
        </div>
        <div id="hill"></div>
        <div id="hill2"></div>
        <div id="tree">
          <svg viewBox="0 0 120 120" fill="none">
            <path d="M60 10 L90 100 L30 100 Z" fill="#1a0a2e" stroke="#2afce0" strokeWidth="1"/>
            <path d="M60 30 L80 90 L40 90 Z" fill="#2e0d3f" stroke="#2afce0" strokeWidth="0.5"/>
          </svg>
        </div>
        <div id="tree2">
          <svg viewBox="0 0 120 120" fill="none">
            <path d="M60 10 L90 100 L30 100 Z" fill="#1a0a2e" stroke="#2afce0" strokeWidth="1"/>
            <path d="M60 30 L80 90 L40 90 Z" fill="#2e0d3f" stroke="#2afce0" strokeWidth="0.5"/>
          </svg>
        </div>
        <div id="car">
          <div id="windowsSection">
            <div id="sunReflection"></div>
            <div id="window"></div>
          </div>
          <div id="lightsSection">
            <div id="lightStripe0"></div>
            <div id="lightStripe1"></div>
            <div id="lightStripe2"></div>
            <div id="lightStripe3"></div>
            <div id="lights2">
              <div id="tailLight1">
                <div id="tailLight1a"></div>
                <div id="tailLight1b"></div>
                <div id="tailLight1c"></div>
                <div id="tailLight1d"></div>
                <div id="cageLine0"></div>
                <div id="cageLine1"></div>
              </div>
              <div></div>
              <div id="tailLight0">
                <div id="tailLight0a"></div>
                <div id="tailLight0b"></div>
                <div id="tailLight0c"></div>
                <div id="tailLight0d"></div>
                <div id="cageLine0"></div>
                <div id="cageLine1"></div>
              </div>
            </div>
            <div id="lights1"></div>
            <div id="lights0"></div>
          </div>
          <div id="bumperSection">
            <div id="bumper0"></div>
            <div id="bumper1"></div>
            <div id="bumper2">TURBO</div>
            <div id="bumper3">
              <div></div><div></div><div></div><div></div>
              <div></div><div></div><div></div><div></div>
            </div>
            <div id="exhaust0"></div>
            <div id="exhaust1"></div>
            <div id="logo"></div>
          </div>
        </div>
      </div>
      <div id="cutout"></div>
    </div>
  );
}
