import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { API_ENDPOINTS } from "../../config/api";
import { NOVEDADES_MOCK, OFERTAS_MOCK } from "../../data/mockData";
import BusSearchResults from "../components/BusSearchResults";
import { NovedadCard } from "../components/NovedadCard";
import { OfertaCard } from "../components/OfertaCard";

interface Parada {
    parada_id: number;
    ciudad: string;
    activo: boolean;
    fecha_creacion: string;
}

interface Frecuencia {
    frecuencia_id: number;
    nombre_frecuencia: string;
    bus_id: number;
    conductor_id: number;
    hora_salida: string;
    hora_llegada: string;
    origen: string;
    destino: string;
    provincia: string;
    activo: boolean;
    total: number;
    nro_aprobacion: string;
    es_directo: boolean;
    fecha_creacion: string;
    conductor?: {
        usuario_id: number;
        identificacion: string;
        primer_nombre: string;
        segundo_nombre: string;
        primer_apellido: string;
        segundo_apellido: string;
        correo: string;
        telefono: string;
        rol: string;
        direccion: string;
        fecha_eliminacion: string | null;
        fecha_creacion: string;
    };
    bus?: {
        bus_id: number;
        numero_bus: number;
        placa: string;
        chasis: string;
        carroceria: string;
        total_asientos_normales: number;
        total_asientos_vip: number;
        deletedAt: string | null;
        activo: boolean;
        fotos: any[];
        asientos: Array<{
            asiento_id: number;
            tipo_asiento: string;
            numero_asiento: number;
            fecha_creacion: string;
        }>;
    };
    rutas: any[];
}

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [origen, setOrigen] = useState("Seleccionar origen");
    const [destino, setDestino] = useState("Seleccionar destino");
    const [fechaIda, setFechaIda] = useState(new Date());
    const [fechaRetorno, setFechaRetorno] = useState<Date | null>(null);
    const [showDatePickerIda, setShowDatePickerIda] = useState(false);
    const [showDatePickerRetorno, setShowDatePickerRetorno] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paradas, setParadas] = useState<Parada[]>([]);
    const [frecuencias, setFrecuencias] = useState<Frecuencia[]>([]);
    const [cargando, setCargando] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [seleccionActual, setSeleccionActual] = useState<"origen" | "destino">("origen");
    const [mostrarResultados, setMostrarResultados] = useState(false);

    useEffect(() => {
        cargarParadas();
    }, []);

    const cargarParadas = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.PARADAS.GET_ALL);
            if (!response.ok) throw new Error("Error al cargar paradas");
            const data = await response.json();
            console.log("Datos de paradas:", data);
            setParadas(data);
        } catch (error) {
            setError("Error al cargar las paradas disponibles");
            console.error(error);
        }
    };

    const buscarFrecuencias = async () => {
        if (!validarBusqueda()) return;

        setCargando(true);
        setError(null);

        try {
            const origenCodificado = encodeURIComponent(origen);
            const destinoCodificado = encodeURIComponent(destino);

            console.log("Buscando frecuencias para:", {
                origen: origenCodificado,
                destino: destinoCodificado,
            });

            // Primero buscamos por origen
            const responseOrigen = await fetch(
                API_ENDPOINTS.FRECUENCIAS.GET_BY_ORIGEN(origenCodificado)
            );
            console.log("Response origen status:", responseOrigen.status);

            if (!responseOrigen.ok) {
                const errorText = await responseOrigen.text();
                console.log("Error en respuesta origen:", errorText);
                // Si el error es 400 y el mensaje indica que no hay frecuencias, continuamos con destino
                if (responseOrigen.status !== 400) {
                    throw new Error("Error al buscar frecuencias por origen");
                }
            }

            const frecuenciasOrigen = responseOrigen.ok ? await responseOrigen.json() : [];
            console.log("Frecuencias por origen:", frecuenciasOrigen);

            // Filtramos por destino
            const responseDestino = await fetch(
                API_ENDPOINTS.FRECUENCIAS.GET_BY_DESTINO(destinoCodificado)
            );
            console.log("Response destino status:", responseDestino.status);

            if (!responseDestino.ok) {
                const errorText = await responseDestino.text();
                console.log("Error en respuesta destino:", errorText);
                // Si el error es 400 y el mensaje indica que no hay frecuencias, continuamos
                if (responseDestino.status !== 400) {
                    throw new Error("Error al buscar frecuencias por destino");
                }
            }

            const frecuenciasDestino = responseDestino.ok ? await responseDestino.json() : [];
            console.log("Frecuencias por destino:", frecuenciasDestino);

            // Encontramos las frecuencias que coinciden tanto en origen como en destino
            const frecuenciasDisponibles = frecuenciasOrigen.filter((fo: Frecuencia) =>
                frecuenciasDestino.some(
                    (fd: Frecuencia) =>
                        fd.origen === fo.origen && fd.destino === fo.destino && fd.activo === true
                )
            );

            console.log("Frecuencias disponibles:", frecuenciasDisponibles);

            setFrecuencias(frecuenciasDisponibles);

            if (frecuenciasDisponibles.length === 0) {
                if (Platform.OS === "android") {
                    ToastAndroid.show("No hay buses para esta ruta", ToastAndroid.LONG);
                } else {
                    Alert.alert(
                        "Sin resultados",
                        "No se encontraron frecuencias disponibles para la ruta seleccionada",
                        [{ text: "Entendido" }]
                    );
                }
            } else {
                Alert.alert(
                    "Búsqueda exitosa",
                    `Se encontraron ${frecuenciasDisponibles.length} buses disponibles para la ruta ${origen} - ${destino}`,
                    [{ text: "Ver resultados" }]
                );
            }
        } catch (error) {
            console.error("Error completo:", error);
            setError("Error al buscar frecuencias disponibles");
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    error instanceof Error ? error.message : "Error al buscar frecuencias",
                    ToastAndroid.SHORT
                );
            } else {
                Alert.alert("Error", "No se pudieron buscar las frecuencias disponibles");
            }
        } finally {
            setCargando(false);
        }
    };

    const intercambiarUbicaciones = () => {
        // Validar que ambos campos tengan valores seleccionados
        if (origen === "Seleccionar origen" || destino === "Seleccionar destino") {
            Alert.alert(
                "Error",
                "Debes seleccionar tanto el origen como el destino antes de intercambiarlos",
                [{ text: "Entendido" }]
            );
            return;
        }

        const tempOrigen = origen;
        setOrigen(destino);
        setDestino(tempOrigen);
    };

    const formatearFecha = (fecha: Date | null) => {
        if (!fecha) return "Seleccionar fecha";

        const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
        const meses = [
            "ene",
            "feb",
            "mar",
            "abr",
            "may",
            "jun",
            "jul",
            "ago",
            "sep",
            "oct",
            "nov",
            "dic",
        ];

        return `${dias[fecha.getDay()]}-${fecha.getDate()}-${meses[fecha.getMonth()]}`;
    };

    const onChangeFechaIda = (event: any, selectedDate?: Date) => {
        setShowDatePickerIda(Platform.OS === "ios");
        if (selectedDate) {
            // Validar que la fecha no sea anterior al día actual
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                Alert.alert(
                    "Fecha inválida",
                    "No puedes seleccionar una fecha anterior al día de hoy",
                    [{ text: "Entendido" }]
                );
                return;
            }

            setFechaIda(selectedDate);

            // Si hay fecha de retorno y es anterior a la nueva fecha de ida, limpiarla
            if (fechaRetorno && selectedDate > fechaRetorno) {
                setFechaRetorno(null);
            }
        }
    };

    const onChangeFechaRetorno = (event: any, selectedDate?: Date) => {
        setShowDatePickerRetorno(Platform.OS === "ios");
        if (selectedDate) {
            // Validar que la fecha de retorno no sea anterior a la de ida
            if (selectedDate < fechaIda) {
                Alert.alert(
                    "Fecha inválida",
                    "La fecha de retorno no puede ser anterior a la fecha de ida",
                    [{ text: "Entendido" }]
                );
                return;
            }
            setFechaRetorno(selectedDate);
        }
    };

    const setHoy = () => {
        const hoy = new Date();
        setFechaIda(hoy);

        // Si hay fecha de retorno y es anterior a hoy, limpiarla
        if (fechaRetorno && hoy > fechaRetorno) {
            setFechaRetorno(null);
        }
    };

    const setMañana = () => {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        setFechaIda(mañana);

        // Si hay fecha de retorno y es anterior a mañana, limpiarla
        if (fechaRetorno && mañana > fechaRetorno) {
            setFechaRetorno(null);
        }
    };

    const validarBusqueda = () => {
        // Validar origen y destino
        if (origen === "Seleccionar origen" || destino === "Seleccionar destino") {
            Alert.alert("Campos requeridos", "Debes seleccionar tanto el origen como el destino", [
                { text: "Entendido" },
            ]);
            return false;
        }

        // Validar que origen y destino sean diferentes
        if (origen === destino) {
            Alert.alert("Error en rutas", "El origen y el destino no pueden ser iguales", [
                { text: "Entendido" },
            ]);
            return false;
        }

        // Validar fecha de ida (ya está validada en el picker)

        return true;
    };

    const handleBuscarBuses = async () => {
        if (!validarBusqueda()) return;
        setCargando(true);
        setError(null);

        try {
            await buscarFrecuencias();
            setMostrarResultados(true);
        } catch (error) {
            console.error("Error al buscar buses:", error);
            setError("Error al buscar frecuencias disponibles");
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    error instanceof Error ? error.message : "Error al buscar frecuencias",
                    ToastAndroid.SHORT
                );
            } else {
                Alert.alert("Error", "No se pudieron buscar las frecuencias disponibles");
            }
        } finally {
            setCargando(false);
        }
    };
    const handleSelectBus = (frecuencia: any) => {
        router.push({
            pathname: "/confirmacion-reserva",
            params: {
                frecuencia: JSON.stringify(frecuencia),
            },
        });
    };

    const abrirSelectorParadas = (tipo: "origen" | "destino") => {
        setSeleccionActual(tipo);
        setModalVisible(true);
    };

    const seleccionarParada = (parada: Parada) => {
        if (!parada.activo) {
            Alert.alert("Parada no disponible", "Esta parada no está activa actualmente");
            return;
        }

        if (seleccionActual === "origen") {
            setOrigen(parada.ciudad);
        } else {
            setDestino(parada.ciudad);
        }
        setModalVisible(false);
    };

    if (mostrarResultados && frecuencias.length > 0) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                <View className="flex-row items-center p-4 border-b border-gray-200">
                    <TouchableOpacity onPress={() => setMostrarResultados(false)} className="mr-4">
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-lg font-bold">
                            {origen} → {destino}
                        </Text>
                        <Text className="text-gray-600">{formatearFecha(fechaIda)}</Text>
                    </View>
                </View>
                <BusSearchResults frecuencias={frecuencias} onSelectBus={handleSelectBus} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            >
                <View className="p-4">
                    {/* Encabezado */}
                    <View className="mb-4">
                        <Text className="text-3xl font-bold mb-1">Pasaje de bus</Text>
                        <Text className="text-gray-600 text-lg">
                            Pagos seguros, descuentos especiales
                        </Text>
                    </View>

                    {/* Mostrar error si existe */}
                    {error && (
                        <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <Text className="text-red-700">{error}</Text>
                        </View>
                    )}

                    {/* Formulario de búsqueda */}
                    <View className="bg-white rounded-lg border border-gray-400 overflow-hidden mb-6">
                        {/* Campo Origen */}
                        <View className="p-4 border-b border-gray-400">
                            <Text className="text-gray-600 mb-1">Origen</Text>
                            <TouchableOpacity
                                className="flex-row items-center justify-between"
                                onPress={() => abrirSelectorParadas("origen")}
                            >
                                <Text
                                    className={`text-lg ${
                                        origen === "Seleccionar origen"
                                            ? "text-gray-400"
                                            : "text-black"
                                    }`}
                                >
                                    {origen}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Botón de intercambio */}
                        <View className="absolute right-14 top-16 z-10">
                            <TouchableOpacity
                                onPress={intercambiarUbicaciones}
                                className="bg-black rounded-full p-2"
                            >
                                <Ionicons name="swap-vertical" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Campo Destino */}
                        <View className="p-4 border-b border-gray-400">
                            <Text className="text-gray-600 mb-1">Destino</Text>
                            <TouchableOpacity
                                className="flex-row items-center justify-between"
                                onPress={() => abrirSelectorParadas("destino")}
                            >
                                <Text
                                    className={`text-lg ${
                                        destino === "Seleccionar destino"
                                            ? "text-gray-400"
                                            : "text-black"
                                    }`}
                                >
                                    {destino}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Fecha de ida */}
                        <View className="p-4 border-b border-gray-400">
                            <Text className="text-gray-600 mb-1">Fecha de ida</Text>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => setShowDatePickerIda(true)}
                                    className="mr-4"
                                >
                                    <Text className="text-lg">{formatearFecha(fechaIda)}</Text>
                                </TouchableOpacity>
                                <View className="flex-row space-x-2">
                                    <TouchableOpacity
                                        className={`px-4 py-1 rounded-full ${
                                            formatearFecha(fechaIda) === formatearFecha(new Date())
                                                ? "bg-yellow-500"
                                                : "bg-yellow-200"
                                        }`}
                                        onPress={setHoy}
                                    >
                                        <Text>Hoy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className={`px-4 py-1 rounded-full ${
                                            formatearFecha(fechaIda) ===
                                            formatearFecha(
                                                new Date(
                                                    new Date().setDate(new Date().getDate() + 1)
                                                )
                                            )
                                                ? "bg-yellow-500"
                                                : "bg-yellow-200"
                                        }`}
                                        onPress={setMañana}
                                    >
                                        <Text>Mañana</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Fecha de retorno */}
                        <View className="p-4">
                            <Text className="text-gray-600 mb-1">Fecha de retorno (Opcional)</Text>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    className="flex-row items-center justify-between mr-4"
                                    onPress={() => setShowDatePickerRetorno(true)}
                                >
                                    <Text
                                        className={`text-lg ${
                                            !fechaRetorno ? "text-gray-400" : "text-black"
                                        }`}
                                    >
                                        {formatearFecha(fechaRetorno)}
                                    </Text>
                                </TouchableOpacity>
                                {fechaRetorno && (
                                    <View className="flex-row space-x-2">
                                        <TouchableOpacity
                                            className="bg-red-400 px-4 py-1 rounded-full"
                                            onPress={() => setFechaRetorno(null)}
                                        >
                                            <Text className="text-white">Eliminar</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* DatePicker para fecha de ida */}
                    {showDatePickerIda && (
                        <DateTimePicker
                            value={fechaIda}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={onChangeFechaIda}
                            minimumDate={new Date()}
                        />
                    )}

                    {/* DatePicker para fecha de retorno */}
                    {showDatePickerRetorno && (
                        <DateTimePicker
                            value={fechaRetorno || new Date()}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={onChangeFechaRetorno}
                            minimumDate={fechaIda}
                        />
                    )}

                    {/* Botón de búsqueda con indicador de carga */}
                    <TouchableOpacity
                        className="bg-yellow-400 p-4 rounded-full flex-row items-center justify-center mb-6"
                        onPress={handleBuscarBuses}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <>
                                <Ionicons name="search" size={24} color="black" className="mr-2" />
                                <Text className="text-lg font-semibold">Buscar buses</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Sección Novedades */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold mb-4">Novedades</Text>
                        {NOVEDADES_MOCK.map((novedad) => (
                            <NovedadCard
                                key={novedad.id}
                                title={novedad.title}
                                subtitle={novedad.subtitle}
                                image={novedad.image}
                                onPress={() =>
                                    Alert.alert("Novedad", "Más información próximamente")
                                }
                            />
                        ))}
                    </View>

                    {/* Sección Ofertas */}
                    <View>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-2xl font-bold">Ofertas</Text>
                            <TouchableOpacity
                                onPress={() => Alert.alert("Ofertas", "Ver todas las ofertas")}
                            >
                                <Text className="text-blue-600">Ver todo</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mb-6"
                        >
                            {OFERTAS_MOCK.map((oferta) => (
                                <OfertaCard
                                    key={oferta.id}
                                    title={oferta.title}
                                    validUntil={oferta.validUntil}
                                    image={oferta.image}
                                    tag={oferta.tag}
                                    type={oferta.type}
                                    onPress={() =>
                                        Alert.alert("Oferta", "Más detalles próximamente")
                                    }
                                />
                            ))}
                        </ScrollView>
                    </View>

                    {/* Sección Visto anteriormente */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold mb-4">Visto anteriormente</Text>
                        <View className="bg-white rounded-xl p-4 shadow">
                            <View className="flex-row items-center mb-2">
                                <Image
                                    source={{
                                        uri: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=64&auto=format&fit=crop",
                                    }}
                                    className="w-8 h-8 rounded-full"
                                    resizeMode="cover"
                                />
                                <View className="flex-row items-center ml-2">
                                    <Text className="text-lg">1 bus visto</Text>
                                </View>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <View>
                                    <Text className="text-lg font-semibold">Ambato → Quito</Text>
                                    <Text className="text-gray-600">lun 26 may</Text>
                                </View>
                                <Ionicons name="time-outline" size={24} color="#666" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Modal para selección de paradas */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View className="flex-1 bg-black/50 justify-end">
                        <View className="bg-white rounded-t-3xl p-4 h-3/4">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-xl font-bold">
                                    Seleccionar{" "}
                                    {seleccionActual === "origen" ? "origen" : "destino"}
                                </Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                            {cargando ? (
                                <ActivityIndicator size="large" color="#000" />
                            ) : error ? (
                                <Text className="text-red-500">{error}</Text>
                            ) : (
                                <FlatList
                                    data={paradas}
                                    keyExtractor={(item) => item.parada_id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            key={item.parada_id}
                                            className={`p-4 border-b border-gray-200 ${
                                                !item.activo ? "opacity-50" : ""
                                            }`}
                                            onPress={() => seleccionarParada(item)}
                                            disabled={!item.activo}
                                        >
                                            <Text
                                                className={`text-lg ${
                                                    !item.activo ? "text-gray-400" : "text-black"
                                                }`}
                                            >
                                                {item.ciudad}
                                            </Text>
                                            {!item.activo && (
                                                <Text className="text-sm text-red-500">
                                                    No disponible
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}
