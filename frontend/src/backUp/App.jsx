import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./router/index.jsx";
import ClientContext from "./Helper/ClientContext.jsx";
import { ThemeProvider } from "./components/ui/theme-provider.jsx";

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                <ClientContext>
                    <RouterProvider router={AppRouter} />
                </ClientContext>
            </ThemeProvider>
        </>
    );
}
export default App;
