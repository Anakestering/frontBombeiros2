import toast from "react-hot-toast";
import Swal from "sweetalert2";

// 🔔 sucesso
export function sucesso(msg) {
    toast.success(msg, {
        duration: 2500
    });
}

// ❌ erro
export function erro(msg) {
    toast.error(msg, {
        duration: 3000
    });
}

// ⚠️ aviso
export function aviso(msg) {
    toast(msg, {
        duration: 2500
    });
}

// ❓ confirmação (AGORA CORRETO E MAIS FLEXÍVEL)
export async function confirmar({ titulo, texto }) {
    const result = await Swal.fire({
        title: titulo,
        text: texto,

        icon: "warning",

        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",

        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#dc2626",

        width: "320px",
        padding: "1rem",

        confirmButton: "swal-btn-confirm",
        cancelButton: "swal-btn-cancel",

        customClass: {
            popup: "rounded-xl text-sm"
        },

        
    });

    return result.isConfirmed;
}