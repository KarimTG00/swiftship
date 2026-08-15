import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import FournisseurAuth from "./contexts/AuthProvider";
import RouteProtegee from "./components/RouteProtegee";
import Home from "./pages/home";
import Menu from "./pages/menu";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Expeditions from "./pages/expeditions";

const provider = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/menu",
    element: <Menu />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <RouteProtegee>
        <Dashboard />
      </RouteProtegee>
    ),
  },
  {
    path: "/dashboard/expeditions",
    element: (
      <RouteProtegee>
        <Expeditions />
      </RouteProtegee>
    ),
  },
]);

function App() {
  return (
    <FournisseurAuth>
      <RouterProvider router={provider} />
    </FournisseurAuth>
  );
}

export default App;
