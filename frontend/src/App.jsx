import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./router/index.jsx";
import { ThemeProvider } from "./components/ui/theme-provider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                    <RouterProvider router={AppRouter} />
                </ThemeProvider>
            </QueryClientProvider>
        </>
    );
}
export default App;
