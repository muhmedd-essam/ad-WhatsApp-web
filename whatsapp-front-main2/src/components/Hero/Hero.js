import React from "react";
import Home from "../../assets/hero.png";
import "./Hero.scss";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container-fluid margin-big">
        <div className="row ">
          <div className="col-md-5 hero-img">
            <img src={Home} className="img-fluid" alt="person" />
          </div>

          <div className="col-md-7">
            <div className="hero-text h-100 d-flex align-items-end flex-column">
              <p className="first">
                العالم الآن بين يديك، ليس هناك المزيد من الوقت
              </p>
              <h2 className="my-5 text-white">
                أد واتس المنصة الأذكى على الإطلاق
              </h2>
              <p className="second">
                دردشات خاصة و حملات إعلانية و روبوتات ذكية صممت خصيصًا من أجلك
              </p>

              <div className="mt-3">
                <Link to={"/login"}><button className="btn primary-btn mx-2">سجل الآن</button></Link>

                <button className="btn border-1 secondary-btn">
                  تصفح المزيد
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
