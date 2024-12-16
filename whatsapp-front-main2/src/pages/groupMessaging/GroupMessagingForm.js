import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccountsAsync,
  selectAccounts,
} from "../../store/reducers/accountSlice";
import { storeCampain } from "../../services/campainService";
import {
  getContactsAsync,
  selectAllContacts,
} from "../../store/reducers/contactSlice";
import { toast } from "react-toastify"; // Import Toast functions
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { getUserData } from "../../services/profileService";
import {
  getAllFilesAsync,
  selectAllFiles,
} from "../../store/reducers/filesSlice";

import axios from "axios";

const GroupMessagingForm = () => {
  const [formData, setFormData] = useState({
    campaignName: "",
    whatsappAccount: "",
    minInterval: "",
    maxInterval: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    userId: null,
  });

  const [selectedContact, setSelectedContact] = useState("");
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const contacts = useSelector(selectAllContacts);
  const navigate = useNavigate(); // Initialize navigate

  const files = useSelector(selectAllFiles);

  useEffect(() => {
    dispatch(fetchAccountsAsync());
    dispatch(getContactsAsync());
    dispatch(getAllFilesAsync());

    try {
      getUserData().then((res) => {
        setFormData({
          ...formData,
          userId: res.data.id,
        });
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [dispatch]);

  // Function to filter media items by type
  function filterMediaByType(mediaArray) {
    // Arrays to store different types of media
    const images = mediaArray.filter((item) => {
      const extension = item.path.toLowerCase().split(".").pop();
      return ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
    });

    const videos = mediaArray.filter((item) => {
      const extension = item.path.toLowerCase().split(".").pop();
      return ["mp4", "mov", "avi", "webm"].includes(extension);
    });

    const files = mediaArray.filter((item) => {
      const extension = item.path.toLowerCase().split(".").pop();
      return ["pdf", "doc", "docx", "xls", "xlsx", "txt"].includes(extension);
    });

    return {
      images,
      videos,
      files,
    };
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMessageChange = (index, field, value) => {
    const newMessages = [...messages];
    newMessages[index] = { ...newMessages[index], [field]: value };
    setMessages(newMessages);
  };

  const handleSelectChange = (event) => {
    console.log("Selected value:", event.target.value); // Debugging line
    setSelectedContact(event.target.value);
  };

  const addMessageInput = (type) => {
    setMessages([
      ...messages,
      { messageType: type, content: "", url: "", file: "" },
    ]);
  };

  // Inside your GroupMessagingForm component, modify the handleSubmit function:

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedList = contacts.find(
      (list) => list.list_name === selectedContact
    );

    const contactsToSend = selectedList
      ? selectedList.contacts.map((contact) => ({
          name: contact.name,
          number: contact.phone_number,
        }))
      : [];

    // Transform messages array to include file paths
    const processedMessages = messages.map((msg) => {
      // Find the corresponding file object based on the selected file ID
      const selectedFile = files.find(
        (file) => file.id.toString() === msg.file
      );

      return {
        type: msg.messageType,
        content: msg.content,
        url: msg.url,
        // Include the full file path if a file is selected
        filePath: selectedFile
          ? `https://whats.wolfchat.online/public/storage/${selectedFile.path}`
          : null,
        // You might want to include the file type for backend processing
        fileType: selectedFile
          ? selectedFile.path.split(".").pop().toLowerCase()
          : null,
      };
    });

    const dataToSend = {
      name: formData.campaignName,
      messages: processedMessages, // Send the processed messages array
      whatsapp_account: formData.whatsappAccount,
      start_date: formData.startDate,
      start_time: formData.startTime,
      end_date: formData.endDate,
      end_time: formData.endTime,
      min_delay: parseInt(formData.minInterval, 10),
      max_delay: parseInt(formData.maxInterval, 10),
      contacts: contactsToSend,
      userId: formData.userId,
    };

    try {
      const localResponse = await axios.post(
        "http://localhost:4000/create-campaign",
        dataToSend
      );
      console.log("Campaign created successfully:", localResponse.data);
      console.log(processedMessages);

      if (localResponse.status === 200) {
        const storeResponse = await storeCampain({
          name: formData.campaignName,
          messages: processedMessages,
          whatsapp_account: formData.whatsappAccount,
          start_date: formData.startDate,
          start_time: formData.startTime,
          end_date: formData.endDate,
          end_time: formData.endTime,
          min_delay: parseInt(formData.minInterval, 10),
          max_delay: parseInt(formData.maxInterval, 10),
          contact_list: selectedContact,
        });
        console.log("Campaign stored successfully:", storeResponse);

        toast.success("Campaign created and stored successfully!");
        navigate("/group-messaging");
      }
    } catch (error) {
      console.error(
        "Error creating campaign:",
        error.response?.data || error.message
      );
      toast.error(
        "Error creating campaign: " +
          (error.response?.data.message || error.message)
      );
    }
  };

  const renderMessageInput = (message, index) => {
    switch (message.messageType) {
      case "رسالة نصية":
      case "رسالة نصية برابط":
        return (
          <>
            <textarea
              name="content"
              className="form-control mb-2"
              value={message.content}
              onChange={(e) =>
                handleMessageChange(index, "content", e.target.value)
              }
              placeholder={`اكتب محتوى ${message.messageType} هنا...`}
              required
            />
            {message.messageType === "رسالة نصية برابط" && (
              <input
                type="url"
                name="url"
                className="form-control mb-2"
                placeholder="أدخل الرابط هنا"
                value={message.url}
                onChange={(e) =>
                  handleMessageChange(index, "url", e.target.value)
                }
                required
              />
            )}
          </>
        );
      case "صورة":
      case "صورة بنص كبير":
        return (
          <>
            <select
              name="file"
              className="form-select mb-2"
              value={message.file}
              onChange={(e) =>
                handleMessageChange(index, "file", e.target.value)
              }
              required
            >
              <option value="">اختر صورة...</option>
              {filterMediaByType(files).images.map((img, i) => (
                <option key={i} value={img.id}>
                  {img.type}
                </option>
              ))}
            </select>
            <textarea
              name="content"
              className="form-control mb-2"
              value={message.content}
              onChange={(e) =>
                handleMessageChange(index, "content", e.target.value)
              }
              placeholder="أدخل النص المصاحب للصورة هنا..."
              required
            />
          </>
        );
      case "فيديو":
      case "فيديو بنص كبير":
        return (
          <>
            <select
              name="file"
              className="form-select mb-2"
              value={message.file}
              onChange={(e) =>
                handleMessageChange(index, "file", e.target.value)
              }
              required
            >
              <option value="">اختر فيديو...</option>
              {filterMediaByType(files).videos.map((vid, i) => (
                <option key={i} value={vid.id}>
                  {vid.type}
                </option>
              ))}
            </select>
            <textarea
              name="content"
              className="form-control mb-2"
              value={message.content}
              onChange={(e) =>
                handleMessageChange(index, "content", e.target.value)
              }
              placeholder="أدخل النص المصاحب للفيديو هنا..."
              required
            />
          </>
        );
      case "ملف":
        return (
          <>
            <select
              name="file"
              className="form-select mb-2"
              value={message.file}
              onChange={(e) =>
                handleMessageChange(index, "file", e.target.value)
              }
              required
            >
              <option value="">اختر فيديو...</option>
              {filterMediaByType(files).files.map((file, i) => (
                <option key={i} value={file.id}>
                  {file.type}
                </option>
              ))}
            </select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <h2>حملة الرسائل</h2>
            <p>نموذج حملة الرسائل</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="row">
            <div className="col-md-6">
              <div className="form-section mb-4">
                <div className="card-header">
                  <h3 className="mb-0">بيانات الحملة</h3>
                </div>
                <div className="card-body p-4 p-4">
                  <div className="mb-3">
                    <label htmlFor="campaignName" className="form-label">
                      اسم الحملة
                    </label>
                    <input
                      type="text"
                      id="campaignName"
                      name="campaignName"
                      className="form-control"
                      value={formData.campaignName}
                      onChange={handleInputChange}
                      required
                      placeholder="أدخل اسم الحملة"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="whatsappAccount" className="form-label">
                      حساب الواتساب
                    </label>
                    <select
                      id="whatsappAccount"
                      name="whatsappAccount"
                      className="form-select"
                      value={formData.whatsappAccount}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        اختر...
                      </option>
                      {accounts.numbers &&
                        accounts.numbers.map((account, i) => (
                          <option key={account.id} value={account.phone_number}>
                            {account.name || account.phone_number}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contactList" className="form-label">
                      قائمة الاتصال
                    </label>
                    <select
                      id="contactList"
                      name="contactList"
                      className="form-select"
                      onChange={handleSelectChange}
                      value={selectedContact}
                      required
                    >
                      <option value="" disabled>
                        اختر...
                      </option>
                      {contacts
                        ? contacts.map((list, i) => (
                            <option key={i} value={list.list_name}>
                              {list.list_name}
                            </option>
                          ))
                        : "لا يوجد قائمة اتصال"}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-section mb-4">
                <div className="card-header">
                  <h3 className="mb-0">سرعة الإرسال</h3>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <label htmlFor="minInterval" className="form-label">
                      الحد الأدنى للفاصل الزمني (بالثواني)
                    </label>
                    <input
                      type="number"
                      id="minInterval"
                      name="minInterval"
                      className="form-control"
                      value={formData.minInterval}
                      onChange={handleInputChange}
                      required
                      placeholder="أدخل الحد الأدنى للفاصل الزمني"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="maxInterval" className="form-label">
                      الحد الأقصى للفاصل الزمني (بالثواني)
                    </label>
                    <input
                      type="number"
                      id="maxInterval"
                      name="maxInterval"
                      className="form-control"
                      value={formData.maxInterval}
                      onChange={handleInputChange}
                      required
                      placeholder="أدخل الحد الأقصى للفاصل الزمني"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section mb-4">
                <div className="card-header">
                  <h3 className="mb-0">تاريخ الحملة</h3>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">
                      تاريخ بدء الحملة (التاريخ)
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      className="form-control"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="startTime" className="form-label">
                      وقت بدء الحملة
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      className="form-control"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">
                      إيقاف الحملة قبل التاريخ
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className="form-control"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="endTime" className="form-label">
                      وقت إيقاف الحملة
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      className="form-control"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section mb-4">
            <div className="card-header">
              <h3 className="mb-0">نوع الرسالة</h3>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label htmlFor="messageType" className="form-label">
                  اختر نوع الرسالة
                </label>
                <div className="d-flex flex-column align-items-start">
                  <span className="mb-2">
                    يمكنك استخدام المتغيرات بإدراجها بين قوسين هكذا: "Param1"
                  </span>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="messageTypeDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      إضافة رسالة
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="messageTypeDropdown"
                    >
                      {[
                        "رسالة نصية",
                        "رسالة نصية برابط",
                        "صورة",
                        "صورة بنص كبير",
                        "فيديو",
                        "فيديو بنص كبير",
                        "ملف",
                      ].map((type, index) => (
                        <li key={index}>
                          <button
                            className="dropdown-item"
                            type="button"
                            onClick={() => addMessageInput(type)}
                          >
                            {type}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {messages.map((message, index) => (
                <div key={index} className="form-section mb-3">
                  <div className="card-header">
                    <h5 className="mb-0 p-4">{message.messageType}</h5>
                  </div>
                  <div className="card-body p-4">
                    {renderMessageInput(message, index)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            إنشاء
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default GroupMessagingForm;
