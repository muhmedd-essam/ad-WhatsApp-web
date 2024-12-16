import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Upload } from "../../assets/upload.svg";
import {
  uploadContactsAsync,
  setCurrentFileName,
  setCurrentFileContent,
  clearCurrentFile,
  clearError,
  selectCurrentFileName,
  selectCurrentFileContent,
  selectContactsStatus,
  selectContactsError,
} from "../../store/reducers/contactSlice";

const ContactsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileName = useSelector(selectCurrentFileName);
  const fileContent = useSelector(selectCurrentFileContent);
  const status = useSelector(selectContactsStatus);
  const error = useSelector(selectContactsError);

  useEffect(() => {
    // Clear any existing errors when the component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(setCurrentFileContent(file));
      dispatch(setCurrentFileName(file.name));
    } else {
      dispatch(clearCurrentFile());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileName && fileContent) {
      const resultAction = await dispatch(
        uploadContactsAsync({ name: fileName, content: fileContent })
      );
      if (uploadContactsAsync.fulfilled.match(resultAction)) {
        navigate("/contact-list");
      }
    }
  };

  const handleDeleteFile = () => {
    dispatch(clearCurrentFile());
  };

  return (
    <Layout>
      <div className="container my-5 upload-form">
        <div className="row">
          <div className="col-md-12">
            <h2>قائمة الاتصال</h2>
            <p> نموذج قائمة الاتصال</p>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <h3>بيانات القائمة</h3>
              </div>
            </div>
            <div className="mb-3 p-3">
              <input
                type="text"
                className="form-control"
                id="fileName"
                value={fileName}
                onChange={(e) => dispatch(setCurrentFileName(e.target.value))}
                required
                placeholder="الاسم التوضيحي"
              />
            </div>

            <div className="mb-3 p-3">
              <label htmlFor="fileUpload" className="upload-label-custom">
                <Upload className="upload-icon" />
                <span>أختار ملف (Excel أو CSV)</span>
              </label>
              <input
                type="file"
                className="d-none"
                id="fileUpload"
                onChange={handleFileChange}
                required
                accept=".xlsx, .csv"
              />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error.message}
                {error.errors && error.errors.file && (
                  <ul>
                    {error.errors.file.map((errorMsg, index) => (
                      <li key={index}>{errorMsg}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn m-3 text-white"
                disabled={status === "loading"}
              >
                {status === "loading" ? "جاري الرفع..." : "رفع الملف"}
              </button>
              {fileContent && (
                <button
                  type="button"
                  className="btn m-3 text-white bg-danger"
                  onClick={handleDeleteFile}
                >
                  حذف الملف
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ContactsForm;
