import { Navigate } from "react-router-dom";

function PrivateRoute({ children, requiredPermission }) {
  const isAuthenticated = !!localStorage.getItem("token");

  // استرجاع الصلاحيات من localStorage
  const permissions = JSON.parse(localStorage.getItem("permissions") || '{}');

  // تحقق مما إذا كانت الصلاحية المطلوبة موجودة في localStorage
  const hasRequiredPermission = requiredPermission ? permissions[requiredPermission] : true;

  // إذا كان المستخدم موثوقًا وله الصلاحية المطلوبة، يسمح بالوصول
  if (isAuthenticated && hasRequiredPermission !== false) {
    return children;
  }

  // إذا لم تتوافر الصلاحية المطلوبة أو المستخدم غير موثوق، يتم إعادة توجيه المستخدم إلى الصفحة الرئيسية أو صفحة أخرى
  return <Navigate to="/not-authorized" />;
}

export default PrivateRoute;
