import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllFilesAsync,
  deleteFileAsync,
  selectAllFiles,
  selectAllFilesFetchStatus,
  selectAllFilesFetchError,
  selectYourSizeCount,
  selectYourFreeSize,
} from "../../store/reducers/filesSlice";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Upload } from "../../assets/upload.svg";
import "./Files.scss";

const FileManager = () => {
  const dispatch = useDispatch();
  const files = useSelector(selectAllFiles);
  const filesFetchStatus = useSelector(selectAllFilesFetchStatus);
  const filesFetchError = useSelector(selectAllFilesFetchError);

  // Select the size-related values
  const yourSizeCount = useSelector(selectYourSizeCount);
  const yourFreeSize = useSelector(selectYourFreeSize);

  const [loadingMessage, setLoadingMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllFilesAsync());
  }, [dispatch]);

  const handleDelete = async (fileId) => {
    if (!fileId) {
      toast.error("معرف الملف غير صالح");
      return;
    }
    try {
      setLoadingMessage("جاري حذف الملف...");
      setIsDeleting(true);
      await dispatch(deleteFileAsync(fileId)).unwrap();
      toast.success("تم حذف الملف بنجاح");
      dispatch(getAllFilesAsync());
    } catch (error) {
      toast.error("فشل في حذف الملف. يرجى المحاولة مرة أخرى");
    } finally {
      setLoadingMessage("");
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-4 upload-section">
        <div className="row">
          <div className="col-md-12">
            <h2>إدارة الملفات</h2>
            <p>
              الاستخدام: {yourSizeCount.toFixed(2)} /
              {yourSizeCount + yourFreeSize}
              ميجابايت
            </p>
            <p className="text-danger">
              عند حذف ملف، سيتم تخطي الرسائل التي تستخدمه، لذلك توخى الحذر عند
              الحذف
            </p>
            {filesFetchStatus === "loading" && <p>جاري تحميل الملفات...</p>}
            {filesFetchStatus === "failed" && (
              <p className="text-danger">
                {filesFetchError?.message || "حدث خطأ أثناء جلب الملفات"}
              </p>
            )}
            {loadingMessage && <p className="text-info">{loadingMessage}</p>}
          </div>
        </div>

        <div className="mb-3">
          <Link
            to="/file-management/create"
            className="btn contact upload d-inline-block"
          >
            <Upload />
            <p>تحميل ملف جديد</p>
          </Link>
        </div>

        <h3>الملفات</h3>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {/* Add a check to ensure 'files' is an array */}
          {(!Array.isArray(files) || files.length === 0) &&
            filesFetchStatus !== "loading" && <p>لا توجد ملفات متاحة.</p>}

          {Array.isArray(files) &&
            files.map((file, index) => {
              if (!file || typeof file !== "object") {
                console.error(`Invalid file object at index ${index}:`, file);
                return null;
              }
              return (
                <div key={file.id || index} className="col">
                  <div className="card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">
                        {file.type || "نوع غير معروف"}
                      </h5>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(file.id)}
                        disabled={isDeleting}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
};

export default FileManager;
