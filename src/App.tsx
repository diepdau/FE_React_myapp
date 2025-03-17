import "./index.css";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Register from "./pages/register";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TaskList from "./pages/Task/taskList";
import Navbar from "./components/Navbar";
import useStore from "./store";
import TaskLabels from "./pages/TaskLabel/taskLabel";
import TaskComments from "./pages/TaskComment/taskComments";
import TaskAttachments from "./pages/TaskAttachment/taskAttachments";
const queryClient = new QueryClient();
function App() {
  const store = useStore();
  const authUser = store.authUser;
  const Layout = () => {
    return (
      <>
        {authUser ? (
          <>
            <Navbar />
            <div>
              <QueryClientProvider client={queryClient}>
                <Outlet />
              </QueryClientProvider>
            </div>
          </>
        ) : (
          <p>Not login. Please login again.</p>
        )}
      </>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/tasks",
          element: <TaskList />,
        },
        {
          path: "/task-labels",
          element: <TaskLabels />,
        },
        {
          path: "/task-comments",
          element: <TaskComments />,
        },
        {
          path: "/task-attachments",
          element: <TaskAttachments />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
