import React from "react";
import Person from "../../assets/new-person.svg";
import "./NewSection.scss";
import { Link } from "react-router-dom";
const NewSection = () => {
  return (
    <div className="margin-big">
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <img src={Person} className="img-fluid" alt="person" />
          </div>

          <div className="col-md-7 text-end mt-5 ">
            <div className="new-text">
              <h2>أد واتس في ثوبها الجديد</h2>
              <p className="second text-white">
                تم إنشاء اد واتس لتكون المنصة الأولى للتسويق عبر الواتساب،
                بطريقة احترافية وتواصل راقي وخدمة عملاء بروبوت ذكي يوزع
                المراسلات على موظفيك. غايتنا رضاكم،،
              </p>

              <Link to="login"><button className="btn primary-btn border-1 bg-transparent border-white">
                سجل الآن
              </button></Link>

              <button className="btn primary-btn border-1 bg-transparent border-white">
                تصفح المزيد
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSection;
