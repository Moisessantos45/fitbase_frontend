<template>
  <div
    class="min-h-screen bg-bg-base text-white font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8"
  >
    <div class="w-full max-w-110 mx-auto py-8">
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-18 h-18 bg-surface rounded-[22px] border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/10 mb-4"
        >
          <Dumbbell class="w-9 h-9 text-primary" />
        </div>
        <h1 class="text-3xl font-black tracking-[2.5px] text-white">FITBASE</h1>
        <p class="text-sm text-text-sub mt-1 text-center">
          Tu centro integral de entrenamiento
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
          placeholder="••••••••"
        />

        <div class="flex justify-end pt-1">
          <NuxtLink
            to="/forgot-password"
            class="text-xs text-text-sub hover:text-primary transition font-medium"
          >
            ¿Olvidaste tu contraseña?
          </NuxtLink>
        </div>

        <div
          v-if="accountNotVerified"
          class="bg-surface rounded-2xl border border-warning/40 p-4 space-y-3"
        >
          <p class="text-sm font-semibold text-white">
            Tu cuenta aún no ha sido verificada.
          </p>
          <button
            type="button"
            @click="resendVerification"
            class="px-4 py-2 bg-surface-light hover:bg-surface-hover border border-surface-light text-primary text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Reenviar correo de verificación
          </button>
        </div>

        <div class="space-y-3 pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary"
            :class="{ 'opacity-70 cursor-not-allowed': loading }"
          >
            <UserIcon class="w-5 h-5" />
            <span>
              {{ loading ? "Ingresando..." : "Ingresar Sesión" }}
            </span>
          </button>
        </div>

        <div class="text-center pt-2">
          <NuxtLink
            to="/guest"
            class="text-[15px] font-bold text-primary underline underline-offset-4 hover:opacity-80 transition py-2 px-4 inline-block"
          >
            Entrar como invitado
          </NuxtLink>
        </div>

        <div class="text-center pt-4 text-sm text-text-sub">
          ¿No tienes cuenta?
          <NuxtLink
            to="/register"
            class="text-white font-bold hover:text-primary ml-1 transition"
          >
            Regístrate aquí
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Dumbbell, User as UserIcon } from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
	layout: "default",
});

const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();
const { accountNotVerified, loading } = storeToRefs(authStore);

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const handleSubmit = async () => {
	const result = await authStore.login(email.value, password.value);
	if (!result.isSuccess) {
		toast.error(
			result.getError?.msg ||
				"Error al iniciar sesión. Por favor, intenta nuevamente.",
		);
		return;
	}

	await authStore.getSession();
	toast.success("¡Inicio de sesión exitoso! Redirigiendo...");

	const getProfilePath = (roleId?: number): string => {
		if (roleId === 2) return "/admin/profile";
		if (roleId === 3) return "/manager/profile";
		return "/profile";
	};

	let targetPath = "/home";
	if (!authStore.authData.fullProfile) {
		targetPath = getProfilePath(authStore.authData.roleId);
	} else if (authStore.authData.roleId === 2) {
		targetPath = "/admin";
	} else if (authStore.authData.roleId === 3) {
		const cashRegisterStore = useCashRegisterStore();
		await cashRegisterStore.getCurrentRegister();
		targetPath = cashRegisterStore.currentRegister?.isOpen
			? "/admin"
			: "/manager/cash-register/open";
	}

	router.push(targetPath);
};

const resendVerification = () => {
	authStore.forwardEmailVerification(email.value);
};
</script>
