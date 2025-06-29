# Ruta593 Móvil 🚌

Una aplicación móvil desarrollada con React Native y Expo para la gestión de reservas de viajes en autobús. La aplicación permite a los usuarios buscar rutas, reservar boletos, gestionar su perfil y acceder a ofertas especiales.

## Descripción del Proyecto

Ruta593 Móvil es una aplicación de transporte que facilita la compra de boletos de autobús y la gestión de viajes. Cuenta con las siguientes características principales:

- **Autenticación de usuarios**: Login y registro
- **Búsqueda de rutas**: Consulta de rutas disponibles entre ciudades
- **Reserva de boletos**: Sistema completo de reservas con selección de asientos
- **Gestión de perfil**: Administración de datos personales
- **Ofertas y descuentos**: Visualización de promociones disponibles
- **Historial de viajes**: Consulta de boletos anteriores
- **Ayuda y FAQ**: Sección de preguntas frecuentes
- **Pagos**: Integración con sistemas de pago

## Estructura de Carpetas

```
Ruta593Movil/
├── app/                          # Aplicación principal (Expo Router)
│   ├── (auth)/                   # Pantallas de autenticación
│   ├── (tabs)/                   # Navegación por pestañas
│   ├── adapters/                 # Adaptadores para stores
│   │   └── stores/               # Gestión de estado con Zustand
│   ├── config/                   # Configuración de la aplicación
│   ├── core/                     # Arquitectura limpia
│   │   ├── application/          # Casos de uso y contenedor DI
│   │   ├── domain/               # Entidades y interfaces del dominio
│   │   └── infrastructure/       # Servicios e implementaciones
│   ├── data/                     # Datos mock para desarrollo
│   ├── hooks/                    # Hooks personalizados de React
│   └── ui/                       # Componentes de interfaz
│       ├── components/           # Componentes reutilizables
│       ├── navigation/           # Configuración de navegación
│       ├── screens/              # Pantallas de la aplicación
│       └── styles/               # Estilos globales
├── assets/                       # Recursos estáticos
│   ├── fonts/                    # Fuentes personalizadas
│   └── images/                   # Imágenes y recursos gráficos
├── android/                      # Configuración específica de Android
├── config/                       # Configuración de APIs
└── scripts/                      # Scripts de utilidad
```

## Tecnologías Utilizadas

- **React Native**: Framework para desarrollo móvil multiplataforma
- **Expo**: Plataforma de desarrollo y herramientas
- **Expo Router**: Navegación basada en archivos
- **TypeScript**: Tipado estático para JavaScript
- **Zustand**: Gestión de estado ligera
- **TailwindCSS**: Framework CSS utilitario
- **NativeWind**: TailwindCSS para React Native
- **React Navigation**: Navegación avanzada
- **Arquitectura Limpia**: Separación de responsabilidades

## Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para desarrollo Android)
- Xcode (para desarrollo iOS - solo macOS)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Ruta593Movil
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   # Agregar las variables necesarias para APIs
   ```

## Dependencias Principales

### Dependencias de Producción
- `expo`: ~53.0.11 - Plataforma de desarrollo
- `react`: 19.0.0 - Librería de interfaz
- `react-native`: 0.79.3 - Framework móvil
- `expo-router`: ~5.0.6 - Navegación basada en archivos
- `zustand`: ^5.0.5 - Gestión de estado
- `nativewind`: ^4.1.23 - TailwindCSS para React Native
- `react-navigation`: ^7.x - Navegación avanzada
- `@react-native-async-storage/async-storage`: ^2.1.2 - Almacenamiento local

### Dependencias de Desarrollo
- `typescript`: ~5.8.3 - Tipado estático
- `eslint`: ^9.25.0 - Linter de código
- `@babel/core`: ^7.25.2 - Transpilador

## Ejecución del Proyecto

### Desarrollo

1. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   # o
   npx expo start
   ```

2. **Ejecutar en plataformas específicas**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   
   # Web
   npm run web
   ```

### Opciones de ejecución

En la salida del comando `expo start`, encontrarás opciones para abrir la aplicación en:

- **[Expo Go](https://expo.dev/go)**: Aplicación sandbox para pruebas rápidas
- **[Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)**: Emulador de Android
- **[iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)**: Simulador de iOS
- **[Development Build](https://docs.expo.dev/develop/development-builds/introduction/)**: Build de desarrollo personalizado

### Scripts Disponibles

```bash
npm start          # Inicia el servidor de desarrollo Expo
npm run android    # Ejecuta en Android
npm run ios        # Ejecuta en iOS
npm run web        # Ejecuta en navegador web
npm run lint       # Ejecuta el linter
```

## Desarrollo

La aplicación utiliza [file-based routing](https://docs.expo.dev/router/introduction) de Expo Router. Puedes empezar a desarrollar editando los archivos dentro del directorio **app**.

### Arquitectura

El proyecto sigue los principios de **Arquitectura Limpia**:

- **Domain**: Entidades y reglas de negocio
- **Application**: Casos de uso y lógica de aplicación  
- **Infrastructure**: Implementaciones de servicios externos
- **UI**: Componentes de interfaz y presentación

### Gestión de Estado

Se utiliza **Zustand** para la gestión de estado global, con stores separados para diferentes dominios:

- `authStore`: Autenticación de usuarios
- `busStore`: Información de autobuses
- `paradaStore`: Gestión de paradas
- `frecuenciaStore`: Frecuencias de rutas

## Recursos Adicionales

### Documentación

- [Documentación de Expo](https://docs.expo.dev/): Aprende los fundamentos o profundiza en temas avanzados
- [Tutorial de Expo](https://docs.expo.dev/tutorial/introduction/): Tutorial paso a paso para crear proyectos multiplataforma
- [React Native Documentation](https://reactnative.dev/docs/getting-started): Documentación oficial de React Native

### Comunidad

- [Expo en GitHub](https://github.com/expo/expo): Plataforma open source
- [Comunidad Discord](https://chat.expo.dev): Chat con usuarios de Expo
- [React Native Community](https://reactnative.dev/community/overview): Comunidad de React Native

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Autores

Este proyecto fue desarrollado por:

- **Daniel Fuelpaz** - Desarrollador Principal
- **Jose Muyulema** - Desarrollador Principal

### Equipo de Desarrollo

Desarrollado por [**SoftwareSquad**](https://d4rkgh057.github.io/SoftwareSquad/)

![SoftwareSquad](https://media.licdn.com/dms/image/v2/D4E3DAQHo8kxa76yjow/image-scale_191_1128/B4EZbrH6hjGcAc-/0/1747701443077/softwaresquadec_cover?e=1751839200&v=beta&t=Hl3wUwOiBejv8PtQvMneGI40V9t3ZgfuAAfK8kuNF_w)

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Ruta593 Móvil** - Desarrollado con ❤️ usando React Native y Expo
