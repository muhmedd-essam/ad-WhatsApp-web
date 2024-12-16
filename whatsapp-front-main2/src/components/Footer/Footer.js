import "./Footer.scss";
import { Link } from "react-router-dom";
import { ReactComponent as Facebook } from "../../assets/facebook.svg";
import { ReactComponent as X } from "../../assets/x.svg";
import { ReactComponent as Instagram } from "../../assets/insta.svg";
import { ReactComponent as Youtube } from "../../assets/youtube.svg";
const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-3">
                <ul>
                  <li>
                    <Link to="/register">إنشاء حساب جديد</Link>
                  </li>
                  <li>
                    <Link to="/login">الدخول إلى حسابي</Link>
                  </li>
                  <li>
                    <Link to="/employeeLogin">الدخول كموظف</Link>
                  </li>
                </ul>
              </div>

              <div className="col-md-3">
                <ul>
                  <li>
                    <Link to="/about">عن أد واتس</Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">سياسة الخصوصية</Link>
                  </li>
                  <li>
                    <Link to="/guarantee-rights">اضمن حقوقك</Link>
                  </li>
                  <li>
                    <Link to="/terms-conditions">الشروط و الأحكام</Link>
                  </li>
                </ul>
              </div>

              <div className="col-md-3">
                <ul>
                  <li>
                    <Link to="/pricing">باقات أد واتس</Link>
                  </li>
                  <li>
                    <Link to="/faq">الأسئلة الشائعة</Link>
                  </li>
                  <li>
                    <Link to="/contact">اتصل بنا</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-3 text-center d-flex flex-column align-items-center justify-content-between">
            <div className="footer-logo">Logo</div>
            <div className="social-icons">
              <ul>
                <li>
                  <X />
                </li>

                <li>
                  <Instagram />
                </li>
                <li>
                  <Youtube />
                </li>

                <li>
                  <Facebook />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
