import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer } from "./components/common/Toast";
import { AppSidebar } from "./components/layout/AppSidebar";
import { AuthGuard } from "./components/guards/AuthGuard";
import { RoleGuard } from "./components/guards/RoleGuard";

// Public Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Docs from "./pages/Docs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

// App Pages
import Overview from "./pages/app/Overview";
import Projects from "./pages/app/Projects";
import ProjectDetail from "./pages/app/ProjectDetail";
import Content from "./pages/app/Content";
import ContentEditor from "./pages/app/ContentEditor";
import Models from "./pages/app/Models";
import Tasks from "./pages/app/Tasks";
import Calendar from "./pages/app/Calendar";
import Insights from "./pages/app/Insights";
import Notifications from "./pages/app/Notifications";
import Users from "./pages/app/Users";
import Integrations from "./pages/app/Integrations";
import Settings from "./pages/app/Settings";
import Profile from "./pages/app/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AppLayout({ children }) {
  return (
    <AuthGuard>
      <AppSidebar>{children}</AppSidebar>
    </AuthGuard>
  );
}

function AdminLayout({ children }) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin', 'moderator']}>
        <AppSidebar>{children}</AppSidebar>
      </RoleGuard>
    </AuthGuard>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/reset" element={<ResetPassword />} />
              
              {/* App Routes (Protected) */}
              <Route path="/app/overview" element={<AppLayout><Overview /></AppLayout>} />
              <Route path="/app/projects" element={<AppLayout><Projects /></AppLayout>} />
              <Route path="/app/projects/:id" element={<AppLayout><ProjectDetail /></AppLayout>} />
              <Route path="/app/content" element={<AppLayout><Content /></AppLayout>} />
              <Route path="/app/content/new" element={<AppLayout><ContentEditor /></AppLayout>} />
              <Route path="/app/content/:id" element={<AppLayout><ContentEditor /></AppLayout>} />
              <Route path="/app/models" element={<AppLayout><Models /></AppLayout>} />
              <Route path="/app/tasks" element={<AppLayout><Tasks /></AppLayout>} />
              <Route path="/app/calendar" element={<AppLayout><Calendar /></AppLayout>} />
              <Route path="/app/insights" element={<AppLayout><Insights /></AppLayout>} />
              <Route path="/app/notifications" element={<AppLayout><Notifications /></AppLayout>} />
              <Route path="/app/settings" element={<AppLayout><Settings /></AppLayout>} />
              <Route path="/app/profile" element={<AppLayout><Profile /></AppLayout>} />
              
              {/* Admin Routes (Protected + Admin/Moderator Role) */}
              <Route path="/app/users" element={<AdminLayout><Users /></AdminLayout>} />
              <Route path="/app/integrations" element={<AdminLayout><Integrations /></AdminLayout>} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
