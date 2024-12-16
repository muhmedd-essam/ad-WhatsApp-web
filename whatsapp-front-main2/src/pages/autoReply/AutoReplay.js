import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Auto } from "../../assets/auto-replay.svg";

const AutoReplay = () => {
  return (
    <Layout>
      <div className="container mt-4 contacts-section">
        <div className="row">
          <div className="col-md-12">
            <h2>الرد الآلي</h2>
            <p>
              هنا الردود الآلية المرتبطة بحسابات الواتساب ، يجب تفعيلها لتعمل
              الروبوتات الذكية بشكل سليم
            </p>
          </div>
        </div>
        <div className="mb-3">
          <Link to="/auto-reply/create" className="btn contact d-inline-block">
            <Auto />
            <p>إنشاء روبوت جديد</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AutoReplay;
