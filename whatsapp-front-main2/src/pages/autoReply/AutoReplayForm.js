import axios from "axios";
import Layout from "../../components/Layout/Layout";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAccountsAsync,
  selectAccounts,
  selectAccountStatus,
  selectAccountError,
} from "../../store/reducers/accountSlice";
import { getUserData } from "../../services/profileService";

const AutoReplyForm = () => {
  const [userId, setUserId] = useState(null);
  
  const [formData, setFormData] = useState({
    phone_sender: "",
    keywords: "",
    response: "",
    matchType: "contains", // Default match type
    mediaUrl: "", // Optional media URL
    isActive: true, // Default active state
  });
  const [autoReplies, setAutoReplies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const accountStatus = useSelector(selectAccountStatus);
  const accountError = useSelector(selectAccountError);

  useEffect(() => {
    dispatch(fetchAccountsAsync());
  }, [dispatch]);

  const fetchAutoReplies = async (userId) => {
    try {
      const response = await axios.get(
        `  http://localhost:4000/auto-reply-rules/${userId}`
      );
      setAutoReplies(response.data);
    } catch (err) {
      setError("Failed to fetch auto-reply rules");
      console.error("Error fetching auto-replies:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getUserData();
        setUserId(userData.data.id);
        await fetchAutoReplies(userData.data.id);
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const keywords = formData.keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    const ruleData = {
      phone_sender: formData.phone_sender,
      keywords,
      response: formData.response,
      matchType: formData.matchType,
      mediaUrl: formData.mediaUrl || null,
      isActive: formData.isActive,
    };

    try {
      if (editingId) {
        await axios.put(`  http://localhost:4000/auto-reply/${editingId}`, {
          userId,
          ruleData,
        });
      } else {
        await axios.post("  http://localhost:4000/auto-reply", {
          userId,
          ruleData,
        });
      }

      await fetchAutoReplies(userId);
      resetForm();
    } catch (err) {
      setError("Failed to save auto-reply rule");
      console.error("Error saving auto-reply rule:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setFormData({
      phone_sender: rule.phone_sender,
      keywords: rule.keywords.join(", "),
      response: rule.response,
      matchType: rule.matchType,
      mediaUrl: rule.mediaUrl || "",
      isActive: rule.isActive,
    });
  };

  const handleDelete = async (ruleId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الرد الآلي؟")) {
      try {
        setLoading(true);
        await axios.delete(`  http://localhost:4000/auto-reply/${ruleId}`);
        await fetchAutoReplies(userId);
      } catch (err) {
        setError("Failed to delete auto-reply rule");
        console.error("Error deleting rule:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      phone_sender: "",
      keywords: "",
      response: "",
      matchType: "contains",
      mediaUrl: "",
      isActive: true,
    });
    setEditingId(null);
  };

  if (loading && !autoReplies.length) {
    return (
      <Layout>
        <div className="container mt-4">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <h2>الرد الآلي</h2>
            <p>
              قم بإعداد الردود الآلية على الرسائل الواردة باستخدام الكلمات
              المفتاحية
            </p>
            {error && <div className="alert alert-danger">{error}</div>}
          </div>
        </div>

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-section">
                <h3>{editingId ? "تعديل الرد الآلي" : "إضافة رد آلي جديد"}</h3>

                <div className="mb-3 p-3">
                  <label htmlFor="phone_sender" className="form-label">
                    حساب الواتساب
                  </label>
                  <select
                    id="phone_sender"
                    name="phone_sender"
                    className="form-control"
                    value={formData.phone_sender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      اختر...
                    </option>
                    {accounts?.numbers?.map((account) => (
                      <option key={account.id} value={account.phone_number}>
                        {account.name || account.phone_number}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3 p-3">
                  <label htmlFor="matchType" className="form-label">
                    نوع المطابقة
                  </label>
                  <select
                    id="matchType"
                    name="matchType"
                    className="form-control"
                    value={formData.matchType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="exact">مطابقة تامة</option>
                    <option value="contains">يحتوي على</option>
                    <option value="regex">تعبير منتظم (Regex)</option>
                  </select>
                </div>

                <div className="mb-3 p-3">
                  <label htmlFor="keywords" className="form-label">
                    الكلمات المفتاحية (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    placeholder="مثال: مرحبا, السعر, المنتج"
                    required
                  />
                </div>

                <div className="mb-3 p-3">
                  <label htmlFor="response" className="form-label">
                    الرد الآلي
                  </label>
                  <textarea
                    className="form-control"
                    id="response"
                    name="response"
                    value={formData.response}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="mb-3 p-3">
                  <label htmlFor="mediaUrl" className="form-label">
                    رابط الوسائط (اختياري)
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="mediaUrl"
                    name="mediaUrl"
                    value={formData.mediaUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="mb-3 p-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "isActive",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <label className="form-check-label " htmlFor="isActive">
                      تفعيل الرد الآلي
                    </label>
                  </div>
                </div>

                <div className="mb-3 p-3">
                  <button
                    type="submit"
                    className="btn btn-primary me-2"
                    disabled={loading}
                  >
                    {loading
                      ? "جاري الحفظ..."
                      : editingId
                      ? "تحديث الرد الآلي"
                      : "إضافة الرد الآلي"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-section">
                <h3>الردود الآلية الحالية</h3>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>الكلمات المفتاحية</th>
                        <th>نوع المطابقة</th>
                        <th>الرد</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {autoReplies.map((rule) => (
                        <tr key={rule.id}>
                          <td>{rule.keywords.join(", ")}</td>
                          <td>
                            {rule.matchType === "exact"
                              ? "مطابقة تامة"
                              : rule.matchType === "contains"
                              ? "يحتوي على"
                              : "تعبير منتظم"}
                          </td>
                          <td>{rule.response}</td>
                          <td>
                            <span
                              className={`badge ${
                                rule.isActive ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              {rule.isActive ? "مفعل" : "معطل"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => handleEdit(rule)}
                            >
                              تعديل
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(rule.id)}
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AutoReplyForm;
