<template>
  <div
    class="min-h-screen bg-bg-base text-white font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8"
  >
    <div class="w-full max-w-120 mx-auto py-8">
      <div class="flex items-center justify-between mb-6">
        <NuxtLink
          to="/login"
          class="w-10 h-10 rounded-2xl bg-surface border border-surface-light flex items-center justify-center text-white hover:text-primary transition"
        >
          <ChevronLeft class="w-5 h-5" />
        </NuxtLink>
        <span class="text-xs font-bold tracking-widest text-primary uppercase"
          >NUEVA CUENTA</span
        >
        <div class="w-10"></div>
      </div>

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">Crear Cuenta</h1>
        <p class="text-sm text-text-sub mt-1">
          Únete a Fitbase hoy mismo y potencia tu rendimiento
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <MoleculesInputField
          label="Correo electrónico"
          id="email"
          required
          type="email"
          inputmode="email"
          v-model="email"
          placeholder="admin@cotizaerp.com"
        />

        <MoleculesInputField
          label="Contraseña"
          id="password"
          required
          type="password"
          inputmode="text"
          v-model="password"
          placeholder="Crea una contraseña segura"
        />

        <MoleculesInputField
          label="Confirmar Contraseña"
          id="confirmPassword"
          required
          type="password"
          inputmode="text"
          v-model="confirmPassword"
          placeholder="Confirma tu contraseña"
        />

        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-text-sub"
            >Tipo de usuario</label
          >
          <div
            class="flex items-center gap-6 p-3 rounded-2xl bg-surface border border-surface-light"
          >
            <MoleculesInputField
              label="Cliente"
              id="client"
              name="userRole"
              type="radio"
              :value="false"
              v-model="userType"
            />

            <MoleculesInputField
              label="Dueño"
              id="owner"
              name="userRole"
              type="radio"
              :value="true"
              v-model="userType"
            />
          </div>
        </div>

        <div
          class="bg-surface rounded-2xl border border-surface-light p-4 space-y-2"
        >
          <p class="text-xs font-semibold text-white uppercase tracking-wider">
            Requisitos de seguridad
          </p>
          <ul class="space-y-1.5">
            <li
              v-for="req in requirements"
              :key="req.label"
              class="flex items-center gap-2 text-xs text-text-sub font-medium"
            >
              <Check class="h-4 w-4 text-primary shrink-0" v-if="req.met" />
              <span
                class="w-1.5 h-1.5 rounded-full bg-text-muted shrink-0 ml-1.5 mr-1"
                v-else
              ></span>
              {{ req.label }}
            </li>
          </ul>
        </div>

        <div class="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="terms-check"
            v-model="acceptTerms"
            class="mt-1 w-4 h-4 rounded accent-primary cursor-pointer"
          />
          <label
            for="terms-check"
            class="text-xs text-text-sub cursor-pointer leading-relaxed"
          >
            Acepto los
            <a href="#" class="text-primary underline">Términos de Servicio</a>
            y la
            <a href="#" class="text-primary underline"
              >Política de Privacidad</a
            >
            de Fitbase.
          </label>
        </div>

        <div class="pt-3">
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary"
            :class="{ 'opacity-70 cursor-not-allowed': loading }"
          >
            <UserPlus class="w-5 h-5" />
            <span>{{ loading ? "Creando cuenta..." : "Registrarme" }}</span>
          </button>
        </div>

        <div class="text-center pt-2 text-sm text-text-sub">
          ¿Ya tienes una cuenta?
          <NuxtLink
            to="/login"
            class="text-white font-bold hover:text-primary ml-1 transition"
          >
            Iniciar Sesión
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "vue-toastification";
import { ChevronLeft, Check, UserPlus } from "lucide-vue-next";

definePageMeta({
  layout: "default",
});

const router = useRouter();
const useAuth = useAuthStore();
const toast = useToast();

const { alertMessage, loading } = storeToRefs(useAuth);

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const userType = ref(false);
const acceptTerms = ref(true);

const requirements = computed(() => [
  { label: "Mínimo 8 caracteres", met: password.value.length >= 8 },
  { label: "Al menos un número", met: /\d/.test(password.value) },
  { label: "Una letra mayúscula", met: /[A-Z]/.test(password.value) },
  {
    label: "Un carácter especial (@, #, $)",
    met: /[@#$%^&*!]/.test(password.value),
  },
]);

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    useAuth.setAlertMessage({
      error: true,
      msg: "Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.",
    });
    toast.error("Las contraseñas no coinciden.");
    return;
  }

  const result = await useAuth.register(
    email.value,
    password.value,
    userType.value,
  );
  if (result.isSuccess) {
    toast.success(
      "¡Registro exitoso! Por favor, verifica tu correo electrónico.",
    );
    router.push("/login");
  } else {
    toast.error(
      alertMessage.value?.msg ||
        "Error al registrar. Por favor, intenta nuevamente.",
    );
  }
};
</script>
