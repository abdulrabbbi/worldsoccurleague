import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ProfileSetupProvider } from "@/lib/profile-setup-context";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Explore, { ContinentView, CountryView } from "@/pages/explore";
import League from "@/pages/league";
import Team from "@/pages/team";
import Match from "@/pages/match";
import Community from "@/pages/community";

// Auth pages
import Login from "@/pages/auth/login";
import SignUp from "@/pages/auth/signup";
import ForgotPassword from "@/pages/auth/forgot-password";
import VerifyCode from "@/pages/auth/verify-code";
import LocationSetup from "@/pages/auth/profile-setup/location";
import ContinentSetup from "@/pages/auth/profile-setup/continent";
import LeaguesSetup from "@/pages/auth/profile-setup/leagues";
import NationalTeamSetup from "@/pages/auth/profile-setup/national-team";
import NotificationsSetup from "@/pages/auth/profile-setup/notifications";

function Router() {
  return (
    <Switch>
      {/* Landing - redirects to login */}
      <Route path="/" component={Landing} />
      
      {/* Auth Routes */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={SignUp} />
      <Route path="/auth/forgot-password" component={ForgotPassword} />
      <Route path="/auth/verify-code" component={VerifyCode} />
      
      {/* Profile Setup Routes */}
      <Route path="/auth/profile-setup/location" component={LocationSetup} />
      <Route path="/auth/profile-setup/continent" component={ContinentSetup} />
      <Route path="/auth/profile-setup/leagues" component={LeaguesSetup} />
      <Route path="/auth/profile-setup/national-team" component={NationalTeamSetup} />
      <Route path="/auth/profile-setup/notifications" component={NotificationsSetup} />

      {/* App Routes */}
      <Route path="/home" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/explore/continent/:id" component={ContinentView} />
      <Route path="/explore/country/:id" component={CountryView} />
      <Route path="/league/:id" component={League} />
      <Route path="/team/:id" component={Team} />
      <Route path="/match/:id" component={Match} />
      <Route path="/community" component={Community} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileSetupProvider>
        <Toaster />
        <Router />
      </ProfileSetupProvider>
    </QueryClientProvider>
  );
}

export default App;
