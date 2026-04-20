import Swal from "sweetalert2";
import toast from "react-hot-toast";

// 🔔 sucesso
export function sucesso(msg) {
  toast.success(msg, { duration: 2000 });
}

// ❌ erro
export function erro(msg) {
  toast.error(msg, { duration: 2500 });
}

// ⚠️ aviso
export function aviso(msg) {
  toast(msg, { duration: 2000, icon: "⚠️" });
}

let loadingToastId = null;

// ⏳ loading
export function loading(msg = "Processando...") {
  loadingToastId = toast.loading(msg);
}

// ✅ finalizar loading com sucesso
export function loadingSucesso(msg = "Concluído!") {
  if (loadingToastId) toast.dismiss(loadingToastId);
  sucesso(msg);
}

// ❌ finalizar loading com erro
export function loadingErro(msg = "Erro ao processar") {
  if (loadingToastId) toast.dismiss(loadingToastId);
  erro(msg);
}

// ❓ confirmação (LEVE e consistente)
export async function confirmar({
  titulo,
  texto,
  tipo = "warning",
  confirmText = "Sim",
  cancelText = "Não"
}) {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: tipo,

    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,

    reverseButtons: true,
    width: 320,

    customClass: {
      popup: "swal-clean",
      title: "swal-title",
      htmlContainer: "swal-text",
      confirmButton: "swal-confirm",
      cancelButton: "swal-cancel"
    },

    buttonsStyling: false
  });

  return result.isConfirmed;
}

 