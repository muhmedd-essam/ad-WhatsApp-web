import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Auto } from "../../assets/robot-ico.svg";
const SmartBot = () => {
  return (
    <Layout>
    <div className="container mt-4 contacts-section">
      <div className="row">
        <div className="col-md-12">
          <h2>الروبوت الذكي</h2>
          <p>
            الروبوت الذكي يتفاعل مع عملائك و يستجيب لهم
          </p>
        </div>
      </div>
      <div className="mb-3 m-0 ">
        <Link to="/smart-bot/create" className="btn  contact d-inline-block">
          <Auto />
          <p>إنشاء روبوت جديد</p>
        </Link>
      </div>
    </div>
  </Layout>
  );
};

export default SmartBot;
