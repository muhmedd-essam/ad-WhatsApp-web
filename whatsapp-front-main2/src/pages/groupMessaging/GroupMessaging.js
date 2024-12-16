import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as GroupChat } from "../../assets/microphone.svg";
import { getAllCampains } from "../../services/campainService";

const GroupMessaging = () => {
  const [campaigns, setCampaigns] = useState([]); // Corrected spelling: campaigns
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await getAllCampains();
        console.log(response);

        setCampaigns(response.data); // Assume response.data contains the campaigns
        setError(null); // Clear error if fetching is successful
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("حدث خطأ أثناء تحميل الحملات."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <Layout>
      <div className="container mt-4 contacts-section">
        <div className="row">
          <div className="col-md-12">
            <h2>المراسلة الجماعية</h2>
            <p>هنا الرسائل الجماعية التي يتم إرسالها آلياً</p>
          </div>
        </div>
        <div className="mb-3">
          <Link
            to="/group-messaging/create"
            className="btn contact d-inline-block"
          >
            <GroupChat />
            <p>أنشاء قوائم اتصال جديدة</p>
          </Link>
        </div>
        {loading && <p>جاري تحميل الحملات...</p>} {/* Loading message */}
        {error && <p className="text-danger">{error}</p>} {/* Error message */}
        {campaigns.length > 0 ? (
          <div>
            <h3>الحملات المتاحة:</h3>
            <ul className="list-group mt-3">
              {campaigns.map((campaign) => (
                <li
                  key={campaign.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <span>{campaign.name}</span>
                  <span>{campaign.start_date}</span>
                  <span>{campaign.start_time}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !loading && <p>لا توجد حملات متاحة.</p> // Message if no campaigns are available
        )}
      </div>
    </Layout>
  );
};

export default GroupMessaging;
