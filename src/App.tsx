import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer } from "./components/common/Toast";
import { Sidebar } from "./components/layout/Sidebar";
import { AuthGuard } from "./components/guards/AuthGuard";
import { RoleGuard } from "./components/guards/RoleGuard";

// Public Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Docs from "./pages/Docs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// App Pages
import Dashboard from "./pages/Dashboard";
import KanbanBoard from "./pages/KanbanBoard";
import Calendar from "./pages/Calendar";
import Editor from "./pages/Editor";
import Settings from "./pages/Settings";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// App Layout wrapper with auth guard
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Sidebar>{children}</Sidebar>
    </AuthGuard>
  );
}

// Admin Layout wrapper with role guard
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin']}>
        <Sidebar>{children}</Sidebar>
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
              {/* Public Marketing Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/docs" element={<Docs />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* App Routes (Protected) */}
              <Route path="/app" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/app/board" element={<AppLayout><KanbanBoard /></AppLayout>} />
              <Route path="/app/calendar" element={<AppLayout><Calendar /></AppLayout>} />
              <Route path="/app/editor" element={<AppLayout><Editor /></AppLayout>} />
              <Route path="/app/editor/:id" element={<AppLayout><Editor /></AppLayout>} />
              <Route path="/app/insights" element={<AppLayout><Insights /></AppLayout>} />
              <Route path="/app/settings" element={<AppLayout><Settings /></AppLayout>} />
              <Route path="/app/profile" element={<AppLayout><Profile /></AppLayout>} />
              
              {/* Admin Routes (Protected + Admin Role) */}
              <Route path="/app/admin" element={<AdminLayout><Admin /></AdminLayout>} />
              
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
