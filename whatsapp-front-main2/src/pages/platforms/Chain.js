import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { PlatformsContext } from "../../contexts/PlatformsContext";
import "./Platforms.scss";

const platforms = [
  { id: 1, name: "زاد " },
  { id: 2, name: "سلة" },
];

const Chain = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const { choosePlatform } = useContext(PlatformsContext);
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const platformId = parseInt(event.target.value, 10);
    setSelectedPlatform(
      platforms.find((platform) => platform.id === platformId)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPlatform) {
      choosePlatform(selectedPlatform);
      navigate("/linked-platforms"); // Navigate to LinkedPlatforms
    } else {
      alert("Please select a platform to proceed.");
    }
  };

  return (
    <Layout>
      <div className="container my-5 upload-form">
        <div className="row">
          <div className="col-md-12">
            <h2>المنصات المرتبطة</h2>
            <p>اختر المنصة وقم بربطها في خطوة واحدة فقط</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12">
              <h3>بيانات المنصة</h3>
              <div className="mb-3 p-3">
                <label htmlFor="platformSelect" className="form-label">
                  اختر المنصة:
                </label>
                <select
                  id="platformSelect"
                  className="form-control"
                  value={selectedPlatform ? selectedPlatform.id : ""}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="" disabled>
                    اختر منصة
                  </option>
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button type="submit" className="btn m-3 text-white">
            ربط المنصة
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Chain;
