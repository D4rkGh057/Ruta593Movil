import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Cooperativa } from "../../core/domain/Cooperativa";
import { Frecuencia } from "../../core/domain/Frecuencia";

interface BusSearchResultProps {
    frecuencia: Frecuencia;
    onSelect: () => void;
    cooperativa?: Cooperativa;
}

const BusCard: React.FC<BusSearchResultProps> = ({ frecuencia, onSelect, cooperativa }) => {
    // Generamos una imagen aleatoria para cada bus usando Picsum
    const busImageUrl = `https://picsum.photos/200/200?random=${frecuencia.frecuencia_id || 1}`;
    // Logo de la compañía (usando el logo de la cooperativa o una imagen de respaldo)
    const companyLogoUrl =
        cooperativa?.logo || `https://picsum.photos/100/100?random=${(frecuencia.frecuencia_id || 1) + 1}`;

    return (
        <TouchableOpacity
            onPress={onSelect}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200"
        >
            {/* Imagen del bus en la parte superior */}
            <Image
                source={{ uri: busImageUrl }}
                className="w-full h-40 rounded-xl mb-4"
                resizeMode="cover"
            />

            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                    <Image
                        source={{ uri: companyLogoUrl }}
                        className="w-12 h-12 rounded-lg mr-3"
                        resizeMode="cover"
                    />
                    <View>
                        <Text className="text-lg font-bold">
                            {cooperativa?.nombre || `Bus #${frecuencia.bus?.numero_bus}`}
                        </Text>
                        <Text className="text-gray-600">
                            {frecuencia.conductor?.primer_nombre}{" "}
                            {frecuencia.conductor?.primer_apellido}
                        </Text>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-2xl font-bold text-yellow-500">
                        USD {frecuencia.total}
                    </Text>
                    <Text className="text-gray-500">por asiento</Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-1">
                    <Text className="text-gray-500">Salida</Text>
                    <Text className="text-lg font-semibold">{frecuencia.hora_salida}</Text>
                    <Text className="text-base text-gray-700">{frecuencia.origen}</Text>
                </View>
                <View className="flex-1 items-center">
                    <View className="w-full h-0.5 bg-gray-300" />
                    <View className="flex-row items-center my-2">
                        <Ionicons name="time-outline" size={20} color="#666" />
                        <Text className="ml-1 text-gray-600">
                            {(() => {
                                const salida = new Date(`2000-01-01 ${frecuencia.hora_salida}`);
                                const llegada = new Date(`2000-01-01 ${frecuencia.hora_llegada}`);
                                const diff = llegada.getTime() - salida.getTime();
                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                return `${hours}h ${minutes}m`;
                            })()}
                        </Text>
                    </View>
                    {frecuencia.es_directo && (
                        <View className="bg-green-100 px-3 py-1 rounded-full">
                            <Text className="text-green-700 text-sm">Directo</Text>
                        </View>
                    )}
                </View>
                <View className="flex-1 items-end">
                    <Text className="text-gray-500">Llegada</Text>
                    <Text className="text-lg font-semibold">{frecuencia.hora_llegada}</Text>
                    <Text className="text-base text-gray-700">{frecuencia.destino}</Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center border-t border-gray-200 pt-3">
                <View className="flex-row">
                    <View className="flex-row items-center mr-4">
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text className="ml-1">4.0</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="people" size={16} color="#666" />
                        <Text className="ml-1">
                            {(frecuencia.bus?.total_asientos_normales ?? 0) +
                                (frecuencia.bus?.total_asientos_vip ?? 0)}{" "}
                            asientos
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    className="bg-yellow-400 px-6 py-2 rounded-full"
                    onPress={onSelect}
                >
                    <Text className="font-semibold">Seleccionar</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

interface BusSearchResultsProps {
    frecuencias: Frecuencia[];
    onSelectBus: (frecuencia: Frecuencia) => void;
}

interface Filters {
    soloDirectos: boolean;
    soloVIP: boolean;
    precioMaximo: number | null;
    horarioManana: boolean;
    horarioTarde: boolean;
    horarioNoche: boolean;
    cooperativaId: number | null;
}

const BusSearchResults: React.FC<BusSearchResultsProps> = ({ frecuencias, onSelectBus }) => {
    const insets = useSafeAreaInsets();
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
    const [isLoadingCooperativas, setIsLoadingCooperativas] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>({
        soloDirectos: false,
        soloVIP: false,
        precioMaximo: null,
        horarioManana: false,
        horarioTarde: false,
        horarioNoche: false,
        cooperativaId: null,
    });

    useEffect(() => {
        const cargarCooperativas = async () => {
            try {
                setIsLoadingCooperativas(true);
                setError(null);
                // Simular datos de cooperativas
                const cooperativasMock = [
                    {
                        cooperativa_id: 1,
                        nombre: "Trans Esmeraldas",
                        ruc: "1234567890001",
                        telefono: "02-555-1234",
                        correo: "info@transesmeraldas.com",
                        logo: "https://picsum.photos/100",
                        direccion: "Av. Principal #123",
                    },
                    {
                        cooperativa_id: 2,
                        nombre: "Flota Imbabura",
                        ruc: "1234567890002",
                        telefono: "02-555-5678",
                        correo: "info@flotaimbabura.com",
                        logo: "https://picsum.photos/101",
                        direccion: "Calle Central #456",
                    },
                    {
                        cooperativa_id: 3,
                        nombre: "Cooperativa Loja",
                        ruc: "1234567890003",
                        telefono: "02-555-9012",
                        correo: "info@cooploja.com",
                        logo: "https://picsum.photos/102",
                        direccion: "Plaza Mayor #789",
                    },
                    {
                        cooperativa_id: 4,
                        nombre: "Expreso Carchi",
                        ruc: "1234567890004",
                        telefono: "02-555-3456",
                        correo: "info@expresocarchi.com",
                        logo: "https://picsum.photos/103",
                        direccion: "Terminal Norte #321",
                    },
                    {
                        cooperativa_id: 5,
                        nombre: "Trans Occidental",
                        ruc: "1234567890005",
                        telefono: "02-555-7890",
                        correo: "info@transoccidental.com",
                        logo: "https://picsum.photos/104",
                        direccion: "Av. Terminal #654",
                    },
                ];
                setCooperativas(cooperativasMock);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
                console.error("Error al cargar cooperativas:", err);
            } finally {
                setIsLoadingCooperativas(false);
            }
        };

        cargarCooperativas();
    }, []);

    const filteredFrecuencias = useMemo(() => {
        return frecuencias.filter((frecuencia) => {
            if (filters.soloDirectos && !frecuencia.es_directo) {
                return false;
            }

            if (
                filters.soloVIP &&
                (!frecuencia.bus?.total_asientos_vip || frecuencia.bus.total_asientos_vip === 0)
            ) {
                return false;
            }

            if (filters.precioMaximo && frecuencia.total > filters.precioMaximo) {
                return false;
            }

            if (filters.cooperativaId && frecuencia.cooperativa_id !== filters.cooperativaId) {
                return false;
            }

            const hora = parseInt(frecuencia.hora_salida.split(":")[0]);
            const esManana = hora >= 6 && hora < 12;
            const esTarde = hora >= 12 && hora < 18;
            const esNoche = hora >= 18 || hora < 6;

            if (filters.horarioManana && !esManana) {
                return false;
            }
            if (filters.horarioTarde && !esTarde) {
                return false;
            }
            if (filters.horarioNoche && !esNoche) {
                return false;
            }

            return true;
        });
    }, [frecuencias, filters]);

    const preciosDisponibles = useMemo(() => {
        const precios = frecuencias.map((f) => f.total);
        return [...new Set(precios)].sort((a, b) => a - b);
    }, [frecuencias]);

    const getCooperativaById = (id?: number) => {
        if (!id || !Array.isArray(cooperativas)) return undefined;
        return cooperativas.find((c) => c.cooperativa_id === id);
    };

    return (
        <>
            <View className="flex-1 bg-gray-50">
                {/* Botón de filtro */}
                <View className="bg-white p-4 border-b border-gray-200">
                    <TouchableOpacity
                        className="flex-row items-center justify-center py-2 px-4 border border-gray-200 rounded-lg"
                        onPress={() => setShowFiltersModal(true)}
                    >
                        <Ionicons name="options-outline" size={20} color="black" className="mr-2" />
                        <Text>Filtros</Text>
                    </TouchableOpacity>
                </View>

                {/* Lista de buses */}
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
                >
                    <View className="p-4">
                        <Text className="text-gray-600 mb-4">
                            {filteredFrecuencias.length}{" "}
                            {filteredFrecuencias.length === 1 ? "bus" : "buses"}
                        </Text>

                        {filteredFrecuencias.length === 0 ? (
                            <View className="items-center justify-center py-8">
                                <Ionicons name="bus-outline" size={48} color="#666" />
                                <Text className="text-gray-600 mt-4 text-center">
                                    No se encontraron buses disponibles
                                </Text>
                            </View>
                        ) : (
                            filteredFrecuencias.map((frecuencia) => (
                                <BusCard
                                    key={frecuencia.frecuencia_id}
                                    frecuencia={frecuencia}
                                    onSelect={() => onSelectBus(frecuencia)}
                                    cooperativa={getCooperativaById(frecuencia.cooperativa_id)}
                                />
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>

            {/* Modal de Filtros */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showFiltersModal}
                onRequestClose={() => setShowFiltersModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold">Filtros</Text>
                            <TouchableOpacity onPress={() => setShowFiltersModal(false)}>
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* Filtros */}
                        <ScrollView className="mb-4">
                            {/* Filtro por cooperativa */}
                            <Text className="font-semibold mb-2">Cooperativa</Text>
                            {isLoadingCooperativas ? (
                                <View className="items-center py-4">
                                    <ActivityIndicator size="small" color="#FFB800" />
                                    <Text className="text-gray-500 mt-2">
                                        Cargando cooperativas...
                                    </Text>
                                </View>
                            ) : error ? (
                                <View className="items-center py-4">
                                    <Text className="text-red-500">{error}</Text>
                                </View>
                            ) : (
                                <View className="flex-row flex-wrap gap-2 mb-4">
                                    {Array.isArray(cooperativas) &&
                                        cooperativas.map((cooperativa) => (
                                            <TouchableOpacity
                                                key={cooperativa.cooperativa_id}
                                                className={`px-4 py-2 rounded-full border ${
                                                    filters.cooperativaId ===
                                                    cooperativa.cooperativa_id
                                                        ? "bg-yellow-400 border-yellow-400"
                                                        : "border-gray-300"
                                                }`}
                                                onPress={() =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        cooperativaId:
                                                            prev.cooperativaId ===
                                                            cooperativa.cooperativa_id
                                                                ? null
                                                                : cooperativa.cooperativa_id,
                                                    }))
                                                }
                                            >
                                                <Text>{cooperativa.nombre}</Text>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            )}

                            <View className="flex-row justify-between items-center mb-4">
                                <Text>Solo viajes directos</Text>
                                <Switch
                                    value={filters.soloDirectos}
                                    onValueChange={(value) =>
                                        setFilters((prev) => ({ ...prev, soloDirectos: value }))
                                    }
                                />
                            </View>

                            <View className="flex-row justify-between items-center mb-4">
                                <Text>Solo buses con asientos VIP</Text>
                                <Switch
                                    value={filters.soloVIP}
                                    onValueChange={(value) =>
                                        setFilters((prev) => ({ ...prev, soloVIP: value }))
                                    }
                                />
                            </View>

                            {/* Filtros de horario */}
                            <Text className="font-semibold mb-2">Horario de salida</Text>
                            <View className="flex-row flex-wrap gap-2 mb-4">
                                <TouchableOpacity
                                    className={`px-4 py-2 rounded-full border ${
                                        filters.horarioManana
                                            ? "bg-yellow-400 border-yellow-400"
                                            : "border-gray-300"
                                    }`}
                                    onPress={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            horarioManana: !prev.horarioManana,
                                        }))
                                    }
                                >
                                    <Text>Mañana (6:00 - 11:59)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`px-4 py-2 rounded-full border ${
                                        filters.horarioTarde
                                            ? "bg-yellow-400 border-yellow-400"
                                            : "border-gray-300"
                                    }`}
                                    onPress={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            horarioTarde: !prev.horarioTarde,
                                        }))
                                    }
                                >
                                    <Text>Tarde (12:00 - 17:59)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`px-4 py-2 rounded-full border ${
                                        filters.horarioNoche
                                            ? "bg-yellow-400 border-yellow-400"
                                            : "border-gray-300"
                                    }`}
                                    onPress={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            horarioNoche: !prev.horarioNoche,
                                        }))
                                    }
                                >
                                    <Text>Noche (18:00 - 5:59)</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Filtro de precio máximo */}
                            <Text className="font-semibold mb-2">Precio máximo</Text>
                            <View className="flex-row flex-wrap gap-2 mb-4">
                                {preciosDisponibles.map((precio) => (
                                    <TouchableOpacity
                                        key={precio}
                                        className={`px-4 py-2 rounded-full border ${
                                            filters.precioMaximo === precio
                                                ? "bg-yellow-400 border-yellow-400"
                                                : "border-gray-300"
                                        }`}
                                        onPress={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                precioMaximo:
                                                    prev.precioMaximo === precio ? null : precio,
                                            }))
                                        }
                                    >
                                        <Text>Hasta ${precio}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Botón para limpiar filtros */}
                            <TouchableOpacity
                                className="bg-gray-200 px-4 py-2 rounded-full items-center mt-2"
                                onPress={() =>
                                    setFilters({
                                        soloDirectos: false,
                                        soloVIP: false,
                                        precioMaximo: null,
                                        horarioManana: false,
                                        horarioTarde: false,
                                        horarioNoche: false,
                                        cooperativaId: null,
                                    })
                                }
                            >
                                <Text>Limpiar filtros</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default BusSearchResults;
