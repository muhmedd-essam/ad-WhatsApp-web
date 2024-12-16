import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Numbers from "./../../components/Numbers/Numbers";
import How from "../../components/How/How";
import Features from "../../components/Features/Features";
import Plans from "../../components/Plans/Plans";
import Partners from "../../components/Partners/Partners";
import FAQAccordion from "../../components/QA/QA";
import Footer from "../../components/Footer/Footer";
const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Numbers />
      <How />
      <Features />
      <Plans />
      <Partners />
      <FAQAccordion />
      <Footer />
    </>
  );
};

export default Home;
