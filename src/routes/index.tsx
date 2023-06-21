import { AuthRouter } from "./auth.routes";
import { useAuth } from "../hooks/useAuth";
import * as AuthProvider from "../hooks/useAuthProvider";
import { RestaurantRouter } from "./Restaurant/restaurant.routes";
import { ProviderRouter } from "./Provider/provider.routes";
import { useNavigate } from "react-router-dom";

export function Router() {
  const { restaurantSession } = useAuth();
  const { providerSession } = AuthProvider.useAuth();

  function redirectByUserType() {
    if (restaurantSession) {
      return <RestaurantRouter />;
    }
    // TODO: Corrigir o contexto de provider
    if (providerSession) {
      return <ProviderRouter provider={providerSession}/>;
    } 
    
    return <AuthRouter />;
    
  }
  return redirectByUserType();
}

