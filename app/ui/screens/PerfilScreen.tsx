import React from "react";
import { Button } from "react-native";
import SessionStorage from "../../adapters/stores/SessionStorage";
import CenteredInfoScreen from "../components/CenteredInfoScreen";

export default function PerfilScreen() {
    const handleLogout = async () => {
        await SessionStorage.clearSession();
        console.log("Sesión cerrada");
    };

    return (
        <CenteredInfoScreen 
            title="Mi Perfil" 
            subtitle="Gestiona tu información personal"
        >
            <Button title="Cerrar Sesión" onPress={handleLogout} />
        </CenteredInfoScreen>
    );
}
