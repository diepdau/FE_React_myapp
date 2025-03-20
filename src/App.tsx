import useStore from "./store/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Register from "./pages/register";
import TaskList from "./pages/Task/taskList";
import TaskLabels from "./pages/TaskLabel/taskLabel";
import TaskDetail from "./pages/Task/getTask";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { useEffect, useState } from "react";
const SIDEBAR_ITEMS = [
  {
    text: "Task",
    url: "/dashboard",
    icon: <AssignmentIcon />,
  },
  {
    text: "Label",
    url: "/labels",
    icon: <BookmarksIcon />,
  },
];
const queryClient = new QueryClient();

function App() {
  const store = useStore();
  const token = store.token;
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    if (token) {
      setAuth(true);
    }
  }, [token]);
  const Layout = () => {
    return (
      <>
        {auth ? (
          <>
            <div className="flex">
              <div className="w-1/6 bg-[#cfcfcf]">
                <Sidebar>
                  {SIDEBAR_ITEMS.map((item) => (
                    <SidebarItem
                      key={item.url}
                      icon={item.icon}
                      text={item.text}
                      url={item.url}
                    />
                  ))}
                </Sidebar>
              </div>
              <div className="w-5/6 py-4 px-6">
                <Navbar />
                <QueryClientProvider client={queryClient}>
                  <Outlet />
                </QueryClientProvider>
              </div>
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
        { path: "/dashboard", element: <TaskList /> },
        { path: "/tasks", element: <TaskList /> },
        { path: "/tasks/:id", element: <TaskDetail /> },
        { path: "/task-labels", element: <TaskLabels /> },
        { path: "/labels", element: <TaskLabels /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
