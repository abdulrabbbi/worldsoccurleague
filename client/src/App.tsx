import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ProfileSetupProvider } from "@/lib/profile-setup-context";
import { AuthProvider } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Community from "@/pages/community";

// Auth pages
import Login from "@/pages/auth/login";
import SignUp from "@/pages/auth/signup";
import ForgotPassword from "@/pages/auth/forgot-password";
import VerifyCode from "@/pages/auth/verify-code";
import LocationSetup from "@/pages/auth/profile-setup/location";
import IntroSetup from "@/pages/auth/profile-setup/intro";
import ContinentSetup from "@/pages/auth/profile-setup/continent";
import LeaguesSetup from "@/pages/auth/profile-setup/leagues";
import NationalTeamSetup from "@/pages/auth/profile-setup/national-team";
import FavoritesSetup from "@/pages/auth/profile-setup/favorites";
import NotificationsSetup from "@/pages/auth/profile-setup/notifications";

// Hierarchy pages
import World from "@/pages/world";
import Continent from "@/pages/continent";
import Country from "@/pages/country";
import CategoryPage from "@/pages/category";
import League from "@/pages/league";
import Team from "@/pages/team";
import Player from "@/pages/player";
import Match from "@/pages/match";
import Search from "@/pages/search";
import Profile from "@/pages/profile";
import Favorites from "@/pages/favorites";
import Shop from "@/pages/shop";
import Marketplace from "@/pages/marketplace";

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
      <Route path="/auth/profile-setup/intro" component={IntroSetup} />
      <Route path="/auth/profile-setup/continent" component={ContinentSetup} />
      <Route path="/auth/profile-setup/leagues" component={LeaguesSetup} />
      <Route path="/auth/profile-setup/favorites" component={FavoritesSetup} />
      <Route path="/auth/profile-setup/national-team" component={NationalTeamSetup} />
      <Route path="/auth/profile-setup/notifications" component={NotificationsSetup} />

      {/* App Routes - Authenticated */}
      <Route path="/home" component={Home} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/shop" component={Shop} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/community" component={Community} />
      <Route path="/search" component={Search} />
      <Route path="/profile" component={Profile} />

      {/* Hierarchy Routes - World → Continent → Country → Category → League → Team → Player → Match */}
      <Route path="/world" component={World} />
      <Route path="/continent/:slug" component={Continent} />
      <Route path="/country/:slug" component={Country} />
      <Route path="/country/:slug/category/:category" component={CategoryPage} />
      <Route path="/league/:id-:slug" component={League} />
      <Route path="/team/:id-:slug" component={Team} />
      <Route path="/player/:id-:slug" component={Player} />
      <Route path="/match/:id" component={Match} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileSetupProvider>
          <Toaster />
          <Router />
        </ProfileSetupProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
