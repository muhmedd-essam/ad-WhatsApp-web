import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import P1 from "../../assets/zad.png";
import P2 from "../../assets/sala.png";
import "./Partners.scss";
const Partners = () => {
  const settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    dots: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  const logos = [P1, P2];

  return (
    <section className="partners">
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
        id="partners"
      >
        <div className="row mb-5">
          <div className="col-md-12 text-center">
            <h2 className="fw-bold">الشركاء</h2>
          </div>
        </div>
        <div className="container">
          <Slider {...settings}>
            {logos.map((logo, index) => (
              <div key={index} style={{ padding: "40px 10px" }}>
                <img
                  src={logo}
                  alt={`Logo ${index + 1}`}
                  style={{ width: "100%", height: "auto", borderRadius: "50%" }}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Partners;
