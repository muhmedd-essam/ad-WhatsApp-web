import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getUserData } from "./../../services/profileService";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfileAsync,
  changePasswordAsync,
  selectProfileUpdateStatus,
  selectPasswordChangeStatus,
  clearErrors, // Import clearErrors
} from "../../store/reducers/profileReducer";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Timer } from "../../assets/timer.svg";
import { ReactComponent as Checked } from "../../assets/checked.svg";
import { ReactComponent as Coupon } from "../../assets/copoun.svg";
import { toast } from "react-toastify";
import "./profile.scss";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const dispatch = useDispatch();
  const profileUpdateStatus = useSelector(selectProfileUpdateStatus);
  const passwordChangeStatus = useSelector(selectPasswordChangeStatus);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getUserData();
        setUser(data);
        setValue("name", data.name);
        setValue("company", data.company);
        setValue("tax_number", data.tax_number);
      } catch (error) {
        toast.error("فشل في جلب بيانات المستخدم");
      }
    };
    fetchUserData();
  }, [setValue]);

  useEffect(() => {
    if (profileUpdateStatus === "succeeded") {
      toast.success("تم تحديث الملف الشخصي بنجاح");
      setIsProfileUpdating(false);
    } else if (profileUpdateStatus === "failed") {
      toast.error("فشل تحديث الملف الشخصي");
      setIsProfileUpdating(false);
    }
  }, [profileUpdateStatus]);

  useEffect(() => {
    if (passwordChangeStatus === "succeeded") {
      toast.success("تم تغيير كلمة المرور بنجاح");
      setIsPasswordUpdating(false);
      resetPasswordForm();
      dispatch(clearErrors()); // Clear errors on successful password change
    } else if (passwordChangeStatus === "failed") {
      toast.error("فشل تغيير كلمة المرور");
      setIsPasswordUpdating(false);
    }
  }, [passwordChangeStatus, resetPasswordForm, dispatch]);

  const onSubmitProfile = async (data) => {
    const updatedData = {
      name: data.name !== user.name ? data.name : "",
      company: data.company !== user.company ? data.company : "",
      tax_number: data.tax_number !== user.tax_number ? data.tax_number : "",
    };

    const filteredData = Object.fromEntries(
      Object.entries(updatedData).filter(([_, value]) => value !== "")
    );

    if (Object.keys(filteredData).length === 0) {
      toast.info("لم يتم إجراء أي تغييرات");
      return;
    }

    setIsProfileUpdating(true);
    dispatch(updateProfileAsync(filteredData));
  };

  const onSubmitPassword = async (data) => {
    if (data.currPassword && data.newPassword) {
      const passwordData = {
        current_password: data.currPassword,
        new_password: data.newPassword,
      };

      setIsPasswordUpdating(true);
      dispatch(changePasswordAsync(passwordData));
    } else {
      toast.warn("يرجى إدخال كلمة المرور الحالية والجديدة");
    }
  };

  return (
    <Layout>
      <div className="container mt-5 profile-section">
        <div className="row">
          <div className="col-md-12">
            <h2>ملفي</h2>
            <p>هنا يمكنك التحكم في بيانات و إعدادات ملفك</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <form
              onSubmit={handleSubmit(onSubmitProfile)}
              autoComplete="off"
              className="mt-5"
            >
              <div className="row">
                <div className="col-md-12">
                  <h3>بياناتي</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="الاسم بالكامل"
                    {...register("name")}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="company"
                    placeholder="اسم الشركة"
                    className="form-control"
                    {...register("company")}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="tax"
                    placeholder="الرقم الضريبي"
                    className="form-control"
                    {...register("tax_number")}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn text-white mx-5 mb-3"
                disabled={isProfileUpdating}
              >
                {isProfileUpdating ? "جاري التحديث..." : "تحديث"}
              </button>
            </form>
          </div>
          <div className="col-md-6">
            <form
              onSubmit={handlePasswordSubmit(onSubmitPassword)}
              className="mt-5"
              autoComplete="off"
            >
              <div className="row">
                <div className="col-md-12">
                  <h3>تغيير كلمة السر</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="form-group">
                  <input
                    type="password"
                    id="currPassword"
                    className="form-control"
                    placeholder="كلمة المرور الحالية"
                    {...registerPassword("currPassword", {
                      required: "كلمة المرور الحالية مطلوبة",
                      minLength: {
                        value: 6,
                        message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
                      },
                    })}
                  />
                  {passwordErrors.currPassword && (
                    <p className="text-danger">
                      {passwordErrors.currPassword.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    id="newPassword"
                    className="form-control"
                    placeholder="كلمة المرور الجديدة"
                    {...registerPassword("newPassword", {
                      required: "كلمة المرور الجديدة مطلوبة",
                      minLength: {
                        value: 6,
                        message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
                      },
                    })}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-danger">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn text-white mx-5 mb-3"
                disabled={isPasswordUpdating}
              >
                {isPasswordUpdating ? "جاري التحديث..." : "تحديث"}
              </button>
            </form>
          </div>
        </div>

        <div className="reminder">
          <div className="row">
            <div className="col-md-12">
              <h3 className="reminder__title fs-5">
                التسويق بالعمولة ، سوق عبر نشر الكوبون الخاص بك ، واحصل على
                عمولة لكل اشتراك جديد
              </h3>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="reminder__item">
                <div className="reminder__icon">
                  <Timer />
                </div>
                <h4> الكوبون الخاص بك</h4>
                <p className="fw-bold">YHDHYKUP</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="reminder__item">
                <div className="reminder__icon">
                  <Checked />
                </div>
                <h4> العمولات المكتملة</h4>
                <p className="fw-bold"> 0 ر.س</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="reminder__item">
                <div className="reminder__icon">
                  <Coupon />
                </div>
                <h4> العمولات المعلقة</h4>
                <p className="fw-bold"> 0 ر.س</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
