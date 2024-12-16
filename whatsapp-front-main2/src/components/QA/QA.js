import React, { useState } from "react";
import "./QA.scss";
const faqs = [
  {
    question: "هل أستطيع إعداد الروبوت بخيارات تحول المحادثات لموظفين لدي؟",
    answer:
      "نعم يمكنك ذلك، بعد إضافة موظفيك في المنصة يمكنهم الرد على المحادثات المحددة لهم، كما أنه يمكنك متابعة ذلك.",
  },
  {
    question: "هل يمكن المراسلة مع شخص واحد من خلال المنصة؟",
    answer: "نعم، يمكنك مراسلة أي شخص بشكل فردي عبر المنصة.",
  },
  {
    question: "هل أستطيع ارسال رسائل جماعية لآلاف العملاء؟",
    answer:
      "نعم، يمكنك إرسال رسائل جماعية لعدد كبير من العملاء باستخدام المنصة.",
  },
  {
    question: "ما هي وسائل الدفع المتاحة ؟",
    answer:
      "المنصة تدعم العديد من وسائل الدفع مثل بطاقات الائتمان والتحويلات البنكية.",
  },
  {
    question: "هل يمكن ان ارسل صور او فيديو أو ملف ؟",
    answer: "نعم، يمكنك إرسال صور وفيديوهات وملفات عبر المنصة بسهولة.",
  },
  {
    question: "ماهي مميزات التجربة المجانية ؟",
    answer:
      "تتيح لك التجربة المجانية إمكانية تجربة جميع الميزات الأساسية للمنصة لمدة محددة.",
  },
];

const AccordionItem = ({ question, answer, isOpen, onToggle, index }) => {
  return (
    <div className="accordion-item  border-0">
      <h2 className="accordion-header" id={`heading${index}`}>
        <button
          className={`accordion-button ${
            isOpen ? "" : "collapsed"
          } justify-content-between`}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`collapse${index}`}
        >
          <span className="mr-auto">{question}</span>
        </button>
      </h2>
      <div
        id={`collapse${index}`}
        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
        aria-labelledby={`heading${index}`}
      >
        <div className="accordion-body text-end">{answer}</div>
      </div>
    </div>
  );
};

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container my-5">
        <div className="row">
          <div className="col-md-12 text-center">
            <h2 className="fw-bold my-5">الأسئلة الشائعة</h2>
          </div>
        </div>
        <div className="accordion rounded " id="faqAccordion">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default FAQAccordion;
