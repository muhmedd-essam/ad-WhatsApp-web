import React, { useEffect, useState } from "react"; // Import useState
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Contact } from "../../assets/contacts.svg";
import "./Contacts.scss";
import {
  getContactsAsync,
  selectAllContacts,
  selectContactsFetchStatus,
  selectContactsFetchError,
  deleteContactAsync,
} from "../../store/reducers/contactSlice";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const ContactsList = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectAllContacts);
  const status = useSelector(selectContactsFetchStatus);
  const error = useSelector(selectContactsFetchError);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null); // Local state for tracking the loading state of the delete operation

  useEffect(() => {
    dispatch(getContactsAsync());
  }, [dispatch]);

  const handleDelete = async (name) => {
    setLoadingDeleteId(name); // Set loading state to true for the specific name
    try {
      await dispatch(deleteContactAsync({ name })).unwrap(); // Use unwrap to handle the promise
      toast.success("تم حذف الاتصال بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الاتصال");
    } finally {
      setLoadingDeleteId(null); // Reset loading state
    }
  };

  return (
    <Layout>
      <div className="container mt-4 contacts-section">
        <div className="row">
          <div className="col-md-12">
            <h2>قوائم الاتصال</h2>
            <p>
              يمكنك تقسيم عملائك إلى مجموعات غير محدودة ، لتسهيل إدارتهم لاحقًا
            </p>
          </div>
        </div>
        <div className="mb-3">
          <Link
            to="/contact-list/create"
            className="btn contact d-inline-block"
          >
            <Contact />
            <p>أنشاء قائمة اتصال جديدة</p>
          </Link>
        </div>

        {status === "loading" && <div>جاري التحميل...</div>}
        {status === "failed" && <div>خطأ: {error.message}</div>}

        {status === "succeeded" && (
          <>
            {contacts && contacts.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-5">
                {contacts.map((contact) => (
                  <div key={contact.list_name} className="col-md-6">
                    <div className="card">
                      <div className="card-body d-flex justify-content-between flex-column align-items-end">
                        <h5 className="card-title mb-0 fw-bold ">
                          {contact.list_name}
                        </h5>
                        <p>{contact.contacts.length} جهة اتصال</p>
                        <button
                          className="btn delete"
                          onClick={() => handleDelete(contact.list_name)}
                          disabled={loadingDeleteId === contact.list_name} // Disable button if this contact is being deleted
                        >
                          {loadingDeleteId === contact.list_name ? (
                            <span>جاري الحذف...</span> // Show loading text while deleting
                          ) : (
                            <Trash2 />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info mt-4">
                لا توجد قوائم اتصال حالياً. يرجى إنشاء قائمة جديدة.
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ContactsList;
