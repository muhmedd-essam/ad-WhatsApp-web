import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { login as authLogin } from "../../services/authService";
import loginImg from "../../assets/login-bg.svg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.scss";
import { jwtDecode } from "jwt-decode";
import Footer from "../../components/Footer/Footer";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { login } = useContext(AuthContext);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //extract data from google token
  

const nav=useNavigate()




  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);
    try {
      // Attempt to log in the user
      const response = await authLogin(email, password);

      // Check if response contains error or invalid token
      if (response) {
        login(response);
        
        toast.success("اهلا بك في الموقع");
        // Clear input fields
        setError(""); // Clear any previous errors
      } else {
        // If no token is returned, handle as an error
        const errorMessage = response.msg || "بيانات المستخدم غير صحيحة";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      // Handle network or server errors
      setError("بيانات المستخدم غير صحيحة");
      toast.error("بيانات المستخدم غير صحيحة");
    } finally {
      setLoading(false);
    }
  };
  const googleLogin = async (data) => {
    const { email, sub } = data;
    setLoading(true);
    try {
      // Attempt to log in the user
      const response = await authLogin(email, sub);
      console.log(response)
      // Check if response contains error or invalid token
      if (response) {
        login(response);
        
        toast.success("اهلا بك في الموقع");
        // Clear input fields
        setError(""); // Clear any previous errors
      } else {
        // If no token is returned, handle as an error
        const errorMessage = response.msg || "بيانات المستخدم غير صحيحة";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      // Handle network or server errors
      setError("بيانات المستخدم غير صحيحة");
      toast.error("بيانات المستخدم غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="container mt-5 text-center">
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit(onSubmit)} className="m-auto">
              <h2 className="text-dark">تسجيل الدخول</h2>

              <div className="form-group">
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="form-control"
                  placeholder="أدخل بريدك الالكتروني"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="form-control"
                  placeholder="كلمة المرور"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={loading}
              >
                {loading ? "جاري الدخول..." : "دخول"}
              </button>
              <div className=" ">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  const decoded = jwtDecode(credentialResponse?.credential);
                  console.log(decoded);
                  googleLogin(decoded)
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
              </div>
            </form>
          </div>

          <div className="col-md-6">
            <h2 className="mb-4">أهلًا بك في أد واتس</h2>

            <div className="img-wrapper">
              <img src={loginImg} alt="Register" className="img-fluid" />
            </div>

            <div className="btns d-flex align-items-center justify-content-center flex-column mt-3">
              <p>ليس لديك حساب ؟ </p>
              <Link to={"/register"} className="btn text-white underline_link">
                انشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
