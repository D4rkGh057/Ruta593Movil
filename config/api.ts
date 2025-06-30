// Configuración base de la API
export const IP = "192.168.100.115";
export const API_BASE_URL = `http://${IP}:3000/api`;

// Endpoints de la API
export const API_ENDPOINTS = {
    // Usuarios
    USUARIOS: {
        /**
         * POST /api/user - Crear un nuevo usuario
         * Body: {
         *   identificacion: string,        // Número de identificación (requerido)
         *   primer_nombre: string,         // Primer nombre del usuario (requerido)
         *   segundo_nombre?: string,       // Segundo nombre del usuario (opcional)
         *   primer_apellido: string,       // Primer apellido del usuario (requerido)
         *   segundo_apellido?: string,     // Segundo apellido del usuario (opcional)
         *   correo: string,               // Correo electrónico del usuario (requerido)
         *   password: string,             // Contraseña del usuario (requerido)
         *   telefono?: string,            // Número de teléfono (opcional, formato: +593987654321)
         *   direccion?: string            // Dirección del usuario (opcional)
         * }
         * Response 201: Usuario creado exitosamente con los mismos datos
         */
        CREATE: `${API_BASE_URL}/user`,

        /**
         * GET /api/user - Obtener todos los usuarios
         * Response 200: Lista de usuarios - Array de usuarios con todos los campos
         */
        GET_ALL: `${API_BASE_URL}/user`,

        /**
         * GET /api/user/{id} - Obtener un usuario por ID
         * Params: id (string) - ID del usuario
         * Response 200: Usuario encontrado - Objeto usuario con todos los campos
         * Response 404: Usuario no encontrado
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/user/${id}`,

        /**
         * PUT /api/user/{id} - Actualizar un usuario
         * Params: id (string) - ID del usuario a actualizar
         * Body: {
         *   rol?: string                   // Rol del usuario (ej: "usuario_normal", "admin")
         *   // Puede incluir otros campos actualizables
         * }
         * Response 200: Usuario actualizado exitosamente - Datos actualizados
         * Response 404: Usuario no encontrado
         */
        UPDATE: (id: string) => `${API_BASE_URL}/user/${id}`,

        /**
         * DELETE /api/user/{id} - Eliminar un usuario
         * Params: id (string) - ID del usuario a eliminar
         * Response 200: Usuario eliminado exitosamente - Confirmación de eliminación
         * Response 404: Usuario no encontrado
         */
        DELETE: (id: string) => `${API_BASE_URL}/user/${id}`,

        /**
         * GET /api/user/search/{name} - Buscar usuario por nombre o apellido
         * Params: name (string) - Nombre o apellido a buscar
         * Response 200: Usuarios encontrados - Array de usuarios que coinciden con la búsqueda
         */
        SEARCH_BY_NAME: (name: string) => `${API_BASE_URL}/user/search/${name}`,

        /**
         * GET /api/user/cedula/{cedula} - Buscar usuario por cédula
         * Params: cedula (string) - Número de cédula/identificación
         * Response 200: Usuario encontrado - Objeto usuario encontrado
         * Response 404: Usuario no encontrado
         */
        GET_BY_CEDULA: (cedula: string) => `${API_BASE_URL}/user/cedula/${cedula}`,
    },
    // Autenticación
    AUTH: {
        /**
         * POST /api/auth/login - Iniciar sesión
         * Body: {
         *   correo: string,               // Correo electrónico del usuario (requerido)
         *   password: string              // Contraseña del usuario (requerido)
         * }
         * Response 200: Usuario autenticado correctamente - {
         *   token: string,                // JWT token para autenticación (ej: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
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
         * Response 201: Usuario registrado correctamente - {
         *   message: string               // Mensaje de confirmación "Usuario registrado correctamente"
         * }
         * Response 400: Datos inválidos (correo duplicado, campos requeridos faltantes, etc.)
         */
        REGISTER: `${API_BASE_URL}/auth/register`,

        /**
         * GET /api/auth/profile - Obtener perfil del usuario actual
         * Headers: Authorization: Bearer {token}  // JWT token requerido
         * Response 200: Perfil del usuario - {
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
         *   files?: File[],                  // Array de imágenes del bus (opcional)
         *   id_estructura_bus: string        // ID de la estructura del bus (requerido)
         * }
         * Response 201: Bus creado exitosamente - Bus creado con todos los datos + files array
         * Response 400: Datos inválidos o formato de imagen incorrecto
         */
        CREATE: `${API_BASE_URL}/buses`,

        /**
         * GET /api/buses - Obtener todos los buses
         * Response 200: Lista de buses - Array de buses con todos los campos
         * Estructura de respuesta: {
         *   numero_bus: number,
         *   placa: string,
         *   chasis: string,
         *   carroceria: string,
         *   total_asientos_normales: number,
         *   total_asientos_vip: number,
         *   files: Array<string|null>,      // URLs de imágenes o null
         *   id_estructura_bus: string       // ID de la estructura del bus
         * }[]
         */
        GET_ALL: `${API_BASE_URL}/buses`,

        /**
         * GET /api/buses/{uid} - Obtener un bus por UID
         * Params: uid (string) - UID del bus
         * Response 200: Bus encontrado - Objeto bus con todos los campos
         * Response 404: Bus no encontrado
         */
        GET_BY_ID: (uid: string) => `${API_BASE_URL}/buses/${uid}`,

        /**
         * PUT /api/buses/{id} - Actualizar un bus
         * Params: id (string) - ID del bus a actualizar
         * Body: {
         *   activo?: boolean                 // Estado activo/inactivo del bus
         *   // Puede incluir otros campos actualizables como numero_bus, placa, etc.
         * }
         * Response 200: Bus actualizado exitosamente - Datos actualizados
         * Response 404: Bus no encontrado
         */
        UPDATE: (id: string) => `${API_BASE_URL}/buses/${id}`,

        /**
         * DELETE /api/buses/{id} - Eliminar un bus
         * Params: id (string) - ID del bus a eliminar
         * Response 200: Bus eliminado exitosamente - Confirmación de eliminación
         * Response 404: Bus no encontrado
         */
        DELETE: (id: string) => `${API_BASE_URL}/buses/${id}`,

        /**
         * GET /api/buses/search/{placa} - Buscar bus por placa
         * Params: placa (string) - Número de placa del bus (formato ecuatoriano: ABC-1234)
         * Response 200: Bus encontrado - Objeto bus encontrado con todos los campos
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
         *   bus_id: string,              // ID del bus asignado (requerido)
         *   conductor_id: string,        // ID del conductor asignado (requerido)
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
         * Response 201: Frecuencia creada exitosamente - Frecuencia creada con todos los datos
         */
        CREATE: `${API_BASE_URL}/frecuencias`,

        /**
         * GET /api/frecuencias - Obtener todas las frecuencias
         * Response 200: Lista de frecuencias - Array de frecuencias con estructura completa
         */
        GET_ALL: `${API_BASE_URL}/frecuencias`,

        /**
         * GET /api/frecuencias/{id} - Obtener una frecuencia por ID
         * Params: id (string) - ID de la frecuencia
         * Response 200: Frecuencia encontrada - Objeto frecuencia con todos los campos
         * Response 404: Frecuencia no encontrada
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/frecuencias/${id}`,

        /**
         * PUT /api/frecuencias/{id} - Actualizar una frecuencia
         * Params: id (string) - ID de la frecuencia a actualizar
         * Body: {
         *   id?: number,                 // ID de la frecuencia
         *   nombre?: string,             // Nombre de la frecuencia
         *   descripcion?: string,        // Descripción de la frecuencia
         *   // Puede incluir otros campos como nombre_frecuencia, bus_id, etc.
         * }
         * Response 200: Frecuencia actualizada exitosamente - Datos actualizados
         * Response 404: Frecuencia no encontrada
         */
        UPDATE: (id: string) => `${API_BASE_URL}/frecuencias/${id}`,

        /**
         * DELETE /api/frecuencias/{id} - Eliminar una frecuencia
         * Params: id (string) - ID de la frecuencia a eliminar
         * Response 200: Frecuencia eliminada exitosamente - Confirmación de eliminación
         * Response 404: Frecuencia no encontrada
         */
        DELETE: (id: string) => `${API_BASE_URL}/frecuencias/${id}`,

        /**
         * GET /api/frecuencias/conductor/{id} - Obtener frecuencias por conductor
         * Params: id (string) - ID del conductor
         * Response 200: Frecuencias encontradas - Array de frecuencias asignadas al conductor
         */
        GET_BY_CONDUCTOR: (id: string) => `${API_BASE_URL}/frecuencias/conductor/${id}`,

        /**
         * GET /api/frecuencias/bus/{id} - Obtener frecuencias por bus
         * Params: id (string) - ID del bus
         * Response 200: Frecuencias encontradas - Array de frecuencias asignadas al bus
         */
        GET_BY_BUS: (id: string) => `${API_BASE_URL}/frecuencias/bus/${id}`,

        /**
         * GET /api/frecuencias/origen/{origen} - Obtener frecuencias por ciudad de origen
         * Params: origen (string) - Ciudad de origen (ej: "Quito", "Guayaquil")
         * Response 200: Frecuencias encontradas - Array de frecuencias que salen desde esa ciudad
         */
        GET_BY_ORIGEN: (origen: string) => `${API_BASE_URL}/frecuencias/origen/${origen}`,

        /**
         * GET /api/frecuencias/destino/{destino} - Obtener frecuencias por ciudad de destino
         * Params: destino (string) - Ciudad de destino (ej: "Quito", "Guayaquil")
         * Response 200: Frecuencias encontradas - Array de frecuencias que llegan a esa ciudad
         */
        GET_BY_DESTINO: (destino: string) => `${API_BASE_URL}/frecuencias/destino/${destino}`,

        /**
         * GET /api/frecuencias/provincia/{provincia} - Obtener frecuencias por provincia
         * Params: provincia (string) - Provincia de destino (ej: "Guayas", "Pichincha")
         * Response 200: Frecuencias encontradas - Array de frecuencias hacia esa provincia
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
         * Response 201: Parada creada exitosamente - Parada creada con los mismos datos
         * Response 400: Datos inválidos (ciudad duplicada, campos requeridos faltantes)
         */
        CREATE: `${API_BASE_URL}/paradas`,

        /**
         * GET /api/paradas - Obtener todas las paradas
         * Response 200: Lista de paradas - Array de paradas con estructura {ciudad, activo}
         */
        GET_ALL: `${API_BASE_URL}/paradas`,

        /**
         * GET /api/paradas/{id} - Obtener una parada por ID
         * Params: id (string) - ID de la parada
         * Response 200: Parada encontrada - Objeto parada {ciudad, activo}
         * Response 404: Parada no encontrada
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/paradas/${id}`,

        /**
         * PUT /api/paradas/{id} - Actualizar una parada
         * Params: id (string) - ID de la parada a actualizar
         * Body: {
         *   ciudad?: string,             // Nombre de la ciudad (opcional)
         *   activo?: boolean             // Estado activo/inactivo (opcional)
         * }
         * Response 200: Parada actualizada exitosamente - Datos actualizados
         * Response 404: Parada no encontrada
         */
        UPDATE: (id: string) => `${API_BASE_URL}/paradas/${id}`,

        /**
         * DELETE /api/paradas/{id} - Eliminar una parada
         * Params: id (string) - ID de la parada a eliminar
         * Response 200: Parada eliminada exitosamente - Confirmación de eliminación
         * Response 404: Parada no encontrada
         */
        DELETE: (id: string) => `${API_BASE_URL}/paradas/${id}`,

        /**
         * GET /api/paradas/ciudad/{ciudad} - Buscar paradas por ciudad (coincidencia exacta)
         * Params: ciudad (string) - Nombre de la ciudad (ej: "Ambato")
         * Response 200: Paradas encontradas - Array de paradas que coinciden exactamente con el nombre
         * Uso: Para búsquedas precisas donde se conoce el nombre completo
         */
        GET_BY_CIUDAD: (ciudad: string) => `${API_BASE_URL}/paradas/ciudad/${ciudad}`,

        /**
         * GET /api/paradas/buscar/{ciudad} - Buscar paradas por ciudad (coincidencia parcial)
         * Params: ciudad (string) - Nombre parcial o completo de la ciudad (ej: "Amb", "Ambato")
         * Response 200: Paradas encontradas - Array de paradas que contienen el texto buscado
         * Uso: Para búsquedas con autocompletado o cuando no se conoce el nombre exacto
         */ BUSCAR: (ciudad: string) => `${API_BASE_URL}/paradas/buscar/${ciudad}`,
    },
    // Rutas
    RUTAS: {
        /**
         * POST /api/rutas - Crear una nueva ruta
         * Body: {
         *   frecuencia_id: string,       // ID de la frecuencia asociada (requerido, ej: "1")
         *   parada_id: string,          // ID de la parada en esta ruta (requerido, ej: "uuid-string")
         *   orden: number,              // Orden secuencial de la parada en la ruta (requerido, ej: 1)
         *   distancia_parada: number,   // Distancia en km desde el origen hasta esta parada (decimal, ej: 25.5)
         *   precio_parada: number,      // Precio del viaje hasta esta parada (decimal, ej: 5.5)
         *   tiempo_parada: string,      // Tiempo estimado de llegada a esta parada (formato HH:MM, ej: "10:30")
         *   activo: boolean             // Estado activo/inactivo de esta ruta (ej: true)
         * }
         * Response 201: Ruta creada exitosamente - {frecuencia_id, parada_id, orden, distancia_parada, precio_parada, tiempo_parada, activo}
         * Response 400: Datos inválidos (frecuencia/parada inexistente, orden duplicado)
         */
        CREATE: `${API_BASE_URL}/rutas`,

        /**
         * GET /api/rutas - Obtener todas las rutas
         * Response 200: Array de rutas con estructura completa
         * Incluye: frecuencia_id, parada_id, orden, distancia_parada, precio_parada, tiempo_parada, activo
         */
        GET_ALL: `${API_BASE_URL}/rutas`,

        /**
         * GET /api/rutas/{id} - Obtener una ruta por ID
         * Params: id (string) - ID de la ruta
         * Response 200: Objeto ruta con todos los campos - {frecuencia_id, parada_id, orden, distancia_parada, precio_parada, tiempo_parada, activo}
         * Response 404: Ruta no encontrada
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/rutas/${id}`,

        /**
         * PUT /api/rutas/{id} - Actualizar una ruta
         * Params: id (string) - ID de la ruta a actualizar
         * Body: {
         *   frecuencia_id?: string,      // ID de la frecuencia (opcional, ej: "1")
         *   parada_id?: string,         // ID de la parada (opcional, ej: "uuid-string")
         *   orden?: number,             // Orden en la secuencia (opcional, ej: 2)
         *   distancia_parada?: number,  // Distancia en km (opcional, ej: 30.0)
         *   precio_parada?: number,     // Precio hasta esta parada (opcional, ej: 6.0)
         *   tiempo_parada?: string,     // Tiempo estimado (opcional, formato HH:MM, ej: "11:00")
         *   activo?: boolean            // Estado activo/inactivo (opcional, ej: false)
         * }
         * Response 200: Ruta actualizada exitosamente - Datos actualizados de la ruta
         * Response 404: Ruta no encontrada
         */
        UPDATE: (id: string) => `${API_BASE_URL}/rutas/${id}`,

        /**
         * DELETE /api/rutas/{id} - Eliminar una ruta
         * Params: id (string) - ID de la ruta a eliminar
         * Response 200: Ruta eliminada exitosamente - Confirmación de eliminación
         * Response 404: Ruta no encontrada
         */
        DELETE: (id: string) => `${API_BASE_URL}/rutas/${id}`,

        /**
         * GET /api/rutas/frecuencia/{id} - Obtener rutas por frecuencia
         * Params: id (string) - ID de la frecuencia
         * Response 200: Array de rutas ordenadas por 'orden' para esa frecuencia
         * Uso: Para obtener el itinerario completo de una frecuencia específica
         * Incluye: todas las paradas de la ruta con distancias, precios y tiempos
         */
        GET_BY_FRECUENCIA: (id: string) => `${API_BASE_URL}/rutas/frecuencia/${id}`,

        /**
         * GET /api/rutas/parada/{id} - Obtener rutas por parada
         * Params: id (string) - ID de la parada
         * Response 200: Array de rutas que incluyen esta parada
         * Uso: Para saber qué frecuencias pasan por una parada específica
         * Incluye: información de precios y tiempos desde diferentes orígenes
         */
        GET_BY_PARADA: (id: string) => `${API_BASE_URL}/rutas/parada/${id}`,
    },
    // Comprobantes de Pago
    COMPROBANTES_PAGO: {
        /**
         * POST /api/comprobantes-pagos - Crear un nuevo comprobante de pago
         * Content-Type: multipart/form-data
         * Body: {
         *   file: File,                  // Imagen del comprobante de pago (jpg, jpeg, png) - requerido
         *   boleto_id: string,          // ID del boleto asociado al comprobante (requerido, ej: "uuid-string")
         *   usuario_id: string,         // ID del usuario que realiza el pago (requerido, ej: "uuid-string")
         *   estado: string,             // Estado del comprobante (requerido, ej: "pendiente")
         *   comentarios: string         // Comentarios adicionales (opcional, ej: "Pago realizado mediante transferencia bancaria")
         * }
         * Response 201: Comprobante de pago creado exitosamente - {
         *   boleto_id: "uuid-string",
         *   usuario_id: "uuid-string",
         *   url_comprobante: "https://storage.googleapis.com/comprobantes/imagen.jpg",
         *   estado: "pendiente",
         *   comentarios: "Pago realizado mediante transferencia bancaria"
         * }
         * Response 400: El archivo debe ser una imagen en formato jpg, jpeg o png
         * Response 404: Se necesita al menos una imagen del comprobante de pago
         */
        CREATE: `${API_BASE_URL}/comprobantes-pagos`,

        /**
         * GET /api/comprobantes-pagos - Obtener todos los comprobantes de pago
         * Response 200: Lista de comprobantes de pago - Array de comprobantes con estructura completa
         * Incluye: boleto_id, usuario_id, url_comprobante, estado, comentarios
         * Ejemplo: [{
         *   boleto_id: "uuid-string",
         *   usuario_id: "uuid-string",
         *   url_comprobante: "https://storage.googleapis.com/comprobantes/imagen.jpg",
         *   estado: "pendiente",
         *   comentarios: "Pago realizado mediante transferencia bancaria"
         * }]
         */
        GET_ALL: `${API_BASE_URL}/comprobantes-pagos`,

        /**
         * GET /api/comprobantes-pagos/{id} - Obtener un comprobante de pago por ID
         * Params: id (string) - ID del comprobante de pago
         * Response 200: Comprobante de pago encontrado - {
         *   boleto_id: "uuid-string",
         *   usuario_id: "uuid-string",
         *   url_comprobante: "https://storage.googleapis.com/comprobantes/imagen.jpg",
         *   estado: "pendiente",
         *   comentarios: "Pago realizado mediante transferencia bancaria"
         * }
         * Response 404: Comprobante de pago no encontrado
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/comprobantes-pagos/${id}`,

        /**
         * PUT /api/comprobantes-pagos/{id} - Actualizar un comprobante de pago
         * Params: id (string) - ID del comprobante de pago a actualizar
         * Body: {
         *   estado?: string,            // Estado: "aprobado", "pendiente", "rechazado" (ej: "aprobado")
         *   comentarios?: string,       // Comentarios de revisión/verificación (ej: "Comprobante verificado correctamente")
         *   url_comprobante?: string    // URL del comprobante (ej: "https://storage.googleapis.com/comprobantes/imagen.jpg")
         * }
         * Response 200: Comprobante de pago actualizado exitosamente - {
         *   estado: "aprobado",
         *   comentarios: "Comprobante verificado correctamente",
         *   url_comprobante: "https://storage.googleapis.com/comprobantes/imagen.jpg"
         * }
         * Response 404: Comprobante de pago no encontrado
         * Uso: Principalmente para aprobar/rechazar comprobantes por parte de administradores
         */
        UPDATE: (id: string) => `${API_BASE_URL}/comprobantes-pagos/${id}`,

        /**
         * DELETE /api/comprobantes-pagos/{id} - Eliminar un comprobante de pago
         * Params: id (string) - ID del comprobante de pago a eliminar
         * Response 200: Comprobante de pago eliminado exitosamente - Confirmación de eliminación
         * Response 404: Comprobante de pago no encontrado
         */
        DELETE: (id: string) => `${API_BASE_URL}/comprobantes-pagos/${id}`,

        /**
         * GET /api/comprobantes-pagos/user/{id} - Obtener comprobantes de pago por usuario
         * Params: id (string) - ID del usuario
         * Response 200: Comprobantes de pago del usuario - Array de comprobantes del usuario específico
         * Uso: Para que los usuarios vean el historial de sus comprobantes subidos
         * Ejemplo: [{
         *   boleto_id: "uuid-string",
         *   usuario_id: "uuid-string",
         *   url_comprobante: "https://storage.googleapis.com/comprobantes/imagen.jpg",
         *   estado: "pendiente",
         *   comentarios: "Pago realizado mediante transferencia bancaria"
         * }]
         */
        GET_BY_USER: (id: string) => `${API_BASE_URL}/comprobantes-pagos/user/${id}`,

        /**
         * GET /api/comprobantes-pagos/total - Obtener el total de comprobantes de pago
         * Response 200: Total de comprobantes de pago - { total: number }
         * Uso: Para estadísticas y dashboards administrativos
         * Ejemplo: { total: 10 }
         */
        GET_TOTAL: `${API_BASE_URL}/comprobantes-pagos/total`,
    },
    // Facturas
    FACTURAS: {
        /**
         * GET /api/factura - Obtener todas las facturas
         * Response 200: Lista de todas las facturas - Array de facturas con estructura completa
         * Estructura de respuesta: [{
         *   factura_id: string,          // ID único de la factura (ej: "uuid-string")
         *   numero_factura: string,      // Número secuencial (ej: "FACT-001-2025")
         *   fechaEmision: string,        // Fecha ISO (ej: "2025-01-01T15:30:00Z")
         *   subtotal: number,            // Subtotal sin IVA (decimal, ej: 25.5)
         *   iva: number,                 // Valor del IVA (decimal, ej: 3.06)
         *   total: number,               // Total con IVA incluido (decimal, ej: 28.56)
         *   pdfUrl: string,              // URL del PDF en storage (ej: "https://storage.googleapis.com/facturas/FACT-001-2025.pdf")
         *   reserva: object,             // Objeto reserva asociada
         *   reservaId: string,           // ID de la reserva (ej: "1")
         *   usuario: object,             // Objeto usuario asociado
         *   usuarioId: string,           // ID del usuario (ej: "1")
         *   cooperativa: {               // Datos completos de la cooperativa
         *     cooperativa_id: string,    // ID de la cooperativa (ej: "uuid-string")
         *     nombre: string,            // Nombre (ej: "Cooperativa Trans Express")
         *     telefono: string,          // Teléfono (ej: "0987654321")
         *     correo: string,            // Correo (ej: "info@transexpress.com")
         *     logo: string,              // URL del logo (ej: "https://storage.googleapis.com/cooperativas/logo-transexpress.png")
         *     ruc: string,               // RUC de la cooperativa (ej: "1234567890001")
         *     direccion: string          // Dirección (ej: "Av. Principal 123 y Secundaria")
         *   },
         *   cooperativaId: string,       // ID de la cooperativa (ej: "1")
         *   boleto: object,              // Objeto boleto asociado
         *   boleto_id: string            // ID del boleto (ej: "1")
         * }]
         */
        GET_ALL: `${API_BASE_URL}/factura`,

        /**
         * GET /api/factura/usuario/{id} - Obtener facturas por usuario
         * Params: id (number) - ID del usuario
         * Response 200: Lista de facturas del usuario - Array de facturas del usuario específico con estructura completa
         * Response 404: Usuario no encontrado
         * Uso: Para que los usuarios accedan a su historial de facturas
         * Incluye: misma estructura que GET_ALL pero filtrada por usuario
         * Estructura de respuesta: [{
         *   factura_id: string,          // ID único de la factura (ej: "uuid-string")
         *   numero_factura: string,      // Número secuencial (ej: "FACT-001-2025")
         *   fechaEmision: string,        // Fecha ISO (ej: "2025-01-01T15:30:00Z")
         *   subtotal: number,            // Subtotal sin IVA (decimal, ej: 25.5)
         *   iva: number,                 // Valor del IVA (decimal, ej: 3.06)
         *   total: number,               // Total con IVA incluido (decimal, ej: 28.56)
         *   pdfUrl: string,              // URL del PDF (ej: "https://storage.googleapis.com/facturas/FACT-001-2025.pdf")
         *   reserva: object,             // Objeto reserva asociada
         *   reservaId: string,           // ID de la reserva (ej: "1")
         *   usuario: object,             // Objeto usuario asociado
         *   usuarioId: string,           // ID del usuario (ej: "1")
         *   cooperativa: {               // Datos completos de la cooperativa
         *     cooperativa_id: string,    // ID de la cooperativa (ej: "uuid-string")
         *     nombre: string,            // Nombre (ej: "Cooperativa Trans Express")
         *     telefono: string,          // Teléfono (ej: "0987654321")
         *     correo: string,            // Correo (ej: "info@transexpress.com")
         *     logo: string,              // URL del logo (ej: "https://storage.googleapis.com/cooperativas/logo-transexpress.png")
         *     ruc: string,               // RUC (ej: "1234567890001")
         *     direccion: string          // Dirección (ej: "Av. Principal 123 y Secundaria")
         *   },
         *   cooperativaId: string,       // ID de la cooperativa (ej: "1")
         *   boleto: object,              // Objeto boleto asociado
         *   boleto_id: string            // ID del boleto (ej: "1")
         * }]
         */
        GET_BY_USER: (id: number) => `${API_BASE_URL}/factura/usuario/${id}`,
    },
    //Descuentos
    DESCUENTOS: {
        /**
         * POST /api/descuentos - Crear un nuevo descuento
         * Body: {
         *   nombre: string,              // Nombre del descuento (requerido, ej: "Descuento Estudiantil")
         *   porcentaje: number,          // Porcentaje de descuento (requerido, ej: 15)
         *   vida_util: string,           // Fecha límite de validez en formato ISO (requerido, ej: "2024-12-31T23:59:59.000Z")
         *   link_descarga: string,       // URL de descarga o enlace relacionado (requerido, ej: "https://ejemplo.com/descarga")
         *   codigo_promocional: string,  // Código promocional único (requerido, ej: "PROMO2024")
         *   mensaje: string,             // Mensaje descriptivo del descuento (requerido, ej: "¡Aprovecha este descuento especial!")
         *   activo: boolean              // Estado activo/inactivo del descuento (requerido, ej: true)
         * }
         * Response 201: Descuento creado exitosamente - {
         *   nombre: "Descuento Estudiantil",
         *   porcentaje: 15,
         *   vida_util: "2024-12-31T23:59:59.000Z",
         *   link_descarga: "https://ejemplo.com/descarga",
         *   codigo_promocional: "PROMO2024",
         *   mensaje: "¡Aprovecha este descuento especial!",
         *   activo: true
         * }
         * Response 400: Datos inválidos (campos requeridos faltantes, código promocional duplicado, fecha inválida)
         */
        CREATE: `${API_BASE_URL}/descuentos`,

        /**
         * GET /api/descuentos - Obtener todos los descuentos
         * Response 200: Lista de todos los descuentos - Array de descuentos con estructura completa
         * Incluye: nombre, porcentaje, vida_util, link_descarga, codigo_promocional, mensaje, activo
         * Ejemplo: [{
         *   nombre: "Descuento Estudiantil",
         *   porcentaje: 15,
         *   vida_util: "2024-12-31T23:59:59.000Z",
         *   link_descarga: "https://ejemplo.com/descarga",
         *   codigo_promocional: "PROMO2024",
         *   mensaje: "¡Aprovecha este descuento especial!",
         *   activo: true
         * }]
         */
        GET_ALL: `${API_BASE_URL}/descuentos`,

        /**
         * GET /api/descuentos/{id} - Obtener un descuento por ID
         * Params: id (string) - ID del descuento
         * Response 200: Descuento encontrado - {
         *   nombre: "Descuento Estudiantil",
         *   porcentaje: 15,
         *   vida_util: "2024-12-31T23:59:59.000Z",
         *   link_descarga: "https://ejemplo.com/descarga",
         *   codigo_promocional: "PROMO2024",
         *   mensaje: "¡Aprovecha este descuento especial!",
         *   activo: true
         * }
         * Response 404: Descuento no encontrado
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/descuentos/${id}`,

        /**
         * PATCH /api/descuentos/{id} - Actualizar un descuento por ID
         * Params: id (string) - ID del descuento a actualizar
         * Body: {
         *   nombre?: string,             // Nombre del descuento (opcional, ej: "Descuento Premium")
         *   porcentaje?: number,         // Porcentaje de descuento (opcional, ej: 20)
         *   vida_util?: string,          // Fecha límite de validez (opcional, ej: "2025-06-30T23:59:59.000Z")
         *   link_descarga?: string,      // URL de descarga (opcional, ej: "https://nuevo.ejemplo.com/descarga")
         *   codigo_promocional?: string, // Código promocional (opcional, ej: "PREMIUM2025")
         *   mensaje?: string,            // Mensaje descriptivo (opcional, ej: "Descuento actualizado")
         *   activo?: boolean             // Estado activo/inactivo (opcional, ej: false)
         * }
         * Response 200: Descuento actualizado exitosamente - Datos actualizados del descuento
         * Response 404: Descuento no encontrado
         * Response 400: Error en validación (código promocional duplicado, fecha inválida)
         * Uso: Para modificar detalles del descuento existente
         * Principalmente para cambiar porcentaje, extender vigencia o actualizar mensaje
         */
        UPDATE: (id: string) => `${API_BASE_URL}/descuentos/${id}`,

        /**
         * DELETE /api/descuentos/{id} - Eliminar un descuento por ID
         * Params: id (string) - ID del descuento a eliminar
         * Response 200: Descuento eliminado exitosamente - Confirmación de eliminación
         * Response 404: Descuento no encontrado
         */
        DELETE: (id: string) => `${API_BASE_URL}/descuentos/${id}`,
    },

    // Boletos
    BOLETOS: {
        /**
         * POST /api/boletos - Crear un nuevo boleto
         * Body: {
         *   total: number,               // Precio total del boleto (decimal, ej: 25.5)
         *   cantidad_asientos: number,   // Número de asientos reservados (ej: 2)
         *   estado: string,              // Estado del boleto (ej: "pagado", "pendiente", "cancelado")
         *   url_imagen_qr: string,       // URL de la imagen QR en storage (ej: "https://storage.googleapis.com/boletos/qr-123.png")
         *   asientos: string             // Números de asientos separados por coma (ej: "15,16")
         * }
         * Response 201: Boleto creado exitosamente - {
         *   total: 25.5,
         *   cantidad_asientos: 2,
         *   estado: "pagado",
         *   url_imagen_qr: "https://storage.googleapis.com/boletos/qr-123.png",
         *   asientos: "15,16"
         * }
         * Response 400: Datos inválidos para crear el boleto
         */
        CREATE: `${API_BASE_URL}/boletos`,

        /**
         * GET /api/boletos - Obtener todos los boletos
         * Response 200: Lista de todos los boletos - Array de boletos con estructura completa
         * Incluye: total, cantidad_asientos, estado, url_imagen_qr, asientos
         * Ejemplo: [{
         *   total: 25.5,
         *   cantidad_asientos: 2,
         *   estado: "pagado",
         *   url_imagen_qr: "https://storage.googleapis.com/boletos/qr-123.png",
         *   asientos: "15,16"
         * }]
         */
        GET_ALL: `${API_BASE_URL}/boletos`,

        /**
         * GET /api/boletos/{uid} - Obtener un boleto por UID
         * Params: uid (string) - UID del boleto
         * Response 200: Boleto encontrado - {
         *   total: 25.5,
         *   cantidad_asientos: 2,
         *   estado: "pagado",
         *   url_imagen_qr: "https://storage.googleapis.com/boletos/qr-123.png",
         *   asientos: "15,16"
         * }
         * Response 404: Boleto no encontrado
         */
        GET_BY_ID: (uid: string) => `${API_BASE_URL}/boletos/${uid}`,

        /**
         * PATCH /api/boletos/{uid} - Actualizar un boleto
         * Params: uid (string) - UID del boleto a actualizar
         * Body: {
         *   total?: number,              // Precio total (opcional, ej: 28.0)
         *   cantidad_asientos?: number,  // Número de asientos (opcional, ej: 3)
         *   estado?: string,             // Estado del boleto (opcional, ej: "confirmado")
         *   url_imagen_qr?: string,      // URL del código QR (opcional, ej: "https://storage.googleapis.com/boletos/qr-456.png")
         *   asientos?: string            // Lista de asientos (opcional, ej: "10,11,12")
         * }
         * Response 200: Boleto actualizado exitosamente - Datos actualizados del boleto
         * Response 404: Boleto no encontrado
         * Uso: Para cambiar estado, actualizar QR, modificar asientos
         */
        UPDATE: (uid: string) => `${API_BASE_URL}/boletos/${uid}`,

        /**
         * DELETE /api/boletos/{uid} - Eliminar un boleto
         * Params: uid (string) - UID del boleto a eliminar
         * Response 200: Boleto eliminado exitosamente - Confirmación de eliminación
         * Response 404: Boleto no encontrado
         */
        DELETE: (uid: string) => `${API_BASE_URL}/boletos/${uid}`,

        /**
         * GET /api/boletos/usuario/{userId} - Obtener boletos por usuario
         * Params: userId (string) - ID del usuario
         * Response 200: Lista de boletos del usuario - Array de boletos del usuario específico
         * Response 404: No se encontraron boletos para el usuario
         * Uso: Para que los usuarios vean su historial de boletos
         * Ejemplo: [{
         *   total: 25.5,
         *   cantidad_asientos: 2,
         *   estado: "pagado",
         *   url_imagen_qr: "https://storage.googleapis.com/boletos/qr-123.png",
         *   asientos: "15,16"
         * }]
         */
        GET_BY_USER: (userId: string) => `${API_BASE_URL}/boletos/usuario/${userId}`,

        /**
         * GET /api/boletos/reserva/{reservaId} - Obtener boletos por reserva
         * Params: reservaId (string) - ID de la reserva
         * Response 200: Lista de boletos de la reserva - Array de boletos asociados a la reserva específica
         * Response 404: No se encontraron boletos para la reserva
         * Uso: Para ver todos los boletos de una reserva grupal o familiar
         * Ejemplo: [{
         *   total: 25.5,
         *   cantidad_asientos: 2,
         *   estado: "pagado",
         *   url_imagen_qr: "https://storage.googleapis.com/boletos/qr-123.png",
         *   asientos: "15,16"
         * }]
         */
        GET_BY_RESERVA: (reservaId: string) => `${API_BASE_URL}/boletos/reserva/${reservaId}`,
    },
    // Reservas
    RESERVAS: {
        /**
         * POST /api/reserva - Crear una nueva reserva
         * Body: {
         *   usuario_id: string,              // ID del usuario que hace la reserva (requerido, ej: "uuid-string")
         *   asiento_id: string,              // ID del asiento específico (requerido, ej: "uuid-string")
         *   frecuencia_id: string,           // ID de la frecuencia de viaje (requerido, ej: "1")
         *   nombre_pasajero: string,         // Nombre completo del pasajero (requerido, ej: "Juan Pérez")
         *   metodo_pago: string,             // Método de pago (requerido, ej: "presencial")
         *   identificacion_pasajero: string, // Cédula o documento del pasajero (requerido, ej: "1234567890")
         *   estado: string,                  // Estado de la reserva (requerido, ej: "pendiente")
         *   fecha_viaje: string,             // Fecha del viaje en formato ISO (requerido, ej: "2025-01-15T00:00:00.000Z")
         *   hora_viaje: string,              // Hora del viaje en formato HH:MM (requerido, ej: "14:30")
         *   precio: number,                  // Precio de la reserva (decimal, ej: 25.5)
         *   destino_reserva: string,         // Ciudad de destino (requerido, ej: "Bogotá")
         *   codigo_descuento: string         // Código de descuento (opcional, ej: "PROMO2024")
         * }
         * Response 201: Reserva creada exitosamente - {
         *   usuario_id: "uuid-string",
         *   asiento_id: "uuid-string",
         *   frecuencia_id: "1",
         *   nombre_pasajero: "Juan Pérez",
         *   metodo_pago: "presencial",
         *   identificacion_pasajero: "1234567890",
         *   estado: "pendiente",
         *   fecha_viaje: "2025-01-15T00:00:00.000Z",
         *   hora_viaje: "14:30",
         *   precio: 25.5,
         *   destino_reserva: "Bogotá",
         *   codigo_descuento: "PROMO2024"
         * }
         * Response 400: Datos inválidos (asiento ocupado, frecuencia inexistente)
         */
        CREATE: `${API_BASE_URL}/reserva`,

        /**
         * GET /api/reserva - Obtener todas las reservas
         * Response 200: Lista de todas las reservas - Array de reservas con estructura completa
         * Incluye: usuario_id, asiento_id, frecuencia_id, nombre_pasajero, metodo_pago,
         *          identificacion_pasajero, estado, fecha_viaje, hora_viaje, precio, destino_reserva, codigo_descuento
         * Ejemplo: [{
         *   usuario_id: "uuid-string",
         *   asiento_id: "uuid-string",
         *   frecuencia_id: "1",
         *   nombre_pasajero: "Juan Pérez",
         *   metodo_pago: "presencial",
         *   identificacion_pasajero: "1234567890",
         *   estado: "pendiente",
         *   fecha_viaje: "2025-01-15T00:00:00.000Z",
         *   hora_viaje: "14:30",
         *   precio: 25.5,
         *   destino_reserva: "Bogotá",
         *   codigo_descuento: "PROMO2024"
         * }]
         */
        GET_ALL: `${API_BASE_URL}/reserva`,

        /**
         * GET /api/reserva/{id} - Obtener una reserva por ID
         * Params: id (number) - ID de la reserva
         * Response 200: Reserva encontrada - {
         *   usuario_id: "uuid-string",
         *   asiento_id: "uuid-string",
         *   frecuencia_id: "1",
         *   nombre_pasajero: "Juan Pérez",
         *   metodo_pago: "presencial",
         *   identificacion_pasajero: "1234567890",
         *   estado: "pendiente",
         *   fecha_viaje: "2025-01-15T00:00:00.000Z",
         *   hora_viaje: "14:30",
         *   precio: 25.5,
         *   destino_reserva: "Bogotá",
         *   codigo_descuento: "PROMO2024"
         * }
         * Response 404: Reserva no encontrada
         */
        GET_BY_ID: (id: number) => `${API_BASE_URL}/reserva/${id}`,

        /**
         * PUT /api/reserva/{id} - Actualizar una reserva
         * Params: id (number) - ID de la reserva a actualizar
         * Body: {
         *   usuario_id?: string,             // ID del usuario (opcional, ej: "uuid-string")
         *   asiento_id?: string,             // ID del asiento (opcional, ej: "uuid-string")
         *   frecuencia_id?: string,          // ID de la frecuencia (opcional, ej: "1")
         *   nombre_pasajero?: string,        // Nombre del pasajero (opcional, ej: "Juan Pérez")
         *   metodo_pago?: string,            // Método de pago (opcional, ej: "presencial")
         *   identificacion_pasajero?: string,// Documento del pasajero (opcional, ej: "1234567890")
         *   estado?: string,                 // Estado de la reserva (opcional, ej: "confirmada")
         *   fecha_viaje?: string,            // Fecha del viaje (opcional, ej: "2025-01-15T00:00:00.000Z")
         *   hora_viaje?: string,             // Hora del viaje (opcional, ej: "14:30")
         *   precio?: number,                 // Precio de la reserva (opcional, ej: 25.5)
         *   destino_reserva?: string,        // Destino del viaje (opcional, ej: "Bogotá")
         *   codigo_descuento?: string        // Código de descuento (opcional, ej: "PROMO2024")
         * }
         * Response 200: Reserva actualizada exitosamente - Datos actualizados de la reserva
         * Response 404: Reserva no encontrada
         * Uso: Cambiar estado, modificar datos del pasajero, actualizar asiento, aplicar descuentos
         */
        UPDATE: (id: number) => `${API_BASE_URL}/reserva/${id}`,

        /**
         * DELETE /api/reserva/{id} - Eliminar una reserva
         * Params: id (number) - ID de la reserva a eliminar
         * Response 200: Reserva eliminada exitosamente - Confirmación de eliminación
         * Response 404: Reserva no encontrada
         */
        DELETE: (id: number) => `${API_BASE_URL}/reserva/${id}`,

        /**
         * GET /api/reserva/usuario/{userId} - Obtener reservas por usuario
         * Params: userId (number) - ID del usuario
         * Response 200: Lista de reservas del usuario - Array de reservas del usuario específico
         * Uso: Para que los usuarios vean su historial de reservas
         * Incluye: reservas activas, completadas y canceladas
         * Ejemplo: [{
         *   usuario_id: "uuid-string",
         *   asiento_id: "uuid-string",
         *   frecuencia_id: "1",
         *   nombre_pasajero: "Juan Pérez",
         *   metodo_pago: "presencial",
         *   identificacion_pasajero: "1234567890",
         *   estado: "pendiente",
         *   fecha_viaje: "2025-01-15T00:00:00.000Z",
         *   hora_viaje: "14:30",
         *   precio: 25.5,
         *   destino_reserva: "Bogotá",
         *   codigo_descuento: "PROMO2024"
         * }]
         */
        GET_BY_USER: (userId: number) => `${API_BASE_URL}/reserva/usuario/${userId}`,
    },
    // Viajes
    VIAJES: {
        /**
         * POST /api/viajes - Crear un nuevo viaje
         * Body: {
         *   fecha_salida: string,            // Fecha y hora de salida en formato ISO (requerido, ej: "2025-06-05T08:00:00.000Z")
         *   num_asientos_disponibles: number,// Número de asientos disponibles (requerido, ej: 30)
         *   num_asientos_ocupados: number,   // Número de asientos ocupados (requerido, ej: 10)
         *   id_frecuencia: object           // Objeto con frecuencia_id (requerido, ej: {"frecuencia_id": 1})
         * }
         * Response 201: Viaje creado exitosamente - {
         *   fecha_salida: "2025-06-05T08:00:00.000Z",
         *   num_asientos_disponibles: 30,
         *   num_asientos_ocupados: 10,
         *   id_frecuencia: {
         *     frecuencia_id: 1
         *   }
         * }
         * Response 400: Datos inválidos (campos requeridos faltantes, formato de fecha incorrecto)
         * Response 404: Frecuencia no encontrada
         * Response 409: Frecuencia no está activa
         * Response 500: Error interno del servidor
         */
        CREATE: `${API_BASE_URL}/viajes`,

        /**
         * GET /api/viajes - Obtener todos los viajes
         * Response 200: Lista de todos los viajes - Array de viajes con estructura completa
         * Incluye: fecha_salida, num_asientos_disponibles, num_asientos_ocupados, id_frecuencia
         * Ejemplo: [{
         *   fecha_salida: "2025-06-05T08:00:00.000Z",
         *   num_asientos_disponibles: 30,
         *   num_asientos_ocupados: 10,
         *   id_frecuencia: {
         *     frecuencia_id: 1
         *   }
         * }]
         */
        GET_ALL: `${API_BASE_URL}/viajes`,

        /**
         * GET /api/viajes/{id} - Obtener un viaje por ID
         * Params: id (string) - ID del viaje
         * Response 200: Viaje encontrado - {
         *   fecha_salida: "2025-06-05T08:00:00.000Z",
         *   num_asientos_disponibles: 30,
         *   num_asientos_ocupados: 10,
         *   id_frecuencia: {
         *     frecuencia_id: 1
         *   }
         * }
         * Response 404: Viaje no encontrado
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/viajes/${id}`,

        /**
         * PATCH /api/viajes/{id} - Actualizar un viaje
         * Params: id (string) - ID del viaje a actualizar
         * Body: {
         *   fecha_salida?: string,           // Fecha y hora de salida (opcional, ej: "2025-06-05T08:00:00.000Z")
         *   num_asientos_disponibles?: number,// Número de asientos disponibles (opcional, ej: 28)
         *   num_asientos_ocupados?: number,  // Número de asientos ocupados (opcional, ej: 12)
         *   id_frecuencia?: object,         // Objeto con frecuencia_id (opcional, ej: {"frecuencia_id": 2})
         *   id_viaje?: string               // ID del viaje (opcional, ej: "1")
         * }
         * Response 200: Viaje actualizado exitosamente - Datos actualizados del viaje
         * Response 404: Viaje no encontrado
         * Uso: Para actualizar información del viaje, disponibilidad de asientos, cambiar frecuencia
         */
        UPDATE: (id: string) => `${API_BASE_URL}/viajes/${id}`,

        /**
         * DELETE /api/viajes/{id} - Eliminar un viaje
         * Params: id (string) - ID del viaje a eliminar
         * Response 200: Viaje eliminado exitosamente - Confirmación de eliminación
         * Response 404: Viaje no encontrado
         */
        DELETE: (id: string) => `${API_BASE_URL}/viajes/${id}`,

        /**
         * GET /api/viajes/fcha/{fecha} - Buscar viajes por fecha de salida
         * Params: fecha (string) - Fecha de salida en formato YYYY-MM-DD (ej: "2025-06-05")
         * Response 200: Viajes encontrados - Array de viajes para la fecha especificada
         * Response 404: No se encontraron viajes para la fecha especificada
         * Uso: Para buscar viajes disponibles en una fecha específica
         * Ejemplo: [{
         *   fecha_salida: "2025-06-05T08:00:00.000Z",
         *   num_asientos_disponibles: 30,
         *   num_asientos_ocupados: 10,
         *   id_frecuencia: {
         *     frecuencia_id: 1
         *   }
         * }]
         */
        GET_BY_FECHA: (fecha: string) => `${API_BASE_URL}/viajes/fcha/${fecha}`,
    },
    // Cooperativas
    COOPERATIVAS: {
        /**
         * POST /api/cooperativa - Crear una nueva cooperativa
         * Content-Type: multipart/form-data
         * Body: {
         *   nombre: string,              // Nombre de la cooperativa (requerido, ej: "Cooperativa Trans Express")
         *   telefono: string,            // Número de teléfono (requerido, ej: "0987654321")
         *   correo: string,              // Correo electrónico (requerido, ej: "info@transexpress.com")
         *   ruc: string,                 // RUC de la cooperativa (requerido, formato ecuatoriano, ej: "1234567890001")
         *   direccion: string,           // Dirección física (requerido, ej: "Av. Principal 123 y Secundaria")
         *   logo: File                   // Logo de la cooperativa (imagen jpg, jpeg o png, máx. 8MB)
         * }
         * Response 201: Cooperativa creada exitosamente - {
         *   nombre: "Cooperativa Trans Express",
         *   telefono: "0987654321",
         *   correo: "info@transexpress.com",
         *   logo: "https://storage.googleapis.com/cooperativas/logo-transexpress.png",
         *   ruc: "1234567890001",
         *   direccion: "Av. Principal 123 y Secundaria"
         * }
         * Response 400: Error en la validación del logo o datos de la cooperativa (formato de archivo incorrecto, tamaño excedido, RUC inválido)
         */
        CREATE: `${API_BASE_URL}/cooperativa`,

        /**
         * GET /api/cooperativa - Obtener todas las cooperativas
         * Response 200: Lista de todas las cooperativas - Array de cooperativas con estructura completa
         * Incluye: nombre, telefono, correo, logo (URL), ruc, direccion
         * Ejemplo: [{
         *   nombre: "Cooperativa Trans Express",
         *   telefono: "0987654321",
         *   correo: "info@transexpress.com",
         *   logo: "https://storage.googleapis.com/cooperativas/logo-transexpress.png",
         *   ruc: "1234567890001",
         *   direccion: "Av. Principal 123 y Secundaria"
         * }]
         */
        GET_ALL: `${API_BASE_URL}/cooperativa`,

        /**
         * GET /api/cooperativa/{id} - Obtener una cooperativa por ID
         * Params: id (number) - ID de la cooperativa
         * Response 200: Cooperativa encontrada - {
         *   nombre: "Cooperativa Trans Express",
         *   telefono: "0987654321",
         *   correo: "info@transexpress.com",
         *   logo: "https://storage.googleapis.com/cooperativas/logo-transexpress.png",
         *   ruc: "1234567890001",
         *   direccion: "Av. Principal 123 y Secundaria"
         * }
         * Response 404: Cooperativa no encontrada
         */
        GET_BY_ID: (id: number) => `${API_BASE_URL}/cooperativa/${id}`,

        /**
         * PATCH /api/cooperativa/{id} - Actualizar una cooperativa
         * Content-Type: multipart/form-data
         * Params: id (number) - ID de la cooperativa a actualizar
         * Body: {
         *   nombre?: string,             // Nombre de la cooperativa (opcional, ej: "Cooperativa Trans Express")
         *   telefono?: string,           // Número de teléfono (opcional, ej: "0987654321")
         *   correo?: string,             // Correo electrónico (opcional, ej: "contacto@transexpress.com")
         *   ruc?: string,                // RUC de la cooperativa (opcional, ej: "1234567890001")
         *   direccion?: string,          // Dirección física (opcional, ej: "Av. Principal 123 y Secundaria")
         *   logo?: File                  // Nuevo logo (opcional, jpg, jpeg, png, máx. 8MB)
         * }
         * Response 200: Cooperativa actualizada exitosamente - Datos actualizados de la cooperativa
         * Response 404: Cooperativa no encontrada
         * Response 400: Error en validación (formato de archivo, tamaño, RUC inválido)
         * Nota: Método PATCH permite actualización parcial de campos
         */
        UPDATE: (id: number) => `${API_BASE_URL}/cooperativa/${id}`,

        /**
         * DELETE /api/cooperativa/{id} - Eliminar una cooperativa
         * Params: id (number) - ID de la cooperativa a eliminar
         * Response 200: Cooperativa eliminada exitosamente - Confirmación de eliminación
         * Response 404: Cooperativa no encontrada
         * Response 400: No se puede eliminar, tiene buses o frecuencias asociadas
         * Nota: Eliminación permanente, verificar que no tenga buses/frecuencias asociadas
         */
        DELETE: (id: number) => `${API_BASE_URL}/cooperativa/${id}`,
    },
    // Clientes-Cooperativas
    CLIENTES_COOPERATIVAS: {
        /**
         * POST /api/clientes-cooperativas - Crear una nueva relación cliente-cooperativa
         * Body: {
         *   cooperativa_id: string,      // ID de la cooperativa (requerido, ej: "coop123")
         *   dni_cliente: string          // DNI/Cédula del cliente (requerido, ej: "1234567890")
         * }
         * Response 201: Relación cliente-cooperativa creada exitosamente - {
         *   cooperativa_id: "coop123",
         *   dni_cliente: "1234567890"
         * }
         * Response 400: Datos inválidos (cooperativa inexistente, DNI inválido, relación duplicada)
         * Uso: Para asociar un cliente con una cooperativa específica
         */
        CREATE: `${API_BASE_URL}/clientes-cooperativas`,

        /**
         * GET /api/clientes-cooperativas - Obtener todas las relaciones cliente-cooperativa
         * Response 200: Lista de relaciones cliente-cooperativa - Array de relaciones con estructura completa
         * Incluye: cooperativa_id, dni_cliente
         * Ejemplo: [{
         *   cooperativa_id: "coop123",
         *   dni_cliente: "1234567890"
         * }]
         * Uso: Para obtener todas las asociaciones entre clientes y cooperativas
         */
        GET_ALL: `${API_BASE_URL}/clientes-cooperativas`,

        /**
         * GET /api/clientes-cooperativas/{id} - Obtener una relación cliente-cooperativa por ID
         * Params: id (string) - ID de la relación cliente-cooperativa
         * Response 200: Relación cliente-cooperativa encontrada - {
         *   cooperativa_id: "coop123",
         *   dni_cliente: "1234567890"
         * }
         * Response 404: Relación cliente-cooperativa no encontrada
         * Uso: Para consultar una asociación específica entre cliente y cooperativa
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/clientes-cooperativas/${id}`,

        /**
         * PUT /api/clientes-cooperativas/{id} - Actualizar una relación cliente-cooperativa por ID
         * Params: id (number) - ID de la relación cliente-cooperativa
         * Body: {
         *   cooperativa_id?: string,     // ID de la cooperativa (opcional, ej: "coop456")
         *   dni_cliente?: string         // DNI/Cédula del cliente (opcional, ej: "0987654321")
         * }
         * Response 200: Relación cliente-cooperativa actualizada - {
         *   cooperativa_id: "coop456",
         *   dni_cliente: "0987654321"
         * }
         * Response 404: Relación cliente-cooperativa no encontrada
         * Response 400: Datos inválidos (cooperativa inexistente, DNI inválido)
         * Uso: Para modificar la asociación entre un cliente y cooperativa
         */
        UPDATE: (id: number) => `${API_BASE_URL}/clientes-cooperativas/${id}`,

        /**
         * DELETE /api/clientes-cooperativas/{id} - Eliminar una relación cliente-cooperativa por ID
         * Params: id (number) - ID de la relación cliente-cooperativa
         * Response 200: Relación cliente-cooperativa eliminada - Confirmación de eliminación
         * Response 404: Relación cliente-cooperativa no encontrada
         * Uso: Para desasociar un cliente de una cooperativa
         */
        DELETE: (id: number) => `${API_BASE_URL}/clientes-cooperativas/${id}`,
    },
    // Estructura-Buses
    ESTRUCTURA_BUSES: {
        /**
         * POST /api/estructura-buses - Crear una nueva estructura de bus
         * Body: {
         *   nombre: string,              // Nombre de la estructura (requerido, ej: "Bus Escolar")
         *   distribucion: string,        // Distribución de asientos (requerido, ej: "2-2")
         *   id_cooperativa: number       // ID de la cooperativa (requerido, ej: 1)
         * }
         * Response 201: Estructura de bus creada exitosamente - {
         *   nombre: "Bus Escolar",
         *   distribucion: "2-2",
         *   id_cooperativa: 1
         * }
         * Response 400: Datos inválidos (cooperativa inexistente, distribución inválida, nombre duplicado)
         * Uso: Para definir la configuración de asientos de diferentes tipos de buses
         */
        CREATE: `${API_BASE_URL}/estructura-buses`,

        /**
         * GET /api/estructura-buses - Obtener todas las estructuras de buses
         * Response 200: Lista de estructuras de buses - Array de estructuras con estructura completa
         * Incluye: nombre, distribucion, id_cooperativa
         * Ejemplo: [{
         *   nombre: "Bus Escolar",
         *   distribucion: "2-2",
         *   id_cooperativa: 1
         * }]
         * Uso: Para obtener todas las configuraciones de estructuras de buses disponibles
         */
        GET_ALL: `${API_BASE_URL}/estructura-buses`,

        /**
         * GET /api/estructura-buses/{id} - Obtener una estructura de bus por ID
         * Params: id (string) - ID de la estructura de bus
         * Response 200: Estructura de bus encontrada - {
         *   nombre: "Bus Escolar",
         *   distribucion: "2-2",
         *   id_cooperativa: 1
         * }
         * Response 404: Estructura de bus no encontrada
         * Uso: Para consultar una configuración específica de estructura de bus
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/estructura-buses/${id}`,

        /**
         * PUT /api/estructura-buses/{id} - Actualizar una estructura de bus por ID
         * Params: id (string) - ID de la estructura de bus
         * Body: {
         *   nombre?: string,             // Nombre de la estructura (opcional, ej: "Bus Ejecutivo")
         *   distribucion?: string,       // Distribución de asientos (opcional, ej: "2-1")
         *   id_cooperativa?: number      // ID de la cooperativa (opcional, ej: 2)
         * }
         * Response 200: Estructura de bus actualizada - {
         *   nombre: "Bus Ejecutivo",
         *   distribucion: "2-1",
         *   id_cooperativa: 2
         * }
         * Response 404: Estructura de bus no encontrada
         * Response 400: Datos inválidos (cooperativa inexistente, distribución inválida)
         * Uso: Para modificar la configuración de una estructura de bus existente
         */
        UPDATE: (id: string) => `${API_BASE_URL}/estructura-buses/${id}`,

        /**
         * DELETE /api/estructura-buses/{id} - Eliminar una estructura de bus por ID
         * Params: id (string) - ID de la estructura de bus
         * Response 200: Estructura de bus eliminada - Confirmación de eliminación
         * Response 404: Estructura de bus no encontrada
         * Response 400: No se puede eliminar, tiene buses asociados
         * Uso: Para eliminar una configuración de estructura de bus
         * Nota: Solo se puede eliminar si no tiene buses asociados
         */
        DELETE: (id: string) => `${API_BASE_URL}/estructura-buses/${id}`,
    },
    // Terminales
    TERMINALES: {
        /**
         * POST /api/terminales - Crear una nueva terminal
         * Body: {
         *   id_ciudad: string,           // ID de la ciudad (requerido, ej: "ciudad123")
         *   nombre: string,              // Nombre de la terminal (requerido, ej: "Terminal Quitumbe")
         *   direccion: string,           // Dirección de la terminal (requerido, ej: "Av. Mariscal Sucre y Cóndor Ñan")
         *   telefono: string,            // Número de teléfono (requerido, ej: "022345678")
         *   hora_apertura: string,       // Hora de apertura en formato HH:MM (requerido, ej: "06:00")
         *   hora_cierre: string          // Hora de cierre en formato HH:MM (requerido, ej: "22:00")
         * }
         * Response 201: Terminal creada exitosamente - {
         *   id_ciudad: "ciudad123",
         *   nombre: "Terminal Quitumbe",
         *   direccion: "Av. Mariscal Sucre y Cóndor Ñan",
         *   telefono: "022345678",
         *   hora_apertura: "06:00",
         *   hora_cierre: "22:00"
         * }
         * Response 400: Datos inválidos (ciudad inexistente, nombre duplicado, horarios inválidos)
         * Uso: Para registrar nuevas terminales de transporte en el sistema
         */
        CREATE: `${API_BASE_URL}/terminales`,

        /**
         * GET /api/terminales - Obtener todas las terminales
         * Response 200: Lista de terminales - Array de terminales con estructura completa
         * Incluye: id_ciudad, nombre, direccion, telefono, hora_apertura, hora_cierre
         * Ejemplo: [{
         *   id_ciudad: "ciudad123",
         *   nombre: "Terminal Quitumbe",
         *   direccion: "Av. Mariscal Sucre y Cóndor Ñan",
         *   telefono: "022345678",
         *   hora_apertura: "06:00",
         *   hora_cierre: "22:00"
         * }]
         * Uso: Para obtener todas las terminales disponibles en el sistema
         */
        GET_ALL: `${API_BASE_URL}/terminales`,

        /**
         * GET /api/terminales/{id} - Obtener una terminal por ID
         * Params: id (string) - ID de la terminal
         * Response 200: Terminal encontrada - {
         *   id_ciudad: "ciudad123",
         *   nombre: "Terminal Quitumbe",
         *   direccion: "Av. Mariscal Sucre y Cóndor Ñan",
         *   telefono: "022345678",
         *   hora_apertura: "06:00",
         *   hora_cierre: "22:00"
         * }
         * Response 404: Terminal no encontrada
         * Uso: Para consultar información específica de una terminal
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/terminales/${id}`,

        /**
         * PUT /api/terminales/{id} - Actualizar una terminal por ID
         * Params: id (string) - ID de la terminal
         * Body: {
         *   id_ciudad?: string,          // ID de la ciudad (opcional, ej: "ciudad456")
         *   nombre?: string,             // Nombre de la terminal (opcional, ej: "Terminal La Marín")
         *   direccion?: string,          // Dirección de la terminal (opcional, ej: "Av. Pichincha y Cumandá")
         *   telefono?: string,           // Número de teléfono (opcional, ej: "022456789")
         *   hora_apertura?: string,      // Hora de apertura (opcional, ej: "05:30")
         *   hora_cierre?: string         // Hora de cierre (opcional, ej: "23:00")
         * }
         * Response 200: Terminal actualizada - {
         *   id_ciudad: "ciudad456",
         *   nombre: "Terminal La Marín",
         *   direccion: "Av. Pichincha y Cumandá",
         *   telefono: "022456789",
         *   hora_apertura: "05:30",
         *   hora_cierre: "23:00"
         * }
         * Response 404: Terminal no encontrada
         * Response 400: Datos inválidos (ciudad inexistente, horarios inválidos)
         * Uso: Para modificar información de una terminal existente
         */
        UPDATE: (id: string) => `${API_BASE_URL}/terminales/${id}`,

        /**
         * DELETE /api/terminales/{id} - Eliminar una terminal por ID
         * Params: id (string) - ID de la terminal
         * Response 200: Terminal eliminada - Confirmación de eliminación
         * Response 404: Terminal no encontrada
         * Response 400: No se puede eliminar, tiene rutas o frecuencias asociadas
         * Uso: Para eliminar una terminal del sistema
         * Nota: Solo se puede eliminar si no tiene rutas o frecuencias asociadas
         */
        DELETE: (id: string) => `${API_BASE_URL}/terminales/${id}`,
    },
    // Paradas-Intermedias
    PARADAS_INTERMEDIAS: {
        /**
         * POST /api/paradas-intermedias - Crear una nueva parada intermedia
         * Body: {
         *   id_ruta: string,             // ID de la ruta asociada (requerido, ej: "ruta123")
         *   id_estacion: string,         // ID de la estación/parada (requerido, ej: "estacion123")
         *   orden: number                // Orden secuencial en la ruta (requerido, ej: 2)
         * }
         * Response 201: Parada intermedia creada exitosamente - {
         *   id_ruta: "ruta123",
         *   id_estacion: "estacion123",
         *   orden: 2
         * }
         * Response 400: Datos inválidos (ruta inexistente, estación inexistente, orden duplicado)
         * Uso: Para agregar paradas intermedias a una ruta específica
         */
        CREATE: `${API_BASE_URL}/paradas-intermedias`,

        /**
         * GET /api/paradas-intermedias - Obtener todas las paradas intermedias
         * Response 200: Lista de paradas intermedias - Array de paradas intermedias con estructura completa
         * Incluye: id_ruta, id_estacion, orden
         * Ejemplo: [{
         *   id_ruta: "ruta123",
         *   id_estacion: "estacion123",
         *   orden: 2
         * }]
         * Uso: Para obtener todas las paradas intermedias del sistema
         */
        GET_ALL: `${API_BASE_URL}/paradas-intermedias`,

        /**
         * GET /api/paradas-intermedias/{id} - Obtener una parada intermedia por ID
         * Params: id (string) - ID de la parada intermedia
         * Response 200: Parada intermedia encontrada - {
         *   id_ruta: "ruta123",
         *   id_estacion: "estacion123",
         *   orden: 2
         * }
         * Response 404: Parada intermedia no encontrada
         * Uso: Para consultar información específica de una parada intermedia
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/paradas-intermedias/${id}`,

        /**
         * PUT /api/paradas-intermedias/{id} - Actualizar una parada intermedia por ID
         * Params: id (string) - ID de la parada intermedia
         * Body: {
         *   id_ruta?: string,            // ID de la ruta (opcional, ej: "ruta456")
         *   id_estacion?: string,        // ID de la estación (opcional, ej: "estacion456")
         *   orden?: number               // Orden en la ruta (opcional, ej: 3)
         * }
         * Response 200: Parada intermedia actualizada - {
         *   id_ruta: "ruta456",
         *   id_estacion: "estacion456",
         *   orden: 3
         * }
         * Response 404: Parada intermedia no encontrada
         * Response 400: Datos inválidos (ruta inexistente, estación inexistente, orden duplicado)
         * Uso: Para modificar la configuración de una parada intermedia existente
         */
        UPDATE: (id: string) => `${API_BASE_URL}/paradas-intermedias/${id}`,

        /**
         * DELETE /api/paradas-intermedias/{id} - Eliminar una parada intermedia por ID
         * Params: id (string) - ID de la parada intermedia
         * Response 200: Parada intermedia eliminada - Confirmación de eliminación
         * Response 404: Parada intermedia no encontrada
         * Uso: Para remover una parada intermedia de una ruta
         * Nota: Al eliminar una parada, se debe reordenar las paradas restantes
         */
        DELETE: (id: string) => `${API_BASE_URL}/paradas-intermedias/${id}`,
    },
    // Provincias
    PROVINCIAS: {
        /**
         * POST /api/provincias - Crear una nueva provincia
         * Body: {
         *   nombre: string               // Nombre de la provincia (requerido, ej: "Pichincha")
         * }
         * Response 201: Provincia creada exitosamente - {
         *   nombre: "Pichincha"
         * }
         * Response 400: Datos inválidos (nombre requerido, nombre duplicado)
         * Uso: Para registrar nuevas provincias en el sistema
         */
        CREATE: `${API_BASE_URL}/provincias`,

        /**
         * GET /api/provincias - Obtener todas las provincias
         * Response 200: Lista de provincias - Array de provincias con estructura completa
         * Incluye: nombre
         * Ejemplo: [{
         *   nombre: "Pichincha"
         * }, {
         *   nombre: "Guayas"
         * }, {
         *   nombre: "Azuay"
         * }]
         * Uso: Para obtener todas las provincias disponibles en el sistema
         */
        GET_ALL: `${API_BASE_URL}/provincias`,

        /**
         * GET /api/provincias/{id} - Obtener una provincia por ID
         * Params: id (string) - ID de la provincia
         * Response 200: Provincia encontrada - {
         *   nombre: "Pichincha"
         * }
         * Response 404: Provincia no encontrada
         * Uso: Para consultar información específica de una provincia
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/provincias/${id}`,

        /**
         * PUT /api/provincias/{id} - Actualizar una provincia por ID
         * Params: id (string) - ID de la provincia
         * Body: {
         *   nombre?: string              // Nombre de la provincia (opcional, ej: "Pichincha")
         * }
         * Response 200: Provincia actualizada - {
         *   nombre: "Pichincha"
         * }
         * Response 404: Provincia no encontrada
         * Response 400: Datos inválidos (nombre duplicado)
         * Uso: Para modificar el nombre de una provincia existente
         */
        UPDATE: (id: string) => `${API_BASE_URL}/provincias/${id}`,

        /**
         * DELETE /api/provincias/{id} - Eliminar una provincia por ID
         * Params: id (string) - ID de la provincia a eliminar
         * Response 200: Provincia eliminada - Confirmación de eliminación
         * Response 404: Provincia no encontrada
         * Response 400: No se puede eliminar, tiene ciudades o rutas asociadas
         * Uso: Para eliminar una provincia del sistema
         * Nota: Solo se puede eliminar si no tiene ciudades, paradas o rutas asociadas
         */
        DELETE: (id: string) => `${API_BASE_URL}/provincias/${id}`,
    },
    // Ciudades
    CIUDADES: {
        /**
         * POST /api/ciudades - Crear una nueva ciudad
         * Body: {
         *   id_provincia: string,        // ID de la provincia asociada (requerido, ej: "provincia123")
         *   nombre: string               // Nombre de la ciudad (requerido, ej: "Quito")
         * }
         * Response 201: Ciudad creada exitosamente - {
         *   id_provincia: "provincia123",
         *   nombre: "Quito"
         * }
         * Response 400: Datos inválidos (provincia inexistente, nombre requerido, nombre duplicado en la provincia)
         * Uso: Para registrar nuevas ciudades asociadas a una provincia específica
         */
        CREATE: `${API_BASE_URL}/ciudades`,

        /**
         * GET /api/ciudades - Obtener todas las ciudades
         * Response 200: Lista de ciudades - Array de ciudades con estructura completa
         * Incluye: id_provincia, nombre
         * Ejemplo: [{
         *   id_provincia: "provincia123",
         *   nombre: "Quito"
         * }, {
         *   id_provincia: "provincia456",
         *   nombre: "Guayaquil"
         * }, {
         *   id_provincia: "provincia123",
         *   nombre: "Sangolquí"
         * }]
         * Uso: Para obtener todas las ciudades disponibles en el sistema
         */
        GET_ALL: `${API_BASE_URL}/ciudades`,

        /**
         * GET /api/ciudades/{id} - Obtener una ciudad por ID
         * Params: id (string) - ID de la ciudad
         * Response 200: Ciudad encontrada - {
         *   id_provincia: "provincia123",
         *   nombre: "Quito"
         * }
         * Response 404: Ciudad no encontrada
         * Uso: Para consultar información específica de una ciudad
         */
        GET_BY_ID: (id: string) => `${API_BASE_URL}/ciudades/${id}`,

        /**
         * PUT /api/ciudades/{id} - Actualizar una ciudad por ID
         * Params: id (string) - ID de la ciudad
         * Body: {
         *   id_provincia?: string,       // ID de la provincia (opcional, ej: "provincia456")
         *   nombre?: string              // Nombre de la ciudad (opcional, ej: "Quito")
         * }
         * Response 200: Ciudad actualizada - {
         *   id_provincia: "provincia456",
         *   nombre: "Quito"
         * }
         * Response 404: Ciudad no encontrada
         * Response 400: Datos inválidos (provincia inexistente, nombre duplicado en la provincia)
         * Uso: Para modificar información de una ciudad existente
         * Permite cambiar la provincia asociada o actualizar el nombre
         */
        UPDATE: (id: string) => `${API_BASE_URL}/ciudades/${id}`,

        /**
         * DELETE /api/ciudades/{id} - Eliminar una ciudad por ID
         * Params: id (string) - ID de la ciudad
         * Response 200: Ciudad eliminada - Confirmación de eliminación
         * Response 404: Ciudad no encontrada
         * Response 400: No se puede eliminar, tiene paradas, terminales o rutas asociadas
         * Uso: Para eliminar una ciudad del sistema
         * Nota: Solo se puede eliminar si no tiene paradas, terminales o rutas asociadas
         */
        DELETE: (id: string) => `${API_BASE_URL}/ciudades/${id}`,
    },
};
