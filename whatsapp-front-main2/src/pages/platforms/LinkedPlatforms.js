import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Chain } from "../../assets/chain.svg";
import { PlatformsContext } from "../../contexts/PlatformsContext";
import "./Platforms.scss";

const LinkedPlatforms = () => {
  const { selectedPlatforms } = useContext(PlatformsContext);

  return (
    <Layout>
      <div className="container mt-4 linked-platforms">
        <div className="row">
          <div className="col-md-12">
            <h2> المنصات المرتبطة</h2>
            <p> اربط منصتك في خطوة واحدة ، واستفد من ميزات كثيرة وحصرية</p>
          </div>

          <div className="mb-3">
            <Link
              to="/linked-platforms/chain"
              className="btn platform d-inline-block"
            >
              <Chain />
              <p>ربط منصة جديدة </p>
            </Link>
          </div>
        </div>

        {selectedPlatforms.length > 0 ? (
          <ul>
            {selectedPlatforms.map((platform) => (
              <li key={platform.id}>{platform.name}</li>
            ))}
          </ul>
        ) : (
          <p>لم يتم ربط أي منصات بعد.</p>
        )}
      </div>
    </Layout>
  );
};

export default LinkedPlatforms;
