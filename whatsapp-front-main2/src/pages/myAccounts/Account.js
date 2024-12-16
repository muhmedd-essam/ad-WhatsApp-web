import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccountsAsync,
  selectAccounts,
  selectAccountStatus,
  selectAccountError,
} from "../../store/reducers/accountSlice";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Conect } from "../../assets/model.svg";
import axios from "axios";
import { toast } from "react-toastify";
import "./Account.scss";
import { RefreshCcw } from "lucide-react";
import { getUserData } from "../../services/profileService";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accounts = useSelector(selectAccounts);
  const status = useSelector(selectAccountStatus);
  const errorAccount = useSelector(selectAccountError);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [userNumber, setUserNumber] = useState(null); // State to hold the user number

  // Fetch account data on component mount
  useEffect(() => {
    dispatch(fetchAccountsAsync());
  }, [dispatch]);

  // Fetch user ID
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

  // Check connection status of all accounts once the accounts are loaded
  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (!userId) return;

      try {
        // Fetch connection status for each account
        const updatedConnectionStatuses = {};
        for (const account of accounts.numbers) {
          try {
            const response = await axios.get(
              `http://localhost:4000/connection-status/${userId}`
            );

            // Assuming the response contains the status for the specific account
            const { status: connectionStatus } = response.data;

            // Set connection status for the current account
            updatedConnectionStatuses[account.phone_number] =
              connectionStatus === "connected" ? "connected" : "disconnected";
          } catch (error) {
            console.error(
              `Error checking connection status for ${account.phone_number}:`,
              error
            );
            updatedConnectionStatuses[account.phone_number] = "disconnected"; // Treat as disconnected if there's an error
          }
        }

        setConnectionStatuses(updatedConnectionStatuses);

        // If any account is connected, fetch user number
        if (Object.values(updatedConnectionStatuses).includes("connected")) {
          try {
            const numberResponse = await axios.get(
              `http://localhost:4000/get-number/${userId}`
            );
            if (numberResponse.data.success) {
              setUserNumber(numberResponse.data.userNumber); // Save user number in state
              console.log("User  Number:", numberResponse.data.userNumber);
            } else {
              console.error("Failed to fetch user number");
            }
          } catch (error) {
            console.error("Error fetching user number:", error);
          }
        }
      } catch (error) {
        console.error("Error checking connection status:", error);
        setError(error.response?.data?.message || "Connection check failed");
      }
    };

    if (status === "succeeded") {
      checkConnectionStatus();
    }
  }, [accounts, status, userId]);

  // Reconnect handler to navigate to reconnect page
  const handleReconnect = (phoneNumber) => {
    navigate("/my-accounts/reconnect", { state: { phoneNumber } });
  };

  // Add new account handler
  const handleAddAccount = () => {
    const planLimit = accounts.plan?.plan_no;
    const accountCount = accounts.numbers?.length || 0;

    if (accountCount >= planLimit) {
      toast.warning("لا يمكن ان تضيف اكثر من 1 حساب");
    } else {
      navigate("/my-accounts/connect");
    }
  };

  return (
    <Layout>
      <div className="container mt-4 account-section">
        <div className="row">
          <div className="col-md-12">
            <h2>حسابات الواتساب</h2>
            <p>يمكنك إضافة ما يصل إلى 1 حسابات وفقًا لباقتك</p>
          </div>
        </div>

        <div className="mb-3">
          <button
            onClick={handleAddAccount}
            className="btn contact account d-inline-block"
          >
            <Conect />
            <p>أضف حساب </p>
          </button>
        </div>

        <div className="mb-3">
          <h3>الاحسابات</h3>
          {status === "loading" && <p>Loading accounts...</p>}
          {status === "failed" && <p className="text-danger">Error: {error}</p>}
          {status === "succeeded" && (
            <div>
              {Array.isArray(accounts.numbers) &&
              accounts.numbers.length > 0 ? (
                accounts.numbers.map((account, index) => (
                  <div key={index} className="account-info">
                    <div className="mb-4 d-flex w-100 justify-content-between align-items-center">
                      <h3 className="m-0">{account.name}</h3>

                      {/* Display reconnect option if status is 'disconnected' */}
                      {connectionStatuses[account.phone_number] ===
                        "disconnected" && (
                        <span
                          className="reconnect-option"
                          onClick={() => handleReconnect(account.phone_number)}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ marginRight: "8px" }}>
                            اعادة ربط الرقم
                          </span>
                          <RefreshCcw
                            className="reconnect-icon"
                            style={{
                              width: "20px",
                              height: "20px",
                            }}
                          />
                        </span>
                      )}
                    </div>
                    <h3>{account.phone_number}</h3>
                    <p>
                      Status:{" "}
                      <span
                        className={
                          connectionStatuses[account.phone_number] ===
                          "connected"
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {connectionStatuses[account.phone_number] ||
                          "disconnected"}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p>No accounts available. Please add an account.</p>
              )}
              {/* Display user number if available */}
              {userNumber && (
                <div className="user-number">
                  <h3>رقم المستخدم:</h3>
                  <p>{userNumber}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Account;
