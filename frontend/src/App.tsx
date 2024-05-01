import {
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { Admin } from "./pages/Admin";
import { LoginPage } from "./pages/LoginPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    [<Route path="/" element={ <RootLayout /> } >

    </Route>,
    <Route path="/admin" element={ <RootLayout /> } >
      <Route index element={ <Admin />} />
    </Route>,
    <Route path="/login" element={ <LoginPage /> } />
  ])
)

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
