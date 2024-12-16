import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { CircularProgressBar } from "react-percentage-bar";
import "./dashboard.scss";
import { getUserData } from "../../services/profileService";

// Circular progress bar component with percentage and label
const CircularProgressBarWithLabel = ({ value, label, size, raduis }) => {
  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <div style={{ alignItems: "center" }}>
        {/* PercentageCircle from react-percentage-bar */}
        <CircularProgressBar
          percentage={value}
          size={size}
          percentageStyle={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#fff",
            filter: "drop-shadow(0 0 0.2rem  #fff)",
          }}
          trackColor="#1D1439"
          color="#eee"
          radius={raduis}
          shadow={true}
          outerShadowStyle={{
            boxShadow: "0 0 5px 5px #827B9F", // Changed to create a border-like effect
          }}
          text={label}
          textStyle={{
            marginTop: "10px",
            fontSize: "14px",
            color: "#fff",
            filter: "drop-shadow(0 0 0.2rem  #fff)",
          }}
        />
      </div>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getUserData();
        setUserData(data.plan);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, []);

  // Ensure userData is defined before calculating percentages
  const dailyMessageUsagePercentage = userData
    ? (userData.yourFreeMessagesCountInDay / userData.daily_message_limit) * 100
    : 0;

  const monthlyMessageUsagePercentage = userData
    ? (userData.yourFreeMessagesCountInMonth / userData.monthly_message_limit) *
      100
    : 0;

  const remainingBudgetPercentage = userData
    ? ((userData.monthly_message_limit -
        userData.yourFreeMessagesCountInMonth) /
        userData.monthly_message_limit) *
      100
    : 0;

  return (
    <Layout>
      <div className="container mt-5">
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "end",
            marginTop: "50px",
          }}
          className="bar-wrapper"
        >
          <div className="row">
            {/* Three Circular Progress Bars */}
            <div className="col">
              <CircularProgressBarWithLabel
                value={remainingBudgetPercentage.toFixed(2)}
                label="الميزانية المتبقية لديك"
                size={"0.5rem"}
                raduis={"6rem"}
              />
            </div>
            <div className="col">
              <CircularProgressBarWithLabel
                value={monthlyMessageUsagePercentage.toFixed(2)}
                label="استهلاك الرسائل هذا الشهر"
                size={"0.7rem"}
                raduis={"8rem"}
              />
            </div>
            <div className="col">
              <CircularProgressBarWithLabel
                value={dailyMessageUsagePercentage.toFixed(2)}
                label="استهلاك الرسائل اليوم"
                size={"0.5rem"}
                raduis={"6rem"}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
