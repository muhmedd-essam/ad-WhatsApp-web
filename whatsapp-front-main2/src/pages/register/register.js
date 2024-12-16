import { useForm } from "react-hook-form";
import { googlesignup, signup } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import registerImg from "../../assets/register-bg.svg";
import Footer from "../../components/Footer/Footer";
import { ReactComponent as Google } from "../../assets/bi_google.svg";
import PhoneInput from "react-phone-number-input"; // Import the phone input
import "react-phone-number-input/style.css"; // Import the default styles for the phone input
import "./register.scss";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(""); // Phone number state

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const { name, email, company, password } = data;

    try {
      setLoading(true);

      const result = await signup(
        name,
        email,
        phoneNumber, // Send the phone number with country code
        company,
        password
      );

      if (result.status === true) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };
  const googleLogin = async (data) => {
    const { name, email, sub } = data;

    try {
      setLoading(true);

      const result = await googlesignup(
        name,
        email,
        
        sub
      );
      console.log(result);
      if (result.status === true) {
        toast.success("Registration successful!");
        navigate("/login");
      }else{
        toast.error("هذ البريد مستخدم بالفعل")
        navigate("/login")
      } 
     
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="container mt-5 text-center">
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit(onSubmit)} className="m-auto">
              <h2 className="text-dark">أنشاء حساب</h2>

              <div className="form-group">
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="form-control"
                  placeholder="الاسم بالكامل"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  {...register("company", {
                    required: "Company name is required",
                  })}
                  className="form-control"
                  placeholder="اسم الشركة"
                  disabled={loading}
                />
                {errors.company && (
                  <p className="text-danger">{errors.company.message}</p>
                )}
              </div>

              {/* Phone input with country code */}
              <div className="form-group">
                <PhoneInput
                  placeholder="رقم الهاتف"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  defaultCountry="EG"
                  disabled={loading}
                  className="form-control"
                />
                {errors.phone && (
                  <p className="text-danger">{errors.phone.message}</p>
                )}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="form-control"
                  placeholder="عنوان بريدك الإلكتروني"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="كلمة السر"
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  className="form-control"
                  placeholder="تأكيد كلمة المرور"
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="text-danger">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn text-white mt-3"
                disabled={loading}
              >
                {loading ? "جاري التسجيل..." : "تسجيل"}
              </button>

              <div className="register-google">
                <div className="   ">
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
              </div>
            </form>
          </div>

          <div className="col-md-6">
            <h2>أهلًا بك في أد واتس</h2>

            <div className="img-wrapper">
              <img src={registerImg} alt="Register" />
            </div>

            <div className="btns d-flex align-items-center justify-content-center flex-column mt-3">
              <p>هل لديك حساب؟</p>
              <Link to={"/login"} className="btn text-white underline_link">
                قم بتسجيل دخولك الآن
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
