import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Explore, { ContinentView, CountryView } from "@/pages/explore";
import League from "@/pages/league";
import Team from "@/pages/team";
import Match from "@/pages/match";
import Community from "@/pages/community";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
