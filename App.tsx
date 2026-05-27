import { LocalizationProvider } from "./src/localization/LocalizationContext";
import LimiterBreakerApp from "./src/LimiterBreakerApp";

export default function App() {
  return (
    <LocalizationProvider>
      <LimiterBreakerApp />
    </LocalizationProvider>
  );
}
