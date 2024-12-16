import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Plans.scss";

const Plans = () => {
  const plans = [
    {
      name: "اد واتس",
      priceMonthly: "149 ر.س",
      priceYearly: "1490 ر.س",
      accounts: 1,
      dailyMessages: 1000,
      monthlyMessages: 20000,
      freeTrial: false,
    },
    {
      name: "اد واتس مسدج - تجربة مجانية",
      priceMonthly: "69 ر.س",
      priceYearly: "690 ر.س",
      accounts: 1,
      dailyMessages: 200,
      monthlyMessages: 2500,
      freeTrial: true,
    },
    {
      name: "اد واتس مسدج",
      priceMonthly: "69 ر.س",
      priceYearly: "690 ر.س",
      accounts: 1,
      dailyMessages: 300,
      monthlyMessages: 5000,
      freeTrial: false,
    },
    {
      name: "اد واتس برو",
      priceMonthly: "149 ر.س",
      priceYearly: "1490 ر.س",
      accounts: 3,

      dailyMessages: 300,
      monthlyMessages: 5000,
      freeTrial: false,
    },
    {
      name: "اد واتس ماكس",
      priceMonthly: "999 ر.س",
      priceYearly: "9990 ر.س",
      accounts: 10,
      dailyMessages: 300,
      monthlyMessages: 5000,
      freeTrial: false,
    },
  ];

  const settings = {
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: false,
    autoplaySpeed: 2000,
    dots: true,
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="plans margin-big" id="whatsapp-features">
      <div className="container-fluid">
        <div className="row mb-4 text-center">
          <div className="col-12">
            <h2 className="text-white fs-3">باقات أد واتس</h2>
          </div>
        </div>
      </div>
      <div className="plans__wrapper overflow-hidden">
        <div className="plans__slider">
          <Slider {...settings}>
            {plans.map((plan, index) => (
              <div key={index} className="plan">
                <div className="header">
                  <h3>{plan.name}</h3>
                </div>

                <div className="price">
                  <p>شهريًا: {plan.priceMonthly}</p>
                  <p>سنويًا: {plan.priceYearly}</p>
                </div>

                <ul>
                  <li>
                    <p>عدد حسابات الواتساب</p>
                    <p>{plan.accounts}</p>
                  </li>

                  <li>
                    <p>الحد الأقصى للرسائل اليومية: </p>
                    <p>{plan.dailyMessages}</p>
                  </li>

                  <li>
                    <p>الحد الأقصى للرسائل اليومية: </p>
                    <p>{plan.monthlyMessages}</p>
                  </li>
                  {plan.freeTrial && <p>تجربة مجانية</p>}
                  <li>
                    <button className="btn">معرفة المزيد</button>
                  </li>
                </ul>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Plans;
