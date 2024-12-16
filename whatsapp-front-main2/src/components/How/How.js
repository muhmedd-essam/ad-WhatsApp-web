import Robot from "../../assets/robot-how.svg";
import Arrow from "../../assets/arrow.svg";
import Qr from "../../assets/qrCode.svg";
import "./How.scss";
const How = () => {
  return (
    <section className="how-section" id="how-it-works">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h2 className="fw-bold"> كيف يعمل البرنامج؟</h2>
          </div>
        </div>

        <div className="row flex-row-reverse mt-5">
          <div className="col-md-4">
            <div className="shap">
              <img src={Robot} alt="Robot" />
            </div>

            <h5>اصنع روبوتك الذكي</h5>
          </div>

          <div className="col-md-4">
            <div className="shap">
              <img src={Arrow} alt="Robot" />
            </div>

            <h5>أرسل رسالتك الأولى</h5>
          </div>

          <div className="col-md-4">
            <div className="shap">
              <img src={Qr} alt="Robot" />
            </div>

            <h5>امسح كود المصادقة بواسطة جوالك</h5>
          </div>
        </div>
      </div>
    </section>
  );
};

export default How;
