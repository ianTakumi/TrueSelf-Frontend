import React from "react"; 
import "./Help.css";

const Help = () => {
  return (
    <div>
      {/* Curved top section */}
      {/* <div className="curved-top"></div> */}
      <div className="home-title">True Self</div>
      <div className="hcurves curve-top-left"></div>
      <div className="hcurves curve-bottom-right"></div>

      <div className="help-container">
        <h1 className="help-title">Get Help</h1>
        <div className="help-card">
          <form>
            <div className="help-form-group">
              <label htmlFor="email">what?</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="help-form-group">
              <label htmlFor="email">When</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="help-form-group">
              <label htmlFor="email">Who</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="help-form-group">
              <label htmlFor="email">Where</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="help-form-group">
              <label htmlFor="email">How?</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
           
            
           
            <button type="submit" className="help-submit-btn">Submit</button>
          </form>
          
        </div>
      </div>

      {/* Curved bottom section */}
      {/* <div className="help-curved-bottom"></div> */}
    </div>
  );
};

export default Help;