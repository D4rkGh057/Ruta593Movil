import { debugLog, getIdentificacionFallback } from "../../config/userConfig";
import { LoginPort } from "../application/LoginUseCase";
import { User } from "../domain/User";
import { AuthService } from "./AuthService";

// Implementación de autenticación usando la API real
export class AuthApiAdapter implements LoginPort {    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        try {
            // Paso 1: Realizar login para obtener el token
            const loginResult = await AuthService.login(email, password);
            console.log('Login exitoso, obteniendo perfil completo...');
            
            // Paso 2: Usar el token para obtener el perfil completo del usuario
            const profileData = await AuthService.getProfile(loginResult.token);
            
            // DEBUGGING: Ver exactamente qué campos devuelve la API
            console.log('🔍 DEBUGGING AuthApiAdapter - profileData completo:', profileData);
            console.log('🔍 DEBUGGING AuthApiAdapter - Campos individuales:');
            console.log('  - id:', profileData.id);
            console.log('  - usuario_id:', profileData.usuario_id);
            console.log('  - identificacion:', profileData.identificacion);
            console.log('  - primer_nombre:', profileData.primer_nombre);
            console.log('  - primer_apellido:', profileData.primer_apellido);
            console.log('  - correo:', profileData.correo);
            console.log('  - telefono:', profileData.telefono);
            console.log('  - direccion:', profileData.direccion);
            console.log('  - rol:', profileData.rol);
            
            // Determinar el campo correcto para identificación
            const identificacionFinal = profileData.identificacion || 
                                      profileData.cedula || 
                                      profileData.documento || 
                                      profileData.dni || 
                                      profileData.numero_identificacion || 
                                      // VALOR QUEMADO: Identificación específica del usuario
                                      getIdentificacionFallback() || 
                                      // FALLBACK: Usar los últimos 8 dígitos del usuario_id como identificación
                                      (profileData.id?.toString().slice(-8)) || 
                                      '';
            
            console.log('🆔 IDENTIFICACIÓN DETERMINADA (CON VALOR QUEMADO):', identificacionFinal);
            console.log('   - Fuente de identificación:');
            if (profileData.identificacion) console.log('     ✅ Campo identificacion de la API');
            else if (profileData.cedula) console.log('     ✅ Campo cedula de la API');
            else if (profileData.documento) console.log('     ✅ Campo documento de la API');
            else if (profileData.dni) console.log('     ✅ Campo dni de la API');
            else if (profileData.numero_identificacion) console.log('     ✅ Campo numero_identificacion de la API');
            else if (identificacionFinal === getIdentificacionFallback()) {
                debugLog('USANDO IDENTIFICACIÓN QUEMADA:', getIdentificacionFallback());
                console.log('     🔥 VALOR QUEMADO:', getIdentificacionFallback());
            }
            else if (profileData.id) console.log('     ⚠️ Usando últimos 8 dígitos del ID como fallback');
            else console.log('     ❌ NO SE ENCONTRÓ IDENTIFICACIÓN');

            // Paso 3: Mapear los datos del perfil al formato User
            const user: User = {
                usuario_id: (profileData.usuario_id || profileData.id)?.toString(), // Convertir a string y manejar ambos campos
                identificacion: identificacionFinal, // Usar identificación determinada
                primer_nombre: profileData.primer_nombre,
                segundo_nombre: profileData.segundo_nombre || '',
                primer_apellido: profileData.primer_apellido,
                segundo_apellido: profileData.segundo_apellido || '',
                correo: profileData.correo,
                telefono: profileData.telefono || '',
                direccion: profileData.direccion || '',
                rol: profileData.rol || 'usuario_normal', // Usar el rol del perfil
                fecha_creacion: new Date().toISOString(), // No viene en el perfil
                activo: true // Asumir activo si está logueado
            };
            
            console.log('✅ Datos completos del usuario mapeados correctamente:', {
                id: user.usuario_id,
                nombre: user.primer_nombre,
                apellido: user.primer_apellido,
                correo: user.correo,
                telefono: user.telefono,
                direccion: user.direccion,
                rol: user.rol,
                identificacion: user.identificacion
            });
            
            // FORZAR GUARDADO DE IDENTIFICACIÓN si existe
            if (user.identificacion && user.identificacion.trim() !== '') {
                console.log('💾 FORZANDO guardado de identificación:', user.identificacion);
                try {
                    const SessionStorage = (await import('../../adapters/stores/SessionStorage')).default;
                    await SessionStorage.saveIdentificacion(user.identificacion);
                    console.log('✅ Identificación guardada exitosamente en login');
                } catch (error) {
                    console.error('❌ Error al guardar identificación en login:', error);
                }
            } else {
                console.warn('⚠️ IDENTIFICACIÓN VACÍA O NO ENCONTRADA');
                console.warn('   - profileData.identificacion:', profileData.identificacion);
                console.warn('   - Usando ID como fallback:', user.usuario_id);
            }
            
            return { user, token: loginResult.token };
            
        } catch (error) {
            console.error('Error en el proceso de login:', error);
            if (error instanceof TypeError && error.message.includes('roles')) {
                console.error('Error específico: Intentando acceder a roles que no existe');
                console.error('Datos del login:', arguments);
            }
            throw error;
        }
    }async register(data: {
        identificacion: string;
        primer_nombre: string;
        segundo_nombre: string;
        primer_apellido: string;
        segundo_apellido: string;
        correo: string;
        password: string;
        telefono: string;
        direccion: string;
    }): Promise<{ user: User; token: string }> {
        try {
            // Paso 1: Realizar registro
            const registerResult = await AuthService.register(data);
            console.log('Registro exitoso:', registerResult);
            
            // Paso 2: Si el registro devuelve un token, obtener el perfil
            if (registerResult.token) {
                console.log('Registro devolvió token, obteniendo perfil...');
                const profileData = await AuthService.getProfile(registerResult.token);
                
                const user: User = {
                    usuario_id: (profileData.id)?.toString(),
                    identificacion: profileData.identificacion || '',
                    primer_nombre: profileData.primer_nombre,
                    segundo_nombre: profileData.segundo_nombre || '',
                    primer_apellido: profileData.primer_apellido,
                    segundo_apellido: profileData.segundo_apellido || '',
                    correo: profileData.correo,
                    telefono: profileData.telefono || '',
                    direccion: profileData.direccion || '',
                    rol: 'usuario_normal',
                    fecha_creacion: new Date().toISOString(),
                    activo: true
                };
                
                return { user, token: registerResult.token };
            }
            // Paso 3: Si no hay token en el registro, hacer login automático
            else {
                console.log('Registro sin token, realizando login automático...');
                return await this.login(data.correo, data.password);
            }
            
        } catch (error) {
            console.error('Error en el proceso de registro:', error);
            throw error;
        }
    }
}
