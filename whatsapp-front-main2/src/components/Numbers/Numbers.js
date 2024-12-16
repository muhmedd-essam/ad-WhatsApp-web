import React from "react";
import { ReactComponent as Robot } from "../../assets/robot.svg";
import { ReactComponent as Speaker } from "../../assets/speaker.svg";
import { ReactComponent as Messages } from "../../assets/messages.svg";
import { ReactComponent as Chat } from "../../assets/chat.svg";
import CountUp from "react-countup";
import NewSection from "../NewSection/NewSection";
import "./Numbers.scss"; // Assuming you have a related SCSS file for custom styles

const Numbers = () => {
  return (
    <section className="numbers-section margin-big">
      <div className="container">
        <div className="row mb-4 text-center">
          <div className="col-12">
            <h2 className="text-white fs-3">ثقة عملائنا هي الأهم</h2>
          </div>
        </div>
      </div>
      <div className="container text-center">
        <div className="numbers-section__content p-5">
          <div className="row gap-5 justify-content-center">
            {/* Column 1: Customers */}
            <div className="col-md-3 col-sm-6 mb-4 cercle-bg">
              <div className="cyrcle">
                <Robot />

                <h3>
                  <CountUp end={259} />
                </h3>
                <p> روبوت ذكي</p>
              </div>
            </div>
            {/* Column 2: Messages */}
            <div className="col-md-3 col-sm-6 mb-4 cercle-bg">
              <div className="cyrcle">
                <Speaker />
                <h3>
                  <CountUp end={1270} />
                </h3>
                <p> حملة</p>
              </div>
            </div>
            {/* Column 3: Robots */}
            <div className="col-md-3 col-sm-6 mb-4 cercle-bg">
              <div className="cyrcle">
                <Messages />
                <h3>
                  <CountUp end={23496} />
                </h3>
                <p> رسالة</p>
              </div>
            </div>
            {/* Column 4: Campaigns */}
            <div className="col-md-3 col-sm-6 mb-4 cercle-bg">
              <div className="cyrcle">
                <Chat />
                <h3>
                  <CountUp end={724} />
                </h3>
                <p> دردشة</p>
              </div>
            </div>
          </div>

          <NewSection />
        </div>
      </div>
    </section>
  );
};

export default Numbers;
