import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Chat } from "../../assets/single-chat.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllConversationsAsync,
  deleteConversationAsync,
  selectConversations,
  selectConversationStatus,
  selectConversationError,
} from "../../store/reducers/conversationSlice";
import "./SingleMessaging.scss";

const SingleMessaging = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);
  const status = useSelector(selectConversationStatus);
  const error = useSelector(selectConversationError);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    // Fetch all conversations when the component mounts
    dispatch(fetchAllConversationsAsync());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("هل تريد حذف هذه المحادثة؟")) {
      await dispatch(deleteConversationAsync(id));
      // Re-fetch conversations after deleting one
      dispatch(fetchAllConversationsAsync());
    }
  };

  return (
    <Layout>
      <div className="container mt-4 singlemessaging-section">
        <div className="row">
          <div className="col-md-12">
            <h2> المراسلة الفردية</h2>
            <p>تواصل مباشرة مع عملاءك من خلال الدردشة المباشرة لاد واتس</p>
            <p className="text-danger">
              تنبيه: المراسلة الفردية توقف عمل الرد التلقائي والروبوت الذكي
              للمستخدمين النشطين هنا ، وتعود للعمل فور اغلاق المراسلة الخاصة بهم
              هنا
            </p>
          </div>
        </div>

        {/* Button to create a new conversation */}
        <div className="mb-3">
          <Link
            to="/individual-messaging/create"
            className="btn contact singlemessaging d-inline-block"
          >
            <Chat />
            <p>أنشاء دردشة جديدة</p>
          </Link>
        </div>

        {status === "loading" && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}

        {conversations.length > 0 ? (
          <ul className="list-group mt-3">
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <Link to={`/conversation/${conversation.id}`}>
                  {conversation.name} - {conversation.phone}
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setSelectedConversation(conversation.id)}
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>لا توجد محادثات</p>
        )}

        {/* Delete Confirmation Dialog */}
        <div
          className="modal fade"
          id="deleteModal"
          tabIndex="-1"
          aria-labelledby="deleteModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">
                  تأكيد الحذف
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                هل أنت متأكد أنك تريد حذف هذه المحادثة؟
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={() => handleDelete(selectedConversation)}
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleMessaging;
