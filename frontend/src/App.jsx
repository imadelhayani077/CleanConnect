import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./router/index.jsx";
import ClientContext from "./Helper/ClientContext.jsx";
import { ThemeProvider } from "./components/ui/theme-provider.jsx";

import BookingContext from "./Helper/BookingContext.jsx";
import AddressContext from "./Helper/AddressContext.jsx";

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                <ClientContext>
                    <AddressContext>
                        <BookingContext>
                            <RouterProvider router={AppRouter} />
                        </BookingContext>
                    </AddressContext>
                </ClientContext>
            </ThemeProvider>
        </>
    );
}
export default App;
