import { ReactComponent as Contact } from "../../assets/contacts.svg";
import { ReactComponent as Media } from "../../assets/media.svg";
import { ReactComponent as Whatsapp } from "../../assets/whatsapp.svg";
import { ReactComponent as Chain } from "../../assets/chain.svg";
import { ReactComponent as Robot } from "../../assets/robot.svg";
import { ReactComponent as Auto } from "../../assets/auto-replay.svg";
import { ReactComponent as Conversation } from "../../assets/conversation.svg";
import { ReactComponent as Gift } from "../../assets/gift.svg";
import { ReactComponent as Support } from "../../assets/support.svg";
import { ReactComponent as Employee } from "../../assets/employee.svg";
import { ReactComponent as Api } from "../../assets/API.svg";
import { ReactComponent as Translate } from "../../assets/translate.svg";
import { ReactComponent as Model } from "../../assets/model.svg";
import { ReactComponent as AllChat } from "../../assets/allchat.svg";

import "./Features.scss";

const Features = () => {
  return (
    <section className="features margin-big" id="features">
      <div className="container">
        <div className="row mb-4 text-center">
          <div className="col-12">
            <h2 className="text-white fs-3">الميزات الاحترافية</h2>
          </div>
        </div>
      </div>
      <div className="features-content container text-center">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-3 col-sm-6">
            <Conversation className="img-fluid" alt="Chat" />
            <h3> الدردشة الخاصة</h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Contact className="img-fluid" alt="Contact" />
            <h3> إدارة جهة الاتصال</h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Media className="img-fluid" alt="Media" />
            <h3> إدارة الملفات</h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Whatsapp className="img-fluid" alt="Whatsapp" />
            <h3> حسابات واتساب متعددة</h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Chain className="img-fluid" alt="Chain" />
            <h3> الربط مع منصات الشركاء</h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Robot className="img-fluid" alt="Robot" />
            <h3> الروبوت الذكي</h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Auto className="img-fluid" alt="Auto" />
            <h3> الرد الآلي</h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <AllChat className="img-fluid" alt="Chat" />
            <h3> الرسائل الجماعية</h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Gift className="img-fluid" alt="Gift" />
            <h3> باقات متنوعة</h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Support className="img-fluid" alt="Support" />
            <h3> دعم فني على مدار الساعة</h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Employee className="img-fluid" alt="Employee" />
            <h3> إضافة موظفين </h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Translate className="img-fluid" alt="Translate" />
            <h3> الترجمة الذكية </h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Model className="img-fluid" alt="Model" />
            <h3> إنشاء نماذج جديدة </h3>
          </div>

          <div className="col-md-3 col-sm-6">
            <Api className="img-fluid" alt="API" />
            <h3> وجهة للمبرمجين </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
