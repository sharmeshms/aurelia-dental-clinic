import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import ServicesPage from "@/pages/Services";
import ServiceDetailPage from "@/pages/ServiceDetail";
import DoctorsPage from "@/pages/Doctors";
import DoctorDetailPage from "@/pages/DoctorDetail";
import AppointmentPage from "@/pages/Appointment";
import PatientInformationPage from "@/pages/PatientInformation";
import GalleryPage from "@/pages/Gallery";
import TestimonialsPage from "@/pages/Testimonials";
import BlogPage from "@/pages/Blog";
import BlogPostPage from "@/pages/BlogPost";
import ContactPage from "@/pages/Contact";
import FaqPage from "@/pages/Faq";
import SearchPage from "@/pages/Search";
import LegalPage from "@/pages/Legal";
import NotFoundPage from "@/pages/NotFound";
import { FullPageLoader } from "@/components/ui/Loader";

const AdminApp = lazy(() => import("@/admin/AdminApp"));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="doctors/:slug" element={<DoctorDetailPage />} />
          <Route path="appointment" element={<AppointmentPage />} />
          <Route path="patient-information" element={<PatientInformationPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="privacy-policy" element={<LegalPage type="privacy" />} />
          <Route path="terms" element={<LegalPage type="terms" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route
          path="admin/*"
          element={
            <Suspense fallback={<FullPageLoader label="Loading workspace" />}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
