import React from "react";

const MessageTypeForm = ({ messageType, handleInputChange, formData }) => {
  return (
    <>
      {messageType === "رسالة نصية" && (
        <div className="mb-3 p-3">
          <label htmlFor="textMessage" className="form-label">
            نص الرسالة
          </label>
          <textarea
            id="textMessage"
            name="textMessage"
            className="form-control"
            value={formData.textMessage || ""}
            onChange={handleInputChange}
            placeholder="أدخل نص الرسالة"
            required
          />
        </div>
      )}

      {messageType === "رسالة نصية برابط" && (
        <>
          <div className="mb-3 p-3">
            <label htmlFor="textMessage" className="form-label">
              نص الرسالة
            </label>
            <textarea
              id="textMessage"
              name="textMessage"
              className="form-control"
              value={formData.textMessage || ""}
              onChange={handleInputChange}
              placeholder="أدخل نص الرسالة"
              required
            />
          </div>
          <div className="mb-3 p-3">
            <label htmlFor="link" className="form-label">
              الرابط
            </label>
            <input
              type="url"
              id="link"
              name="link"
              className="form-control"
              value={formData.link || ""}
              onChange={handleInputChange}
              placeholder="أدخل الرابط"
              required
            />
          </div>
        </>
      )}

      {messageType === "صورة" && (
        <div className="mb-3 p-3">
          <label htmlFor="image" className="form-label">
            تحميل صورة
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleInputChange}
            required
          />
        </div>
      )}

      {messageType === "صورة بنص كبير" && (
        <>
          <div className="mb-3 p-3">
            <label htmlFor="image" className="form-label">
              تحميل صورة
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 p-3">
            <label htmlFor="bigText" className="form-label">
              نص كبير
            </label>
            <textarea
              id="bigText"
              name="bigText"
              className="form-control"
              value={formData.bigText || ""}
              onChange={handleInputChange}
              placeholder="أدخل نص كبير"
              required
            />
          </div>
        </>
      )}

      {messageType === "فيديو" && (
        <div className="mb-3 p-3">
          <label htmlFor="video" className="form-label">
            تحميل فيديو
          </label>
          <input
            type="file"
            id="video"
            name="video"
            className="form-control"
            accept="video/*"
            onChange={handleInputChange}
            required
          />
        </div>
      )}

      {messageType === "فيديو بنص كبير" && (
        <>
          <div className="mb-3 p-3">
            <label htmlFor="video" className="form-label">
              تحميل فيديو
            </label>
            <input
              type="file"
              id="video"
              name="video"
              className="form-control"
              accept="video/*"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 p-3">
            <label htmlFor="bigText" className="form-label">
              نص كبير
            </label>
            <textarea
              id="bigText"
              name="bigText"
              className="form-control"
              value={formData.bigText || ""}
              onChange={handleInputChange}
              placeholder="أدخل نص كبير"
              required
            />
          </div>
        </>
      )}

      {messageType === "ملف" && (
        <div className="mb-3 p-3">
          <label htmlFor="file" className="form-label">
            تحميل ملف
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="form-control"
            accept=".pdf,.doc,.docx"
            onChange={handleInputChange}
            required
          />
        </div>
      )}
    </>
  );
};

export default MessageTypeForm;
