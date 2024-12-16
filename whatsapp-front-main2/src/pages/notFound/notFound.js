import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

const NotFound = () => {
  return <Layout>
    <div className=" d-flex align-items-center flex-column w-100 justify-content-center"style={{minHeight:"100vh"}} >
            <h1>ليس لديك صلاحيه للوصول</h1>
            <Link to="/"><button className="btn btn-info">الرجوع للرئيسيه</button></Link>
          </div>; 
  </Layout>
};

export default NotFound;
