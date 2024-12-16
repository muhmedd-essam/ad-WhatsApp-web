import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { selectAccounts } from "../../store/reducers/accountSlice";
import { useSelector } from "react-redux";
import { createBoot,getBootData } from "../../services/bootservice";
import { useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import"./createRobot.scss"
const TreeBuilder = () => {
  const accounts = useSelector(selectAccounts);
  console.log(accounts);
  useEffect(()=>{
    getBootData()
  },[])
  const [botData, setBotData] = useState({
    name: "My Smart Bot",
    user_id: `${accounts.id}`,
    whatsapp_number: `${accounts.numbers[0].phone_number}`,
    status: "off",
    keyword: "start",
    custom_navigation_message: "Welcome to my bot!",
    tree: {
      root: {
        type: "buttons",
        buttons: [
          { name: "قسم 1", next: "section1" },
          { name: "قسم 2", next: "section2" },
        ],
      },
      section1: {
        type: "list",
        sections: [
          {
            name: "خيارات 1",
            options: [
              { name: "اختيار 1", next: "result1" },
              { name: "اختيار 2", next: "result2" },
            ],
          },
        ],
      },
      result1: {
        type: "result",
        messages: ["هذا هو النتيجة الأولى", "رسالة إضافية"],
      },
    },
  });

  const [currentNode, setCurrentNode] = useState("root");
  const [selectedNode, setSelectedNode] = useState("");
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeType, setNewNodeType] = useState("buttons");
  const [newActionName, setNewActionName] = useState("");
  const [newActionNext, setNewActionNext] = useState("");

  const handleBotDataChange = (field, value) => {
    setBotData((prev) => ({ ...prev, [field]: value }));
  };

  const addNode = () => {
    if (!newNodeName) return toast.error("أدخل اسم العقدة الجديدة");

    const updatedTree = { ...botData.tree };

    if (updatedTree[newNodeName]) {
      return toast.error("العقدة موجودة بالفعل! اختر اسمًا جديدًا.");
    }

    updatedTree[newNodeName] =
      newNodeType === "buttons"
        ? { type: "buttons", buttons: [] }
        : newNodeType === "list"
        ? { type: "list", sections: [] }
        : { type: "result", messages: [] };

    if (updatedTree[currentNode].type === "buttons") {
      updatedTree[currentNode].buttons.push({ name: newActionName || `زر ${newNodeName}`, next: newNodeName });
    } else if (updatedTree[currentNode].type === "list") {
      updatedTree[currentNode].sections.push({
        name: `قسم ${newNodeName}`,
        options: [{ name: newActionName || `خيار ${newNodeName}`, next: newNodeName }],
      });
    }

    setBotData((prev) => ({ ...prev, tree: updatedTree }));
    setNewNodeName("");
    setNewNodeType("buttons");
    setNewActionName("");
    toast.success("تمت إضافة العقدة بنجاح!");
  };

  const addOptionToNode = () => {
    if (!newActionName || !newActionNext) return alert("أدخل بيانات الإجراء بالكامل");

    const updatedTree = { ...botData.tree };
    if (updatedTree[selectedNode]?.type === "buttons") {
      updatedTree[selectedNode].buttons.push({ name: newActionName, next: newActionNext });
    } else if (updatedTree[selectedNode]?.type === "list") {
      if (!updatedTree[selectedNode].sections.length) {
        updatedTree[selectedNode].sections.push({ name: `قسم ${selectedNode}`, options: [] });
      }
      updatedTree[selectedNode].sections[0].options.push({ name: newActionName, next: newActionNext });
    } else {
      return toast.error("لا يمكن تعديل هذا النوع من العقد.");
    }

    setBotData((prev) => ({ ...prev, tree: updatedTree }));
    setNewActionName("");
    setNewActionNext("");
    toast.success("تمت إضافة الإجراء!");
  };

  return (
   <Layout>
     <div className="container mt-4">
      <h1 className="">منشئ شجرة الردود</h1>
        <h3 className="form-header col-md-6 m-0">بيانات البوت</h3>
        <div className="col-md-6 form-layout">
           {/* تعديل البيانات العامة */}
      <div className="mb-4 ">
        <div className="mb-2">
          <h3>اسم البوت:</h3>
          <input
            type="text"
            className="form-control"
            value={botData.name}
            onChange={(e) => handleBotDataChange("name", e.target.value)}
          />
        </div>
        {/* <div className="mb-2">
          <h3>رقم الواتساب:</h3>
          <input
            type="text"
            className="form-control"
            value={botData.whatsapp_number}
            onChange={(e) => handleBotDataChange("whatsapp_number", e.target.value)}
          />
        </div> */}
        <div className="mb-2">
          <h3>حالة البوت:</h3>
          <select
            className="form-select"
            value={botData.status}
            onChange={(e) => handleBotDataChange("status", e.target.value)}
          >
            <option value="on">مفعل</option>
            <option value="off">غير مفعل</option>
          </select>
        </div>
      </div>

      {/* اختيار عقدة للتعديل */}
      <div className="mb-4">
        <h3>اختيار عقدة للتعديل</h3>
        <select
          className="form-select"
          value={selectedNode}
          onChange={(e) => setSelectedNode(e.target.value)}
        >
          <option value="">اختر عقدة</option>
          {Object.keys(botData.tree).map((node) => (
            <option key={node} value={node}>
              {node}
            </option>
          ))}
        </select>
      </div>

      {/* إضافة إجراء جديد إلى العقدة المحددة */}
      {selectedNode && (
        <div>
          <h3 className="mt-4">إضافة إجراء جديد إلى {selectedNode}</h3>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="اسم الإجراء"
            value={newActionName}
            onChange={(e) => setNewActionName(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="العقدة المرتبطة"
            value={newActionNext}
            onChange={(e) => setNewActionNext(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addOptionToNode}>
            إضافة الإجراء
          </button>
        </div>
      )}

      {/* إضافة عقدة جديدة */}
      <div>
        <h3 className="mt-4">إضافة عقدة جديدة</h3>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="اسم العقدة الجديدة"
          value={newNodeName}
          onChange={(e) => setNewNodeName(e.target.value)}
        />
        <select
          className="form-select mb-3"
          value={newNodeType}
          onChange={(e) => setNewNodeType(e.target.value)}
        >
          <option value="buttons">أزرار</option>
          <option value="list">قائمة</option>
          <option value="result">نتيجة</option>
        </select>
        <button className="btn btn-primary" onClick={addNode}>
          إضافة عقدة
        </button>
      </div>
      <button
          className="btn btn-success"
          onClick={()=>createBoot(botData)}
        >
          send
        </button>
      
        </div>
     
    </div>
   </Layout>
  );
};

export default TreeBuilder;

