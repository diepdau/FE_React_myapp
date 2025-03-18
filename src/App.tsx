import { useEffect } from "react";
import useStore from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Register from "./pages/register";
import TaskList from "./pages/Task/taskList";
import TaskLabels from "./pages/TaskLabel/taskLabel";
import TaskAttachments from "./pages/TaskAttachment/taskAttachments";
import TaskDetail from "./pages/Task/getTask";

const queryClient = new QueryClient();

function App() {
  const store = useStore();
  const { authUser, checkAuth } = store;

  useEffect(() => {
    checkAuth(); 
  }, [checkAuth]);

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
          <p>Not logged in. Please login again.</p>
        )}
      </>
    );
  };

  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/register", element: <Register /> },
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/tasks", element: <TaskList /> },
        { path: "/tasks/:id", element: <TaskDetail /> },
        { path: "/task-labels", element: <TaskLabels /> },
        // { path: "/task-comments", element: <TaskComments /> },
        { path: "/task-attachments", element: <TaskAttachments /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
