import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import DailyQuest from "./pages/DailyQuest";
import Leaderboard from "./pages/Leaderboard";
import Quests from "./pages/Quests";
import QuestDetail from "./pages/QuestDetail";
import SafetyCushionQuest from "./pages/SafetyCushionQuest";
import InvestmentStartQuest from "./pages/InvestmentStartQuest";
import AntiFraudQuest from "./pages/AntiFraudQuest";
import Achievements from "./pages/Achievements";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/daily-quest" element={<DailyQuest />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/quest/safety-cushion" element={<SafetyCushionQuest />} />
            <Route path="/quest/investment-start" element={<InvestmentStartQuest />} />
            <Route path="/quest/antifraud" element={<AntiFraudQuest />} />
            <Route path="/quest/:id" element={<QuestDetail />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
