import "./Testimonials.css";
import portrait1 from "../../images/image-daniel.jpg";
import portrait2 from "../../images/image-jeanette.jpg";
import portrait3 from "../../images/image-jonathan.jpg";
import portrait4 from "../../images/image-kira.jpg";
import portrait5 from "../../images/image-patrick.jpg";

function Testimonials() {
  return (
    <>
      <div className="testimonialWrapper">
        <div className="testimonialCard testimonialCard-purple">
          <header className="testimonialHeader">
            <img
              className="testimonialPortrait"
              src={portrait1}
              alt="portrait"
            />
            <div>
              <p>Klient</p>
              <h4>Piotr Kowalski</h4>
            </div>
          </header>
          <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
          <p className="testimonialBody">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis a
            consequatur itaque ad commodi dolorum non molestiae, illum
            excepturi, nesciunt ab soluta suscipit nemo nulla? Minima, earum
            dolore.
          </p>
        </div>
        <div className="testimonialCard testimonialCard-gray-blue">
          <header className="testimonialHeader">
            <img
              className="testimonialPortrait"
              src={portrait2}
              alt="portrait"
            />
            <div>
              <p>Klient</p>
              <h4>Anna Nowak</h4>
            </div>
          </header>
          <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
          <p className="testimonialBody">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis a
            consequatur itaque ad commodi dolorum non molestiae, illum
            excepturi, nesciunt ab soluta suscipit nemo nulla? Minima, earum
            dolore.
          </p>
        </div>
        <div className="testimonialCard">
          <header className="testimonialHeader">
            <img
              className="testimonialPortrait"
              src={portrait3}
              alt="portrait"
            />
            <div>
              <p>Właściciel biznesu</p>
              <h4>Maciej McKenzie</h4>
            </div>
          </header>
          <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
          <p className="testimonialBody">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis a
            consequatur itaque ad commodi dolorum non molestiae, illum
            excepturi, nesciunt ab soluta suscipit nemo nulla? Minima, earum
            dolore.
          </p>
        </div>
        <div className="testimonialCard">
          <header className="testimonialHeader">
            <img
              className="testimonialPortrait"
              src={portrait4}
              alt="portrait"
            />
            <div>
              <p>Pracownik</p>
              <h4>Patrycja Góral</h4>
            </div>
          </header>
          <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
          <p className="testimonialBody">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis a
            consequatur itaque ad commodi dolorum non molestiae, illum
            excepturi, nesciunt ab soluta suscipit nemo nulla? Minima, earum
            dolore.
          </p>
        </div>
        <div className="testimonialCard testimonialCard-black-blue">
          <header className="testimonialHeader">
            <img
              className="testimonialPortrait"
              src={portrait5}
              alt="portrait"
            />
            <div>
              <p>Właściciel biznesu</p>
              <h4>Kamil Gała</h4>
            </div>
          </header>
          <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
          <p className="testimonialBody">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis a
            consequatur itaque ad commodi dolorum non molestiae, illum
            excepturi, nesciunt ab soluta suscipit nemo nulla? Minima, earum
            dolore.
          </p>
        </div>
      </div>
    </>
  );
}

export default Testimonials;
