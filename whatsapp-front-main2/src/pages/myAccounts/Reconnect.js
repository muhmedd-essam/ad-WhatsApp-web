import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccountStatus,
  selectAccountError,
} from "../../store/reducers/accountSlice";
import { getUserData } from "../../services/profileService";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Scan } from "../../assets/scan.svg";

const Reconnect = () => {
  const [qrCode, setQrCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accountStatus = useSelector(selectAccountStatus);
  const accountError = useSelector(selectAccountError);

  // Fetch user ID on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await getUserData();
        setUserId(userData.data.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };
    fetchUserId();
  }, []);

  // Function to fetch QR code
  const fetchQRCode = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/get-qr/${userId}`
      );
      if (response.data.success) {
        setQrCode(response.data.qrCode);
        setError(null);
      } else {
        setError("Failed to generate QR code");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
      setError(error.response?.data?.error || "Failed to fetch QR code");
      // Retry after 5 seconds if there's an error
      setTimeout(() => fetchQRCode(userId), 5000);
    }
  };

  // Start QR code polling when userId is available
  useEffect(() => {
    if (userId) {
      fetchQRCode(userId);
      // Poll for new QR code every 20 seconds
      const qrInterval = setInterval(() => fetchQRCode(userId), 20000);
      return () => clearInterval(qrInterval);
    }
  }, [userId]);

  // Check connection status
  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:4000/connection-status/${userId}`
        );

        switch (response.data.status) {
          case "connected":
            setIsConnected(true);
            // Fetch phone number if connected
            try {
              const numberResponse = await axios.get(
                `http://localhost:4000/get-number/${userId}`
              );
              if (numberResponse.data.userNumber) {
                setPhoneNumber(numberResponse.data.userNumber);
              }
            } catch (error) {
              console.error("Error fetching phone number:", error);
            }
            break;

          case "initializing":
          case "connecting":
            setIsConnected(false);
            setError(null); // Clear any previous errors
            break;

          case "disconnected":
            setIsConnected(false);
            break;

          default:
            setIsConnected(false);
            setError("Unknown connection status");
        }
      } catch (error) {
        console.error("Error checking connection status:", error);
        setIsConnected(false);
        setError(error.response?.data?.message || "Connection check failed");
      }
    };

    if (userId) {
      checkConnectionStatus();
      const statusInterval = setInterval(checkConnectionStatus, 5000);
      return () => clearInterval(statusInterval);
    }
  }, [userId]);

  // Handle successful connection
  useEffect(() => {
    if (isConnected && phoneNumber && userId) {
      navigate("/my-accounts", {
        state: { phoneNumber: phoneNumber },
      });
    }
  }, [isConnected, phoneNumber, userId, dispatch, navigate]);

  return (
    <Layout>
      <div className="container d-flex flex-column align-items-center">
        <h1 className="mb-4">WhatsApp Account Authentication</h1>

        {/* Error Messages */}
        {(accountError || error) && (
          <div className="alert alert-danger" role="alert">
            {accountError || error}
          </div>
        )}

        {/* Loading Spinner */}
        {accountStatus === "loading" && (
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* QR Code Display */}
        <div className="qr-code-container text-center">
          {qrCode ? (
            <div className="relative inline-block">
              <img src={qrCode} alt="QR Code" className="w-[200px] h-[200px]" />
            </div>
          ) : (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading QR Code...</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-5 text-center">
          <Scan className="w-16 h-16 mx-auto" />
          <h2 className="mt-3 text-xl">
            Open WhatsApp on your phone and scan the QR code
          </h2>
        </div>
      </div>
    </Layout>
  );
};

export default Reconnect;
