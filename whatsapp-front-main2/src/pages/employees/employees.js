import React from 'react';
import Layout from '../../components/Layout/Layout';
import { Link } from 'react-router-dom';
import { ReactComponent as Auto } from "../../assets/employee.svg";

function Employees(){
    return(
        <Layout>
               <div className="container mt-4 contacts-section">
        <div className="row">
          <div className="col-md-12">
            <h2> الموظفين</h2>
            <p>أضف موظفين لمساعدتك في اداء المهام</p>
          </div>
        </div>
        <div className="mb-3 ">
          <Link to="/employees/create" className="btn contact d-inline-block">
            <Auto />
            <p>أضف موظف جديد</p>
          </Link>
        </div>
      </div>
        </Layout>
    )
}
export default Employees