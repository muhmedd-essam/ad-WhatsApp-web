import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  setCurrentFileName,
  clearCurrentFile,
  uploadFilesAsync,
} from "../../store/reducers/filesSlice";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Upload } from "../../assets/upload.svg";
import { getUserData } from "../../services/profileService";
import "./Files.scss";

const UploadForm = () => {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getUserData();

        setUserId(data.id);
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };
    fetchUserData();

    return () => {
      dispatch(clearCurrentFile());
    };
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileContent(file);
      setFileName(file.name);
      dispatch(setCurrentFileName(file.name));

      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await dispatch(
        uploadFilesAsync({ name: fileName, content: fileContent, id: userId })
      ).unwrap();
      toast.success("File uploaded successfully!");
      navigate("/file-management");
    } catch (error) {
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
      dispatch(clearCurrentFile());
    }
  };

  const handleDeleteFile = () => {
    setFileContent(null);
    setPreviewUrl(null);
    setFileName("");
    dispatch(clearCurrentFile());
  };

  return (
    <Layout>
      <div className="container my-5 upload-form">
        <div className="row">
          <div className="col-md-12">
            <h2>إدارة الملفات</h2>
            <p>نموذج الملف</p>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <h3>بيانات الملف</h3>
              </div>
            </div>
            <div className="mb-3 p-3">
              <input
                type="text"
                className="form-control"
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
                placeholder="الاسم التوضيحي"
              />
            </div>

            <div className="mb-3 p-3">
              <label htmlFor="fileUpload" className="upload-label-custom">
                <Upload className="upload-icon" />
                <span>أختار ملف</span>
              </label>
              <input
                type="file"
                className="d-none"
                id="fileUpload"
                onChange={handleFileChange}
                required
              />
            </div>

            {previewUrl && (
              <div className="mb-3 p-3">
                <label className="form-label">معاينة الملف</label>
                {fileContent && fileContent.type.startsWith("image/") ? (
                  <img src={previewUrl} alt="Preview" className="img-fluid" />
                ) : (
                  <embed src={previewUrl} width="100%" height="400px" />
                )}
              </div>
            )}

            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn m-3 text-white"
                disabled={isLoading}
              >
                {isLoading ? "جاري الرفع..." : "رفع الملف"}
              </button>
              {fileContent && (
                <button
                  type="button"
                  className="btn m-3 text-white bg-danger"
                  onClick={handleDeleteFile}
                  disabled={isLoading}
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

export default UploadForm;
