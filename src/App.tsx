import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import PostItem from "./pages/PostItem";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category/:type" element={<CategoryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/seller" element={<SellerDashboard />} />
          <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
          <Route path="/dashboard/seller/post" element={<PostItem />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
