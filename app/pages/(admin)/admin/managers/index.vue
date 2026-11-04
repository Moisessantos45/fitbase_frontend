<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"
          >
            <UserCheck class="w-4 h-4" />
          </div>
          <h1 class="text-2xl font-bold text-white">Encargados</h1>
        </div>
        <p class="text-sm text-text-sub mt-1">
          Gestión del personal y administradores de turno en sucursal
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span
          class="px-3 py-1.5 rounded-full bg-surface-light text-xs font-bold text-primary"
        >
          {{ pagination.total }} Encargado(s)
        </span>
        <NuxtLink
          to="/admin/managers/create"
          class="btn-primary h-10! text-xs! px-4! flex items-center gap-1.5"
        >
          <Plus class="w-4 h-4" /> Registrar Encargado
        </NuxtLink>
      </div>
    </div>

    <div class="relative">
      <span
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-sub"
      >
        <Search class="w-5 h-5" />
      </span>
      <input
        type="text"
        v-model="searchQuery"
        class="input-field pl-12"
        placeholder="Buscar por nombre, correo o teléfono..."
      />
    </div>

    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface border border-surface-light rounded-3xl p-5 animate-pulse space-y-4"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-surface-light"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-surface-light rounded w-3/4"></div>
            <div class="h-3 bg-surface-light rounded w-1/2"></div>
          </div>
        </div>
        <div class="h-10 bg-surface-light rounded-xl"></div>
      </div>
    </div>

    <div
      v-else-if="managers.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="manager in managers"
        :key="manager.id"
        class="bg-surface border border-surface-light rounded-3xl p-5 hover:border-primary/30 transition-all flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                v-if="manager.avatarUrl"
                class="w-12 h-12 rounded-2xl overflow-hidden border border-surface-light shrink-0"
              >
                <img
                  :src="manager.avatarUrl"
                  :alt="manager.firstName"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0"
              >
                {{ getInitials(manager.firstName, manager.lastName) }}
              </div>

              <div>
                <h3 class="font-bold text-white text-base leading-tight">
                  {{ manager.firstName }} {{ manager.lastName }}
                </h3>
                <p class="text-xs text-text-sub mt-0.5">
                  ID: #{{ manager.id }}
                </p>
              </div>
            </div>

            <span
              class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-success/10 text-success shrink-0"
            >
              Activo
            </span>
          </div>

          <div
            class="space-y-2 p-3 bg-bg-base/60 rounded-2xl border border-surface-light/40 text-xs"
          >
            <div class="flex items-center gap-2 text-text-sub truncate">
              <Mail class="w-3.5 h-3.5 shrink-0 text-primary" />
              <span class="truncate text-white">{{ manager.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-text-sub truncate">
              <Phone class="w-3.5 h-3.5 shrink-0 text-primary" />
              <span class="truncate text-white">{{
                manager.phone || "Sin teléfono"
              }}</span>
            </div>
            <div
              v-if="manager.gymName"
              class="flex items-center gap-2 text-text-sub truncate"
            >
              <Building2 class="w-3.5 h-3.5 shrink-0 text-primary" />
              <span class="truncate text-white">{{ manager.gymName }}</span>
            </div>
          </div>
        </div>

        <div
          class="pt-4 border-t border-surface-light mt-4 flex items-center justify-between text-[11px] text-text-sub"
        >
          <span class="flex items-center gap-1.5">
            <Calendar class="w-3.5 h-3.5" />
            {{ manager.createdAt || "Fecha no disponible" }}
          </span>
          <span class="font-medium text-primary">Encargado</span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-surface border border-surface-light rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4"
    >
      <div
        class="w-16 h-16 rounded-2xl bg-surface-light flex items-center justify-center text-text-sub"
      >
        <UserX class="w-8 h-8" />
      </div>
      <div>
        <h3 class="text-base font-bold text-white">
          No se encontraron encargados
        </h3>
        <p class="text-xs text-text-sub mt-1 max-w-sm">
          {{
            searchQuery
              ? "No hay resultados que coincidan con la búsqueda."
              : "Aún no has registrado ningún encargado para este gimnasio."
          }}
        </p>
      </div>
      <NuxtLink
        v-if="!searchQuery"
        to="/admin/managers/create"
        class="btn-primary h-10! text-xs! px-4! flex items-center gap-1.5"
      >
        <Plus class="w-4 h-4" /> Registrar Primer Encargado
      </NuxtLink>
    </div>

    <MoleculesPageNavigator
      v-if="!loading && managers.length > 0"
      :total="pagination.total"
      :page="pagination.page"
      :total-pages="pagination.totalPages"
      :change-page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import {
  Building2,
  Calendar,
  Mail,
  Phone,
  Plus,
  Search,
  UserCheck,
  UserX,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
  name: "admin-managers-index",
  layout: "admin",
  requiresAuth: true,
  roles: [2],
});

const toast = useToast();
const managerStore = useManagerStore();

const { managers, loading, pagination } = storeToRefs(managerStore);

const searchQuery = ref(pagination.value.search ?? "");
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";
  return `${first}${last}`.toUpperCase() || "EN";
};

const loadData = async () => {
  const res = await managerStore.getManagersByGym();
  if (!res.isSuccess) {
    toast.error(res.getError?.msg || "Error al cargar la lista de encargados");
  }
};

const changePage = async (page: number) => {
  if (
    page < 1 ||
    page > pagination.value.totalPages ||
    page === pagination.value.page
  )
    return;
  pagination.value.page = page;
  await loadData();
};

watch(searchQuery, (newVal) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(async () => {
    pagination.value.page = 1;
    pagination.value.search = newVal.trim();
    await loadData();
  }, 400);
});

onMounted(() => {
  loadData();
});

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
});
</script>
