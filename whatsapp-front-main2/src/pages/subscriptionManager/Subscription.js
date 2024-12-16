import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { getUserData } from "../../services/profileService";
import { toast } from "react-toastify"; // Import toast for notifications
import { format, parseISO } from "date-fns"; // Import date-fns functions for formatting and date manipulation
import "./subscription.scss";

const Subscription = () => {
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state

      try {
        const result = await getUserData(); // Fetch user data

        // Check if status is true and handle success
        if (result.status === true) {
          setUserPlan(result.data); // Set user plan
        } else {
          // Handle any response that doesn't meet the success condition
          throw new Error(result.message || "Failed to fetch user data.");
        }
      } catch (err) {
        setError(err.message);
        toast.error(`حدث خطأ: ${err.message}`); // Error toast
      } finally {
        setLoading(false); // Stop loading after completion
      }
    };

    fetchUserData(); // Fetch data on component mount
  }, []);

  // Function to format dates and calculate end date
  const formatDateTime = (dateString) =>
    format(parseISO(dateString), "yyyy-MM-dd");

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <h2>مدير الاشتراكات</h2>
            <p>ستجد هنا تفاصيل اشتراكاتك</p>

            {/* Display loading state */}
            {loading && <p>جاري تحميل بيانات الاشتراك...</p>}

            {/* Display error message if any */}
            {error && <p className="text-danger">{error}</p>}

            {/* Display user subscription plan */}
            {!loading && !error && userPlan && (
              <div className="subscription-details">
                <h3 className="subscription-title">
                  خطة الاشتراك: {userPlan.plan.name}
                </h3>

                <div className="row p-3">
                  <div className="col-md-12">
                    <h2>الحالية</h2>
                  </div>

                  <div className="d-flex justify-content-between ">
                    <p>
                      من:
                      {formatDateTime(userPlan.plan_time_starts)}
                    </p>

                    <p>الي: {formatDateTime(userPlan.plan_time_ends)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Show message if there's no user plan */}
            {!loading && !error && !userPlan && (
              <p>ليس لديك خطة اشتراك حالياً.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
