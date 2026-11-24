import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { AdminLayout } from "./AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "./Login";
import Dashboard from "./Dashboard";
import Appointments from "./Appointments";
import Messages from "./Messages";
import Newsletter from "./Newsletter";
import { ResourceManager } from "./ResourceManager";
import { doctorResource, galleryResource, postResource, serviceResource } from "./resources";

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="doctors" element={<ResourceManager config={doctorResource} />} />
          <Route path="services" element={<ResourceManager config={serviceResource} />} />
          <Route path="posts" element={<ResourceManager config={postResource} />} />
          <Route path="gallery" element={<ResourceManager config={galleryResource} />} />
          <Route path="messages" element={<Messages />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
