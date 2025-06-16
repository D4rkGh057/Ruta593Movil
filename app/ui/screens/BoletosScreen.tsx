import { Ionicons } from "@expo/vector-icons";
import "nativewind";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../adapters/stores/authStore";
import { Boleto } from "../../core/domain/Boleto";
import { BoletoService } from "../../core/infrastructure/BoletoService";
import { QRCodeModal } from "../components/QRCodeModal";

export default function BoletosScreen() {
    const [boletos, setBoletos] = useState<Boleto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBoleto, setSelectedBoleto] = useState<Boleto | null>(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [useAllBoletos, setUseAllBoletos] = useState(true); // Variable para alternar entre endpoints
    
    const { getUserId } = useAuthStore();

    useEffect(() => {
        const fetchBoletos = async () => {
            try {
                const userId = getUserId();
                let data;

                if (useAllBoletos || !userId) {
                    // Obtener todos los boletos
                    data = await BoletoService.getAllBoletos();
                } else {
                    // Obtener boletos del usuario específico
                    data = await BoletoService.getBoletosByUser(userId.toString());
                }
                
                setBoletos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching boletos:", error);
                setBoletos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBoletos();
    }, [useAllBoletos]);

    const handleShowQR = (boleto: Boleto) => {
        setSelectedBoleto(boleto);
        setShowQRModal(true);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No disponible';
        return new Date(dateString).toLocaleDateString('es-EC', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <Text className="text-lg font-bold">Cargando boletos...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 items-center justify-start bg-gray-100 p-5 relative">
            <TouchableOpacity
                className="absolute -top-12 right-5 z-10"
                onPress={() => setUseAllBoletos((prev) => !prev)}
            >
                <Ionicons name="swap-horizontal-outline" size={24} color="black" />
                <Text className="text-base font-bold">Cambiar Endpoint</Text>
            </TouchableOpacity>
            
            {boletos.length > 0 ? (
                boletos.map((boleto) => (
                    <View
                        key={boleto.boleto_id}
                        className="w-full p-4 mb-4 bg-white rounded-lg shadow"
                    >
                        <Text className="text-lg font-bold">Boleto #{boleto.boleto_id}</Text>
                        <Text className="text-base text-gray-500">Estado: {boleto.estado}</Text>
                        <Text className="text-base text-gray-500">
                            Fecha de emisión: {formatDate(boleto.fecha_emision)}
                        </Text>
                        <Text className="text-base text-gray-500">
                            Cantidad de asientos: {boleto.cantidad_asientos}
                        </Text>
                        <Text className="text-base text-gray-500">Asientos: {boleto.asientos}</Text>
                        <Text className="text-base text-gray-500">Total: ${boleto.total}</Text>
                        
                        {boleto.url_imagen_qr && (
                            <TouchableOpacity
                                className="mt-3 bg-blue-500 p-3 rounded-lg flex-row items-center justify-center"
                                onPress={() => handleShowQR(boleto)}
                            >
                                <Ionicons name="qr-code-outline" size={20} color="white" />
                                <Text className="text-white font-bold ml-2">Ver Código QR</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))
            ) : (
                <>
                    <Image
                        source={require("../../../assets/fantasma.png")}
                        className="w-356 h-356 mb-5"
                    />
                    <Text className="text-lg font-bold mb-2">No tienes viajes :(</Text>
                    <Text className="text-base text-gray-500 text-center mb-5">
                        Los viajes que reserves aparecerán aquí
                    </Text>
                    <TouchableOpacity className="bg-yellow-400 py-2 px-5 rounded-lg flex-row items-center gap-2">
                        <Ionicons name="ticket" size={24} color="black" />
                        <Text className="text-base font-bold text-black">Reservar ahora</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Modal del código QR */}
            {selectedBoleto && (
                <QRCodeModal
                    visible={showQRModal}
                    onClose={() => {
                        setShowQRModal(false);
                        setSelectedBoleto(null);
                    }}
                    qrUrl={selectedBoleto.url_imagen_qr}
                    boletoInfo={{
                        boletoId: selectedBoleto.boleto_id!,
                        asientos: selectedBoleto.asientos,
                        fechaEmision: formatDate(selectedBoleto.fecha_emision),
                        total: selectedBoleto.total
                    }}
                />
            )}
        </View>
    );
}
