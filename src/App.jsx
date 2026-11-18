import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminShell } from "@/components/layout/AdminShell";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ClubProvider } from "@/context/ClubContext";
import { BillingPage } from "@/pages/billing/BillingPage";
import { BookingsPage } from "@/pages/bookings/BookingsPage";
import { ClinicsPage } from "@/pages/clinics/ClinicsPage";
import { CustomersPage } from "@/pages/customers/CustomersPage";
import { LeaguesPage } from "@/pages/leagues/LeaguesPage";
import { LoginPage } from "@/pages/login/LoginPage";
import { MatchesPage } from "@/pages/matches/MatchesPage";
import { PaymentsPage } from "@/pages/payments/PaymentsPage";
import { ProgramsPage } from "@/pages/programs/ProgramsPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { RewardsPage } from "@/pages/rewards/RewardsPage";
import { SchedulePage } from "@/pages/schedule/SchedulePage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { StorePage } from "@/pages/store/StorePage";

function RequireAuth() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <AdminShell />;
}

export default function App() {
  return (
    <AuthProvider>
      <ClubProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route index element={<Navigate to="/schedule" replace />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="rewards" element={<RewardsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="matches" element={<MatchesPage />} />
              <Route path="clinics" element={<ClinicsPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="leagues" element={<LeaguesPage />} />
              <Route path="store" element={<StorePage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/schedule" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ClubProvider>
    </AuthProvider>
  );
}
