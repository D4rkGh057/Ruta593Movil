// Configuración base de la API
export const IP = "192.168.1.7";
export const API_BASE_URL = `http://${IP}:3000/api`;

// Endpoints de la API
export const API_ENDPOINTS = {
    // Usuarios
    USUARIOS: {
        /**
         * POST /api/user - Crear un nuevo usuario
         * Body: {
         *   identificacion: string,        // Número de identificación/cédula
         *   primer_nombre: string,         // Primer nombre del usuario
         *   segundo_nombre?: string,       // Segundo nombre del usuario (opcional)
         *   primer_apellido: string,       // Primer apellido del usuario
         *   segundo_apellido?: string,     // Segundo apellido del usuario (opcional)
         *   correo: string,               // Correo electrónico del usuario
         *   password: string,             // Contraseña del usuario
         *   telefono?: string,            // Número de teléfono (opcional)
         *   direccion?: string            // Dirección del usuario (opcional)
         * }
         * Response 201: Usuario creado con los mismos datos
         */
        CREATE: `${API_BASE_URL}/user`,

        /**
         * GET /api/user - Obtener todos los usuarios
         * Response 200: Array de usuarios con todos los campos
         */
        GET_ALL: `${API_BASE_URL}/user`,

        /**
         * GET /api/user/{id} - Obtener un usuario por ID
         * Params: id (number) - ID del usuario
         * Response 200: Objeto usuario con todos los campos
         * Response 404: Usuario no encontrado
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/user/${id}`,

        /**
         * PUT /api/user/{id} - Actualizar un usuario
         * Params: id (number) - ID del usuario a actualizar
         * Body: {
         *   rol?: string                   // Rol del usuario (ej: "usuario_normal", "admin")
         *   // Puede incluir otros campos actualizables
         * }
         * Response 200: Datos actualizados
         * Response 404: Usuario no encontrado
         */
        UPDATE: (id: string) => `${API_BASE_URL}/user/${id}`,

        /**
         * DELETE /api/user/{id} - Eliminar un usuario
         * Params: id (number) - ID del usuario a eliminar
         * Response 200: Confirmación de eliminación
         * Response 404: Usuario no encontrado
         */
        DELETE: (id: string) => `${API_BASE_URL}/user/${id}`,

        /**
         * GET /api/user/search/{name} - Buscar usuario por nombre o apellido
         * Params: name (string) - Nombre o apellido a buscar
         * Response 200: Array de usuarios que coinciden con la búsqueda
         */
        SEARCH_BY_NAME: (name: string) => `${API_BASE_URL}/user/search/${name}`,

        /**
         * GET /api/user/cedula/{cedula} - Buscar usuario por cédula
         * Params: cedula (string) - Número de cédula/identificación
         * Response 200: Objeto usuario encontrado
         * Response 404: Usuario no encontrado
         */
        GET_BY_CEDULA: (cedula: string) => `${API_BASE_URL}/user/cedula/${cedula}`,
    },
    // Autenticación
    AUTH: {
        /**
         * POST /api/auth/login - Iniciar sesión
         * Body: {
         *   correo: string,               // Correo electrónico del usuario
         *   password: string              // Contraseña del usuario
         * }
         * Response 200: {
         *   token: string,                // JWT token para autenticación
         *   user: {
         *     id: number,                 // ID del usuario
         *     correo: string,             // Correo electrónico
         *     roles: string[]             // Array de roles del usuario (ej: ["user", "admin"])
         *   }
         * }
         * Response 401: Credenciales inválidas
         */
        LOGIN: `${API_BASE_URL}/auth/login`,

        /**
         * POST /api/auth/register - Registrar nuevo usuario
         * Body: {
         *   identificacion: string,       // Número de identificación/cédula (requerido)
         *   primer_nombre: string,        // Primer nombre del usuario (requerido)
         *   segundo_nombre?: string,      // Segundo nombre del usuario (opcional)
         *   primer_apellido: string,      // Primer apellido del usuario (requerido)
         *   segundo_apellido?: string,    // Segundo apellido del usuario (opcional)
         *   correo: string,              // Correo electrónico del usuario (requerido)
         *   password: string,            // Contraseña del usuario (requerido)
         *   telefono?: string,           // Número de teléfono (opcional, formato: +593987654321)
         *   direccion?: string           // Dirección del usuario (opcional)
         * }
         * Response 201: {
         *   message: string               // Mensaje de confirmación "Usuario registrado correctamente"
         * }
         * Response 400: Datos inválidos (correo duplicado, campos requeridos faltantes, etc.)
         */
        REGISTER: `${API_BASE_URL}/auth/register`,

        /**
         * GET /api/auth/profile - Obtener perfil del usuario actual
         * Headers: Authorization: Bearer {token}  // JWT token requerido
         * Response 200: {
         *   id: number,                   // ID del usuario
         *   identificacion: string,       // Número de identificación/cédula
         *   primer_nombre: string,        // Primer nombre
         *   segundo_nombre?: string,      // Segundo nombre (puede ser null)
         *   primer_apellido: string,      // Primer apellido
         *   segundo_apellido?: string,    // Segundo apellido (puede ser null)
         *   correo: string,              // Correo electrónico
         *   telefono?: string,           // Número de teléfono (puede ser null)
         *   direccion?: string           // Dirección (puede ser null)
         * }
         * Response 401: No autorizado (token inválido o faltante)
         */
        PROFILE: `${API_BASE_URL}/auth/profile`,
    },
    // Buses
    BUSES: {
        /**
         * POST /api/buses - Crear un nuevo bus
         * Content-Type: multipart/form-data
         * Body: {
         *   numero_bus: number,              // Número identificador del bus (requerido)
         *   placa: string,                   // Placa del bus en formato ecuatoriano (requerido)
         *   chasis: string,                  // Número de chasis del bus (requerido)
         *   carroceria: string,              // Marca o modelo de la carrocería (requerido)
         *   total_asientos_normales: number, // Cantidad de asientos normales (requerido)
         *   total_asientos_vip: number,      // Cantidad de asientos VIP (requerido)
         *   files?: File[]                   // Array de imágenes del bus (opcional)
         * }
         * Response 201: Bus creado con todos los datos + files array
         * Response 400: Datos inválidos o formato de imagen incorrecto
         */
        CREATE: `${API_BASE_URL}/buses`,

        /**
         * GET /api/buses - Obtener todos los buses
         * Response 200: Array de buses con todos los campos
         * Estructura de respuesta: {
         *   numero_bus: number,
         *   placa: string,
         *   chasis: string,
         *   carroceria: string,
         *   total_asientos_normales: number,
         *   total_asientos_vip: number,
         *   files: Array<string|null>        // URLs de imágenes o null
         * }[]
         */
        GET_ALL: `${API_BASE_URL}/buses`,

        /**
         * GET /api/buses/{id} - Obtener un bus por ID
         * Params: id (number) - ID del bus
         * Response 200: Objeto bus con todos los campos
         * Response 404: Bus no encontrado
         */
        GET_BY_ID: (id: number) => `${API_BASE_URL}/buses/${id}`,

        /**
         * PUT /api/buses/{id} - Actualizar un bus
         * Params: id (number) - ID del bus a actualizar
         * Body: {
         *   activo?: boolean,                // Estado activo/inactivo del bus
         *   numero_bus?: number,             // Número identificador del bus
         *   placa?: string,                  // Placa del bus
         *   chasis?: string,                 // Número de chasis
         *   carroceria?: string,             // Marca o modelo de carrocería
         *   total_asientos_normales?: number,// Cantidad de asientos normales
         *   total_asientos_vip?: number      // Cantidad de asientos VIP
         * }
         * Response 200: Datos actualizados
         * Response 404: Bus no encontrado
         */
        UPDATE: (id: number) => `${API_BASE_URL}/buses/${id}`,

        /**
         * DELETE /api/buses/{id} - Eliminar un bus
         * Params: id (number) - ID del bus a eliminar
         * Response 200: Confirmación de eliminación
         * Response 404: Bus no encontrado
         */
        DELETE: (id: number) => `${API_BASE_URL}/buses/${id}`,

        /**
         * GET /api/buses/search/{placa} - Buscar bus por placa
         * Params: placa (string) - Número de placa del bus (formato ecuatoriano: ABC-1234)
         * Response 200: Objeto bus encontrado con todos los campos
         * Response 404: Bus no encontrado
         */
        SEARCH_BY_PLACA: (placa: string) => `${API_BASE_URL}/buses/search/${placa}`,
    },
    // Frecuencias
    FRECUENCIAS: {
        /**
         * POST /api/frecuencias - Crear una nueva frecuencia
         * Body: {
         *   nombre_frecuencia: string,    // Nombre descriptivo de la frecuencia (ej: "Quito - Guayaquil 08:00")
         *   bus_id: number,              // ID del bus asignado (requerido)
         *   conductor_id: number,        // ID del conductor asignado (requerido)
         *   hora_salida: string,         // Hora de salida en formato HH:MM (ej: "08:00")
         *   hora_llegada: string,        // Hora de llegada en formato HH:MM (ej: "14:00")
         *   origen: string,              // Ciudad de origen (requerido)
         *   destino: string,             // Ciudad de destino (requerido)
         *   provincia: string,           // Provincia de destino (requerido)
         *   activo: boolean,             // Estado activo/inactivo de la frecuencia
         *   total: number,               // Precio total del viaje (decimal)
         *   nro_aprobacion: string,      // Número de aprobación ANT (ej: "ANT-2024-001")
         *   es_directo: boolean          // Si es un viaje directo o con paradas
         * }
         * Response 201: Frecuencia creada con todos los datos
         */
        CREATE: `${API_BASE_URL}/frecuencias`,

        /**
         * GET /api/frecuencias - Obtener todas las frecuencias
         * Response 200: Array de frecuencias con estructura completa
         */
        GET_ALL: `${API_BASE_URL}/frecuencias`,

        /**
         * GET /api/frecuencias/{id} - Obtener una frecuencia por ID
         * Params: id (number) - ID de la frecuencia
         * Response 200: Objeto frecuencia con todos los campos
         * Response 404: Frecuencia no encontrada
         */
        GET_BY_ID: (id: number) => `${API_BASE_URL}/frecuencias/${id}`,

        /**
         * PUT /api/frecuencias/{id} - Actualizar una frecuencia
         * Params: id (number) - ID de la frecuencia a actualizar
         * Body: {
         *   nombre_frecuencia?: string,   // Nombre de la frecuencia
         *   bus_id?: number,             // ID del bus
         *   conductor_id?: number,       // ID del conductor
         *   hora_salida?: string,        // Hora de salida
         *   hora_llegada?: string,       // Hora de llegada
         *   origen?: string,             // Ciudad de origen
         *   destino?: string,            // Ciudad de destino
         *   provincia?: string,          // Provincia
         *   activo?: boolean,            // Estado activo
         *   total?: number,              // Precio total
         *   nro_aprobacion?: string,     // Número de aprobación
         *   es_directo?: boolean         // Si es directo
         * }
         * Response 200: Datos actualizados
         * Response 404: Frecuencia no encontrada
         */
        UPDATE: (id: number) => `${API_BASE_URL}/frecuencias/${id}`,

        /**
         * DELETE /api/frecuencias/{id} - Eliminar una frecuencia
         * Params: id (string) - ID de la frecuencia a eliminar
         * Response 200: Confirmación de eliminación
         * Response 404: Frecuencia no encontrada
         */
        DELETE: (id: string) => `${API_BASE_URL}/frecuencias/${id}`,

        /**
         * GET /api/frecuencias/conductor/{id} - Obtener frecuencias por conductor
         * Params: id (number) - ID del conductor
         * Response 200: Array de frecuencias asignadas al conductor
         */
        GET_BY_CONDUCTOR: (id: number) => `${API_BASE_URL}/frecuencias/conductor/${id}`,

        /**
         * GET /api/frecuencias/bus/{id} - Obtener frecuencias por bus
         * Params: id (number) - ID del bus
         * Response 200: Array de frecuencias asignadas al bus
         */
        GET_BY_BUS: (id: number) => `${API_BASE_URL}/frecuencias/bus/${id}`,

        /**
         * GET /api/frecuencias/origen/{origen} - Obtener frecuencias por ciudad de origen
         * Params: origen (string) - Ciudad de origen (ej: "Quito", "Guayaquil")
         * Response 200: Array de frecuencias que salen desde esa ciudad
         */
        GET_BY_ORIGEN: (origen: string) => `${API_BASE_URL}/frecuencias/origen/${origen}`,

        /**
         * GET /api/frecuencias/destino/{destino} - Obtener frecuencias por ciudad de destino
         * Params: destino (string) - Ciudad de destino (ej: "Quito", "Guayaquil")
         * Response 200: Array de frecuencias que llegan a esa ciudad
         */
        GET_BY_DESTINO: (destino: string) => `${API_BASE_URL}/frecuencias/destino/${destino}`,

        /**
         * GET /api/frecuencias/provincia/{provincia} - Obtener frecuencias por provincia
         * Params: provincia (string) - Provincia de destino (ej: "Guayas", "Pichincha")
         * Response 200: Array de frecuencias hacia esa provincia
         */
        GET_BY_PROVINCIA: (provincia: string) =>
            `${API_BASE_URL}/frecuencias/provincia/${provincia}`,
    },
    // Paradas
    PARADAS: {
        /**
         * POST /api/paradas - Crear una nueva parada
         * Body: {
         *   ciudad: string,              // Nombre de la ciudad (requerido)
         *   activo: boolean              // Estado activo/inactivo de la parada (requerido)
         * }
         * Response 201: Parada creada con los mismos datos
         * Response 400: Datos inválidos (ciudad duplicada, campos requeridos faltantes)
         */
        CREATE: `${API_BASE_URL}/paradas`,

        /**
         * GET /api/paradas - Obtener todas las paradas
         * Response 200: Array de paradas con estructura {ciudad, activo}
         */
        GET_ALL: `${API_BASE_URL}/paradas`,

        /**
         * GET /api/paradas/{id} - Obtener una parada por ID
         * Params: id (number) - ID de la parada
         * Response 200: Objeto parada {ciudad, activo}
         * Response 404: Parada no encontrada
         */
        GET_BY_ID: (id: number) => `${API_BASE_URL}/paradas/${id}`,

        /**
         * PUT /api/paradas/{id} - Actualizar una parada
         * Params: id (number) - ID de la parada a actualizar
         * Body: {
         *   ciudad?: string,             // Nombre de la ciudad
         *   activo?: boolean             // Estado activo/inactivo
         * }
         * Response 200: Datos actualizados
         * Response 404: Parada no encontrada
         */
        UPDATE: (id: number) => `${API_BASE_URL}/paradas/${id}`,

        /**
         * DELETE /api/paradas/{id} - Eliminar una parada
         * Params: id (number) - ID de la parada a eliminar
         * Response 200: Confirmación de eliminación
         * Response 404: Parada no encontrada
         */
        DELETE: (id: number) => `${API_BASE_URL}/paradas/${id}`,

        /**
         * GET /api/paradas/ciudad/{ciudad} - Buscar paradas por ciudad (coincidencia exacta)
         * Params: ciudad (string) - Nombre exacto de la ciudad (ej: "Ambato")
         * Response 200: Array de paradas que coinciden exactamente con el nombre
         * Uso: Para búsquedas precisas donde se conoce el nombre completo
         */
        GET_BY_CIUDAD: (ciudad: string) => `${API_BASE_URL}/paradas/ciudad/${ciudad}`,

        /**
         * GET /api/paradas/buscar/{ciudad} - Buscar paradas por ciudad (coincidencia parcial)
         * Params: ciudad (string) - Nombre parcial o completo de la ciudad (ej: "Amb", "Ambato")
         * Response 200: Array de paradas que contienen el texto buscado
         * Uso: Para búsquedas con autocompletado o cuando no se conoce el nombre exacto
         */ BUSCAR: (ciudad: string) => `${API_BASE_URL}/paradas/buscar/${ciudad}`,
    },
    // Rutas
    RUTAS: {
        /**
         * POST /api/rutas - Crear una nueva ruta
         * Body: {
         *   frecuencia_id: number,        // ID de la frecuencia asociada (requerido)
         *   parada_id: number,           // ID de la parada en esta ruta (requerido)
         *   orden: number,               // Orden secuencial de la parada en la ruta (requerido)
         *   distancia_parada: number,    // Distancia en km desde el origen hasta esta parada (decimal)
         *   precio_parada: number,       // Precio del viaje hasta esta parada (decimal)
         *   tiempo_parada: string,       // Tiempo estimado de llegada a esta parada (formato HH:MM)
         *   activo: boolean              // Estado activo/inactivo de esta ruta
         * }
         * Response 201: Ruta creada con todos los datos
         * Response 400: Datos inválidos (frecuencia/parada inexistente, orden duplicado)
         */
        CREATE: `${API_BASE_URL}/rutas`,

        /**
         * GET /api/rutas - Obtener todas las rutas
         * Response 200: Array de rutas con estructura completa
         * Incluye: frecuencia_id, parada_id, orden, distancia, precio, tiempo, activo
         */
        GET_ALL: `${API_BASE_URL}/rutas`,

        /**
         * GET /api/rutas/{id} - Obtener una ruta por ID
         * Params: id (number) - ID de la ruta
         * Response 200: Objeto ruta con todos los campos
         * Response 404: Ruta no encontrada
         */
        GET_BY_ID: (id: number) => `${API_BASE_URL}/rutas/${id}`,

        /**
         * PUT /api/rutas/{id} - Actualizar una ruta
         * Params: id (number) - ID de la ruta a actualizar
         * Body: {
         *   frecuencia_id?: number,      // ID de la frecuencia
         *   parada_id?: number,         // ID de la parada
         *   orden?: number,             // Orden en la secuencia
         *   distancia_parada?: number,  // Distancia en km
         *   precio_parada?: number,     // Precio hasta esta parada
         *   tiempo_parada?: string,     // Tiempo estimado (HH:MM)
         *   activo?: boolean            // Estado activo/inactivo
         * }
         * Response 200: Datos actualizados
         * Response 404: Ruta no encontrada
         */
        UPDATE: (id: number) => `${API_BASE_URL}/rutas/${id}`,

        /**
         * DELETE /api/rutas/{id} - Eliminar una ruta
         * Params: id (number) - ID de la ruta a eliminar
         * Response 200: Confirmación de eliminación
         * Response 404: Ruta no encontrada
         */
        DELETE: (id: number) => `${API_BASE_URL}/rutas/${id}`,

        /**
         * GET /api/rutas/frecuencia/{id} - Obtener rutas por frecuencia
         * Params: id (number) - ID de la frecuencia
         * Response 200: Array de rutas ordenadas por 'orden' para esa frecuencia
         * Uso: Para obtener el itinerario completo de una frecuencia específica
         * Incluye: todas las paradas de la ruta con distancias, precios y tiempos
         */
        GET_BY_FRECUENCIA: (id: number) => `${API_BASE_URL}/rutas/frecuencia/${id}`,

        /**
         * GET /api/rutas/parada/{id} - Obtener rutas por parada
         * Params: id (number) - ID de la parada
         * Response 200: Array de rutas que incluyen esta parada
         * Uso: Para saber qué frecuencias pasan por una parada específica
         * Incluye: información de precios y tiempos desde diferentes orígenes
         */ GET_BY_PARADA: (id: number) => `${API_BASE_URL}/rutas/parada/${id}`,
    },
    // Comprobantes de Pago
    COMPROBANTES_PAGO: {
        /**
         * POST /api/comprobantes-pagos - Crear un nuevo comprobante de pago
         * Content-Type: multipart/form-data
         * Body: {
         *   file: File,                  // Imagen del comprobante (jpg, jpeg, png) - requerido
         *   boleto_id: number,          // ID del boleto asociado al comprobante - requerido
         *   usuario_id: number,         // ID del usuario que realiza el pago - requerido
         *   estado: string,             // Estado del comprobante ("pendiente", "aprobado", "rechazado")
         *   comentarios?: string        // Comentarios adicionales (opcional)
         * }
         * Response 201: {
         *   boleto_id: number,
         *   usuario_id: number,
         *   url_comprobante: string,    // URL de la imagen subida al storage
         *   estado: string,
         *   comentarios: string
         * }
         * Response 400: El archivo debe ser una imagen en formato jpg, jpeg o png
         * Response 404: Se necesita al menos una imagen del comprobante de pago
         */
        CREATE: `${API_BASE_URL}/comprobantes-pagos`,

        /**
         * GET /api/comprobantes-pagos - Obtener todos los comprobantes de pago
         * Response 200: Array de comprobantes con estructura completa
         * Incluye: boleto_id, usuario_id, url_comprobante, estado, comentarios
         */
        GET_ALL: `${API_BASE_URL}/comprobantes-pagos`,

        /**
         * GET /api/comprobantes-pagos/{id} - Obtener un comprobante de pago por ID
         * Params: id (number) - ID del comprobante de pago
         * Response 200: Objeto comprobante con todos los campos
         * Response 404: Comprobante de pago no encontrado
         */
        GET_BY_ID: (id: number) => `${API_BASE_URL}/comprobantes-pagos/${id}`,

        /**
         * PUT /api/comprobantes-pagos/{id} - Actualizar un comprobante de pago
         * Params: id (number) - ID del comprobante de pago a actualizar
         * Body: {
         *   estado?: string,            // Estado: "pendiente", "aprobado", "rechazado"
         *   comentarios?: string,       // Comentarios de revisión/verificación
         *   url_comprobante?: string    // URL del comprobante (si se reemplaza)
         * }
         * Response 200: Datos actualizados
         * Response 404: Comprobante de pago no encontrado
         * Uso: Principalmente para aprobar/rechazar comprobantes por parte de administradores
         */
        UPDATE: (id: number) => `${API_BASE_URL}/comprobantes-pagos/${id}`,

        /**
         * DELETE /api/comprobantes-pagos/{id} - Eliminar un comprobante de pago
         * Params: id (number) - ID del comprobante de pago a eliminar
         * Response 200: Confirmación de eliminación
         * Response 404: Comprobante de pago no encontrado
         */
        DELETE: (id: number) => `${API_BASE_URL}/comprobantes-pagos/${id}`,

        /**
         * GET /api/comprobantes-pagos/user/{id} - Obtener comprobantes de pago por usuario
         * Params: id (number) - ID del usuario
         * Response 200: Array de comprobantes de pago del usuario específico
         * Uso: Para que los usuarios vean el historial de sus comprobantes subidos
         */
        GET_BY_USER: (id: number) => `${API_BASE_URL}/comprobantes-pagos/user/${id}`,

        /**
         * GET /api/comprobantes-pagos/total - Obtener el total de comprobantes de pago
         * Response 200: { total: number } - Cantidad total de comprobantes en el sistema
         * Uso: Para estadísticas y dashboards administrativos
         */ GET_TOTAL: `${API_BASE_URL}/comprobantes-pagos/total`,
    },
    // Facturas
    FACTURAS: {
        /**
         * GET /api/factura - Obtener todas las facturas
         * Response 200: Array de facturas con estructura completa
         * Estructura de respuesta: {
         *   id: number,                  // ID único de la factura
         *   numeroFactura: string,       // Número secuencial (ej: "FACT-001-2025")
         *   fechaEmision: string,        // Fecha ISO (ej: "2025-01-01T15:30:00Z")
         *   subtotal: number,            // Subtotal sin IVA (decimal)
         *   iva: number,                 // Valor del IVA (decimal)
         *   total: number,               // Total con IVA incluido (decimal)
         *   pdfUrl: string,              // URL del PDF en storage
         *   reserva: object,             // Objeto reserva asociada
         *   reservaId: number,           // ID de la reserva
         *   usuario: object,             // Objeto usuario asociado
         *   usuarioId: number,           // ID del usuario
         *   cooperativa: {               // Datos completos de la cooperativa
         *     cooperativa_id: number,
         *     nombre: string,
         *     telefono: string,
         *     correo: string,
         *     logo: string,              // URL del logo
         *     ruc: string,               // RUC de la cooperativa
         *     direccion: string
         *   },
         *   cooperativaId: number,       // ID de la cooperativa
         *   boleto: object,              // Objeto boleto asociado
         *   boleto_id: number            // ID del boleto
         * }[]
         */
        GET_ALL: `${API_BASE_URL}/factura`,

        /**
         * GET /api/factura/usuario/{id} - Obtener facturas por usuario
         * Params: id (number) - ID del usuario
         * Response 200: Array de facturas del usuario específico con estructura completa
         * Response 404: Usuario no encontrado
         * Uso: Para que los usuarios accedan a su historial de facturas
         * Incluye: misma estructura que GET_ALL pero filtrada por usuario
         */
        GET_BY_USER: (id: number) => `${API_BASE_URL}/factura/usuario/${id}`,
    },
    // Boletos
    BOLETOS: {
        /**
         * POST /api/boletos - Crear un nuevo boleto
         * Body: {
         *   total: number,               // Precio total del boleto (decimal)
         *   cantidad_asientos: number,   // Número de asientos reservados
         *   estado: string,              // Estado del boleto ("pendiente", "confirmado", "cancelado")
         *   url_imagen_qr: string,       // URL de la imagen QR en storage
         *   asientos: string             // Números de asientos separados por coma (ej: "15,16")
         * }
         * Response 201: Boleto creado con todos los datos
         * Response 400: Datos inválidos (asientos ocupados, formato incorrecto)
         */
        CREATE: `${API_BASE_URL}/boletos`,

        /**
         * GET /api/boletos - Obtener todos los boletos
         * Response 200: Array de boletos con estructura completa
         * Incluye: total, cantidad_asientos, estado, url_imagen_qr, asientos
         */
        GET_ALL: `${API_BASE_URL}/boletos`,

        /**
         * GET /api/boletos/{id} - Obtener un boleto por ID
         * Params: id (number) - ID del boleto
         * Response 200: Objeto boleto con todos los campos
         * Response 404: Boleto no encontrado
         */
        GET_BY_ID: (id: number) => `${API_BASE_URL}/boletos/${id}`,

        /**
         * PATCH /api/boletos/{id} - Actualizar un boleto
         * Params: id (number) - ID del boleto a actualizar
         * Body: {
         *   total?: number,              // Precio total
         *   cantidad_asientos?: number,  // Número de asientos
         *   estado?: string,             // Estado del boleto
         *   url_imagen_qr?: string,      // URL del código QR
         *   asientos?: string            // Lista de asientos
         * }
         * Response 200: Datos actualizados
         * Response 404: Boleto no encontrado
         * Uso: Para cambiar estado, actualizar QR, modificar asientos
         */
        UPDATE: (id: number) => `${API_BASE_URL}/boletos/${id}`,

        /**
         * DELETE /api/boletos/{id} - Eliminar un boleto
         * Params: id (number) - ID del boleto a eliminar
         * Response 200: Confirmación de eliminación
         * Response 404: Boleto no encontrado
         */
        DELETE: (id: number) => `${API_BASE_URL}/boletos/${id}`,

        /**
         * GET /api/boletos/usuario/{userId} - Obtener boletos por usuario
         * Params: userId (number) - ID del usuario
         * Response 200: Array de boletos del usuario específico
         * Uso: Para que los usuarios vean su historial de boletos
         */
        GET_BY_USER: (userId: string) => `${API_BASE_URL}/boletos/usuario/${userId}`,

        /**
         * GET /api/boletos/reserva/{reservaId} - Obtener boletos por reserva
         * Params: reservaId (number) - ID de la reserva
         * Response 200: Array de boletos asociados a la reserva específica
         * Uso: Para ver todos los boletos de una reserva grupal o familiar
         */
        GET_BY_RESERVA: (reservaId: number) => `${API_BASE_URL}/boletos/reserva/${reservaId}`,
    },
    // Reservas
    RESERVAS: {
        /**
         * POST /api/reserva - Crear una nueva reserva
         * Body: {
         *   usuario_id: number,              // ID del usuario que hace la reserva (requerido)
         *   asiento_id: number,              // ID del asiento específico (requerido)
         *   frecuencia_id: number,           // ID de la frecuencia de viaje (requerido)
         *   boleto_id: number,               // ID del boleto asociado (requerido)
         *   nombre_pasajero: string,         // Nombre completo del pasajero (requerido)
         *   metodo_pago: string,             // Método de pago ("presencial", "transferencia", "tarjeta")
         *   identificacion_pasajero: string, // Cédula o documento del pasajero (requerido)
         *   estado: string,                  // Estado de la reserva ("pendiente", "confirmada", "cancelada")
         *   fecha_viaje: string,             // Fecha del viaje en formato ISO (requerido)
         *   hora_viaje: string,              // Hora del viaje en formato HH:MM (requerido)
         *   precio: number,                  // Precio de la reserva (decimal)
         *   destino_reserva: string          // Ciudad de destino (requerido)
         * }
         * Response 201: Reserva creada con todos los datos
         * Response 400: Datos inválidos (asiento ocupado, frecuencia inexistente)
         */
        CREATE: `${API_BASE_URL}/reserva`,

        /**
         * GET /api/reserva - Obtener todas las reservas
         * Response 200: Array de reservas con estructura completa
         * Incluye: usuario_id, asiento_id, frecuencia_id, boleto_id, datos del pasajero,
         *          método de pago, estado, fecha/hora de viaje, precio, destino
         */
        GET_ALL: `${API_BASE_URL}/reserva`,

        /**
         * GET /api/reserva/{id} - Obtener una reserva por ID
         * Params: id (number) - ID de la reserva
         * Response 200: Objeto reserva con todos los campos
         * Response 404: Reserva no encontrada
         */
        GET_BY_ID: (id: number) => `${API_BASE_URL}/reserva/${id}`,

        /**
         * PUT /api/reserva/{id} - Actualizar una reserva
         * Params: id (number) - ID de la reserva a actualizar
         * Body: {
         *   usuario_id?: number,             // ID del usuario
         *   asiento_id?: number,             // ID del asiento
         *   frecuencia_id?: number,          // ID de la frecuencia
         *   boleto_id?: number,              // ID del boleto
         *   nombre_pasajero?: string,        // Nombre del pasajero
         *   metodo_pago?: string,            // Método de pago
         *   identificacion_pasajero?: string,// Documento del pasajero
         *   estado?: string,                 // Estado de la reserva
         *   fecha_viaje?: string,            // Fecha del viaje
         *   hora_viaje?: string,             // Hora del viaje
         *   precio?: number,                 // Precio de la reserva
         *   destino_reserva?: string         // Destino del viaje
         * }
         * Response 200: Datos actualizados
         * Response 404: Reserva no encontrada
         * Uso: Cambiar estado, modificar datos del pasajero, actualizar asiento
         */
        UPDATE: (id: number) => `${API_BASE_URL}/reserva/${id}`,

        /**
         * DELETE /api/reserva/{id} - Eliminar una reserva
         * Params: id (number) - ID de la reserva a eliminar
         * Response 200: Confirmación de eliminación
         * Response 404: Reserva no encontrada
         */
        DELETE: (id: number) => `${API_BASE_URL}/reserva/${id}`,

        /**
         * GET /api/reserva/usuario/{userId} - Obtener reservas por usuario
         * Params: userId (number) - ID del usuario
         * Response 200: Array de reservas del usuario específico
         * Uso: Para que los usuarios vean su historial de reservas
         * Incluye: reservas activas, completadas y canceladas
         */
        GET_BY_USER: (userId: string) => `${API_BASE_URL}/reserva/usuario/${userId}`,
    },
    // Cooperativas
    COOPERATIVAS: {
        /**
         * POST /api/cooperativa - Crear una nueva cooperativa
         * Content-Type: multipart/form-data
         * Body: {
         *   nombre: string,              // Nombre de la cooperativa (requerido)
         *   telefono: string,            // Número de teléfono (requerido)
         *   correo: string,              // Correo electrónico (requerido)
         *   ruc: string,                 // RUC de la cooperativa (requerido, formato ecuatoriano)
         *   direccion: string,           // Dirección física (requerido)
         *   logo: File                   // Logo de la cooperativa (jpg, jpeg, png, máx. 8MB)
         * }
         * Response 201: {
         *   nombre: string,
         *   telefono: string,
         *   correo: string,
         *   logo: string,                // URL del logo subido al storage
         *   ruc: string,
         *   direccion: string
         * }
         * Response 400: Error en la validación del logo o datos de la cooperativa
         */
        CREATE: `${API_BASE_URL}/cooperativa`,

        /**
         * GET /api/cooperativa - Obtener todas las cooperativas
         * Response 200: Array de cooperativas con estructura completa
         * Incluye: nombre, telefono, correo, logo (URL), ruc, direccion
         */
        GET_ALL: `${API_BASE_URL}/cooperativa`,

        /**
         * GET /api/cooperativa/{id} - Obtener una cooperativa por ID
         * Params: id (number) - ID de la cooperativa
         * Response 200: Objeto cooperativa con todos los campos
         * Response 404: Cooperativa no encontrada
         */
        GET_BY_ID: (id: number) => `${API_BASE_URL}/cooperativa/${id}`,

        /**
         * PATCH /api/cooperativa/{id} - Actualizar una cooperativa
         * Content-Type: multipart/form-data
         * Params: id (number) - ID de la cooperativa a actualizar
         * Body: {
         *   nombre?: string,             // Nombre de la cooperativa
         *   telefono?: string,           // Número de teléfono
         *   correo?: string,             // Correo electrónico
         *   ruc?: string,                // RUC de la cooperativa
         *   direccion?: string,          // Dirección física
         *   logo?: File                  // Nuevo logo (jpg, jpeg, png, máx. 8MB)
         * }
         * Response 200: Datos actualizados
         * Response 404: Cooperativa no encontrada
         * Nota: Método PATCH permite actualización parcial de campos
         */
        UPDATE: (id: number) => `${API_BASE_URL}/cooperativa/${id}`,

        /**
         * DELETE /api/cooperativa/{id} - Eliminar una cooperativa
         * Params: id (number) - ID de la cooperativa a eliminar
         * Response 200: Confirmación de eliminación
         * Response 404: Cooperativa no encontrada
         * Nota: Eliminación permanente, verificar que no tenga buses/frecuencias asociadas
         */
        DELETE: (id: number) => `${API_BASE_URL}/cooperativa/${id}`,
    },
};
