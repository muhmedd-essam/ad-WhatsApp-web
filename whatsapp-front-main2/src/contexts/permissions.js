import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const navigate = useNavigate();
  const [permission, setPermission] = useState(null);

  // حفظ الصلاحيات في localStorage
  const savePermissions = (permissions) => {
    if (permissions) {
      setPermission(permissions);
      localStorage.setItem("permissions", JSON.stringify(permissions)); // تخزين الصلاحيات في localStorage
      navigate("/dashboard"); // توجيه للمستخدم إلى لوحة التحكم بعد حفظ الصلاحيات
    } else {
      setPermission(null);
      localStorage.removeItem("permissions"); // إزالة الصلاحيات من localStorage
      navigate("/employeeLogin"); // توجيه للصفحة الخاصة بتسجيل الدخول إذا لم تكن هناك صلاحيات
    }
  };

  // قراءة الصلاحيات من localStorage عند تحميل التطبيق
  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    if (storedPermissions) {
      setPermission(JSON.parse(storedPermissions)); // تحويل الصلاحيات من JSON إلى كائن JS
    }
  }, []);

  return (
    <PermissionsContext.Provider value={{ permission, savePermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};
