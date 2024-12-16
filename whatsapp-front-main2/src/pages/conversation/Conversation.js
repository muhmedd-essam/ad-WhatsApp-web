import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import {
  getConversation,
  storeMessage,
  receiveMessage,
} from "../../services/messageService";
import { showConversation } from "../../services/conversationService";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllFilesAsync,
  selectAllFiles,
} from "../../store/reducers/filesSlice";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Conversation.scss";
import Send from "../../assets/send.svg";
import { Socket } from "socket.io-client";

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [conversationData, setConversationData] = useState({
    id: "",
    phone_sender: "",
    phone: "",
    user_id: null,
    receiver_name: "",
    employee_id: null,
  });
  const [messageType, setMessageType] = useState("رسالة نصية");
  const [currentMessage, setCurrentMessage] = useState({
    content: "",
    url: "",
    file: "",
    messageType: "رسالة نصية",
  });

  const { id: conId } = useParams();
  const [loading, setLoading] = useState(true);
  const[run,setrun]=useState(0)
  const dispatch = useDispatch();
  const chatContainerRef = useRef(null);
  const files = useSelector(selectAllFiles);
  let socket = new Socket("http://localhost:4000/");
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    dispatch(getAllFilesAsync());
  }, [dispatch]);
  useEffect(() => {
    const interval = setInterval(() => {
      setrun((prev) => prev + 1); // Increment the `run` state every 10 seconds
    }, 3000);
  
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only once
  
  // Fetch conversation and messages
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const conversation = await getConversation(conId);
        setConversationData({
          id: conversation.id,
          phone_sender: conversation.phone_sender,
          phone: conversation.phone,
          user_id: conversation.user_id,
          receiver_name: conversation.name,
          employee_id: conversation.employee_id,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
        setLoading(false);
      }
    };

    const fetchMessages = async () => {
      try {
        const { messages } = await showConversation(conId);
        const filteredMessages = messages.filter(
          (msg) => msg.conversation_id === +conId
        );
        setMessages(filteredMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchConversation();
    fetchMessages();
  }, [run]);

  // Handle new message from socket
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const theNewMessage = newMessage.message;

      const formattedMessage = {
        sender_number: theNewMessage.from,
        receive_number: theNewMessage.to,
        body: theNewMessage.body || "...",
        type_message: theNewMessage.mediaUrl ? "Media" : "Text",
        file: theNewMessage.mediaUrl || "",
        id: theNewMessage.messageId,
      };

      const receivedConIdParts = theNewMessage.messageId.split("_");
      const receivedPhoneNumber = receivedConIdParts[1].replace("@c.us", "");

      receiveMessage(formattedMessage);

      setMessages((prevMessages) => {
        if (
          conversationData.phone === receivedPhoneNumber ||
          conversationData.phone_sender === receivedPhoneNumber
        ) {
          return [...prevMessages, formattedMessage];
        }
        return prevMessages;
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, conversationData]);

  const filterMediaByType = (mediaArray) => {
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

    return { images, videos, files };
  };

  const handleMessageChange = (field, value) => {
    setCurrentMessage((prev) => ({ ...prev, [field]: value }));
  };

  const renderMessageInput = () => {
    switch (messageType) {
      case "رسالة نصية":
      case "رسالة نصية برابط":
        return (
          <>
            <textarea
              className="form-control mb-2"
              value={currentMessage.content}
              onChange={(e) => handleMessageChange("content", e.target.value)}
              placeholder={`اكتب محتوى ${messageType} هنا...`}
              required
            />
            {messageType === "رسالة نصية برابط" && (
              <input
                type="url"
                className="form-control mb-2"
                placeholder="أدخل الرابط هنا"
                value={currentMessage.url}
                onChange={(e) => handleMessageChange("url", e.target.value)}
                required
              />
            )}
          </>
        );
      case "صورة":
      case "صورة بنص كبير":
        return (
          <>
            <div className="form-group">
            <input type="file" onChange={(e) => handleMessageChange("file", e.target.value)} className="form-control"></input>
            </div>
            <textarea
              className="form-control mb-2"
              value={currentMessage.content}
              onChange={(e) => handleMessageChange("content", e.target.files[0])}
              placeholder="أدخل النص المصاحب للصورة هنا..."
              required
            />
          </>
        );
      case "فيديو":
      case "فيديو بنص كبير":
        return (
          <>
         
         <div className="form-group">
            <input
              type="file"
              className="form-control mb-2"
              accept="video/*"
              onChange={(e) =>
                handleMessageChange("file", e.target.files[0])
              }
              required
            /></div>
            <textarea
              className="form-control mb-2"
              value={currentMessage.content}
              onChange={(e) => handleMessageChange("content", e.target.value)}
              placeholder="أدخل النص المصاحب للفيديو هنا..."
              required
            />
          </>
        );
      case "ملف":
        return (
          <>
          <div className="form-group">
            <input type="file" className="form-control"></input>
          </div>
          <textarea
            className="form-control mb-2"
            value={currentMessage.content}
            onChange={(e) => handleMessageChange("content", e.target.value)}
            placeholder="أدخل النص المصاحب للملف هنا..."
            required
          />
        </>
        );
      default:
        return null;
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.content && !currentMessage.file) return;

    if (
      !conversationData.id ||
      !conversationData.phone_sender ||
      !conversationData.phone
    ) {
      console.error("Conversation data is not ready yet:", conversationData);
      return;
    }

    try {
      setIsUploading(true);
      let mediaUrl = null;

      if (currentMessage.file) {
        const selectedFile = files.find(
          (f) => f.id === parseInt(currentMessage.file)
        );
        if (selectedFile) {
          mediaUrl = selectedFile.path;
        }
      }

      const response = await axios.post("http://localhost:4000/send-message", {
        number: `${conversationData.phone}`,
        message: currentMessage.content || "",
        userId: conversationData.user_id,
        mediaFilePath: mediaUrl
          ? `https://whats.wolfchat.online/public/storage/${mediaUrl}`
          : "",
        url: currentMessage.url,
        messageType: messageType,
      });

      if (response.data.success) {
        const newMessageSent = {
          conversation_id: conversationData.id,
          sender_number: conversationData.phone_sender,
          receive_number: conversationData.phone,
          body: currentMessage.content || "",
          user_id: conversationData.user_id,
          employee_id: conversationData.employee_id,
          receiver_name: conversationData.receiver_name,
          type: "sent",
          type_message: mediaUrl ? "Media" : "Text",
          media_url: mediaUrl,
          url: currentMessage.url,
        };

        await storeMessage(newMessageSent);
        setMessages((prevMessages) => [...prevMessages, newMessageSent]);
        setCurrentMessage({
          content: "",
          url: "",
          file: "",
          messageType: "رسالة نصية",
        });
        setMessageType("رسالة نصية");
      }
    } catch (error) {
      console.error("Error sending or storing message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const renderMessage = (message) => {
    const isMedia = message.type_message === "Media";
    return (
      <div
        className={`mb-3 ${
          message.type === "sent" ? "text-end" : "text-start"
        }`}
      >
        <span
          className={`badge fs-3 ${
            message.type === "sent" ? "bg-success" : "bg-primary"
          }`}
        >
          {isMedia ? (
            <div className="media-message">
              {message.media_url && (
                <div className="media-preview">
                  {message.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={`https://whats.wolfchat.online/public/storage/${message.media_url}`}
                      alt="media"
                      className="media-thumbnail w-100"
                    />
                  ) : message.media_url.match(/\.(mp4|webm)$/i) ? (
                    <video controls className="media-thumbnail w-100">
                      <source
                        src={`https://whats.wolfchat.online/public/storage/${message.media_url}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <a
                      href={`https://whats.wolfchat.online/public/storage/${message.media_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      📎 Document
                    </a>
                  )}
                </div>
              )}
              {message.body && (
                <div className="media-caption">{message.body}</div>
              )}
            </div>
          ) : (
            message.body
          )}
        </span>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container-fluid d-flex flex-column vh-100">
        <div className="row flex-grow-1 overflow-auto">
          <div className="col-md-8 mx-auto">
            <div
              className="chat-messages p-4 d-flex flex-column"
              ref={chatContainerRef}
              style={{ height: "100%", overflowY: "auto" }}
            >
              {messages.map((message, index) => renderMessage(message, index))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="chat-group">
              <select
                className="form-select mb-4"
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
              >
                <option value="رسالة نصية">رسالة نصية</option>
                <option value="رسالة نصية برابط">رسالة نصية برابط</option>
                <option value="صورة">صورة</option>
                <option value="صورة بنص كبير">صورة بنص كبير</option>
                <option value="فيديو">فيديو</option>
                <option value="فيديو بنص كبير">فيديو بنص كبير</option>
                <option value="ملف">ملف</option>
              </select>

              {messageType === "رسالة نصية برابط" ? (
                <div className="url-input-wrapper">{renderMessageInput()}</div>
              ) : messageType.includes("صورة") ||
                messageType.includes("فيديو") ||
                messageType === "ملف" ? (
                <div className="media-select-wrapper">
                  {renderMessageInput()}
                </div>
              ) : (
                renderMessageInput()
              )}

              <button
                className="btn btn-send mx-auto mt-3"
                type="button"
                onClick={handleSendMessage}
                disabled={isUploading}
              >
                <img src={Send} alt="send" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Conversation;
