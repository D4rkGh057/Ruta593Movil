import { API_ENDPOINTS } from "@/config/api";

export class DescuentoService {

    getAllDescuentos = async () => {
        const response = await fetch(API_ENDPOINTS.DESCUENTOS.GET_ALL);
        if (!response.ok) {
            throw new Error(`Error al obtener descuentos: ${response.status}`);
        }
        return response.json();
    }

    getDescuentoById = async (id: string) => {
        const response = await fetch(API_ENDPOINTS.DESCUENTOS.GET_BY_ID(id));
        if (!response.ok) {
            throw new Error(`Error al obtener descuento: ${response.status}`);
        }
        return response.json();
    }

    createDescuento = async (descuentoData: any) => {
        const response = await fetch(API_ENDPOINTS.DESCUENTOS.CREATE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(descuentoData),
        });
        if (!response.ok) {
            throw new Error(`Error al crear descuento: ${response.status}`);
        }
        return response.json();
    }

    updateDescuento = async (id: string, descuentoData: any) => {
        const response = await fetch(API_ENDPOINTS.DESCUENTOS.UPDATE(id), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(descuentoData),
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar descuento: ${response.status}`);
        }
        return response.json();
    }

    deleteDescuento = async (id: string) => {
        const response = await fetch(API_ENDPOINTS.DESCUENTOS.DELETE(id), {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar descuento: ${response.status}`);
        }
        return response.json();
    }

}