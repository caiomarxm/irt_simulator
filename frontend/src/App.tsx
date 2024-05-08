import {
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { Admin } from "./pages/Admin";
import { LoginPage } from "./pages/LoginPage";
import { AdminProtected, UserProtected } from "./guard/ProtectedRoutes";
import { ResultsPage } from "./pages/ResultsPage";
import { ExamPage } from "./pages/ExamPage";
import { ProfilePage } from "./pages/ProfilePage";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<UserProtected><RootLayout /></UserProtected>}>
      <Route index element={<ExamPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="results" element={<ResultsPage />} />
    </Route>,
    <Route path="/admin" element={<AdminProtected><RootLayout /></AdminProtected>}>
      <Route index element={<Admin />} />
    </Route>,
    <Route path="/login" element={<LoginPage />} />,
  ])
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
