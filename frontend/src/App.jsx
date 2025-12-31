import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./router/index.jsx";
import ClientContext from "./Helper/ClientContext.jsx";
import { ThemeProvider } from "./components/ui/theme-provider.jsx";
import BookingContext from "./Helper/BookingContext.jsx";
import AddressContext from "./Helper/AddressContext.jsx";
import ServiceContext from "./Helper/ServiceContext.jsx";
import SweepstarContext from "./Helper/SweepstarContext.jsx";

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                <ClientContext>
                    <AddressContext>
                        <BookingContext>
                            <SweepstarContext>
                                {/* 2. Wrap the Router with ServiceProvider */}
                                <ServiceContext>
                                    <RouterProvider router={AppRouter} />
                                </ServiceContext>
                            </SweepstarContext>
                        </BookingContext>
                    </AddressContext>
                </ClientContext>
            </ThemeProvider>
        </>
    );
}
export default App;
