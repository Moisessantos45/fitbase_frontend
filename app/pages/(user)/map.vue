<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div>
        <h1 class="text-2xl font-bold text-white">Sedes y Mapa</h1>
        <p class="text-sm text-text-sub mt-1">
          Encuentra tu gimnasio Fitbase más cercano y consulta sus horarios
        </p>
      </div>
      <span
        class="px-3 py-1.5 rounded-full bg-surface border border-surface-light text-xs font-semibold text-primary flex items-center gap-2 w-fit"
      >
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        {{ publicTotal || publicGyms.length }} Sede(s) Disponible(s)
      </span>
    </div>

    <div class="flex flex-col sm:flex-row items-center gap-3">
      <div class="relative flex-1 w-full">
        <span
          class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-sub"
        >
          <Search class="w-4 h-4" />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar sede por nombre o zona..."
          class="input-field pl-10 h-11! text-xs w-full"
        />
        <button
          v-if="searchQuery"
          type="button"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-sub hover:text-white"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <button
        type="button"
        @click="getUserLocation"
        :disabled="locating"
        class="btn-secondary h-11! text-xs! px-4! flex items-center gap-2 w-full sm:w-auto justify-center shrink-0"
      >
        <Compass class="w-4 h-4 text-primary" :class="{ 'animate-spin': locating }" />
        {{ userLocation ? "Ubicación activada" : "Cerca de mí" }}
      </button>
    </div>

    <div
      class="relative z-0 isolate w-full h-80 sm:h-100 rounded-3xl border border-surface-light overflow-hidden shadow-2xl bg-surface"
    >
      <ClientOnly>
        <LMap
          ref="mapInstance"
          :zoom="currentZoom"
          :center="currentCenter"
          style="height: 100%; width: 100%"
        >
          <LTileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LMarker
            v-for="gym in gymsWithCoords"
            :key="gym.id"
            :lat-lng="[gym.latitude, gym.longitude]"
          >
            <LPopup>
              <div class="p-2 text-white min-w-44">
                <p
                  class="text-[9px] font-extrabold uppercase text-primary mb-0.5"
                >
                  SEDE FITBASE
                </p>
                <p class="text-sm font-bold text-white mb-1 leading-snug">
                  {{ gym.name }}
                </p>
                <p class="text-xs text-text-sub mb-2 line-clamp-2">
                  {{ gym.address }}
                </p>
                <div
                  class="flex items-center justify-between text-[11px] pt-1.5 border-t border-surface-light"
                >
                  <span
                    :class="
                      gym.isOpen
                        ? 'text-success font-bold'
                        : 'text-error font-bold'
                    "
                  >
                    {{ gym.isOpen ? "Abierto" : "Cerrado" }}
                  </span>
                  <button
                    type="button"
                    class="text-primary hover:underline font-bold cursor-pointer"
                    @click="openDetail(gym)"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </LPopup>
          </LMarker>
        </LMap>
      </ClientOnly>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface border border-surface-light rounded-3xl p-5 animate-pulse space-y-4"
      >
        <div class="h-36 bg-surface-light rounded-2xl w-full"></div>
        <div class="h-5 bg-surface-light rounded w-3/4"></div>
        <div class="space-y-2">
          <div class="h-3 bg-surface-light rounded w-full"></div>
          <div class="h-3 bg-surface-light rounded w-1/2"></div>
        </div>
        <div class="h-10 bg-surface-light rounded-xl"></div>
      </div>
    </div>

    <div
      v-else-if="publicGyms.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="gym in publicGyms"
        :key="gym.id"
        class="bg-surface rounded-3xl border border-surface-light overflow-hidden flex flex-col justify-between hover:border-primary/40 transition-all group"
      >
        <div>
          <div class="relative w-full h-40 bg-bg-base overflow-hidden">
            <img
              v-if="gym.backgroundUrl"
              :src="gym.backgroundUrl"
              :alt="gym.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-text-sub p-4"
            >
              <Dumbbell class="w-8 h-8 opacity-40 mb-1" />
              <span class="text-[11px]">Fitbase Hub</span>
            </div>

            <div
              class="absolute top-3 right-3 flex items-center gap-1.5"
            >
              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow"
                :class="
                  gym.isOpen
                    ? 'bg-success/90 text-white'
                    : 'bg-error/90 text-white'
                "
              >
                {{ gym.isOpen ? "Abierto" : "Cerrado" }}
              </span>
            </div>

            <span
              v-if="gymDistance(gym)"
              class="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm"
            >
              📍 {{ gymDistance(gym) }}
            </span>
          </div>

          <div class="p-5 space-y-3">
            <h2 class="font-bold text-white text-base leading-tight">
              {{ gym.name }}
            </h2>

            <div class="space-y-1.5 text-xs text-text-sub">
              <p class="flex items-start gap-2">
                <MapPin class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span class="line-clamp-2 text-white/90">{{ gym.address }}</span>
              </p>
              <p class="flex items-center gap-2">
                <Phone class="w-4 h-4 text-primary shrink-0" />
                <span>{{ gym.phone || "Sin teléfono" }}</span>
              </p>
              <p class="flex items-center gap-2">
                <Mail class="w-4 h-4 text-primary shrink-0" />
                <span class="truncate">{{ gym.email }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="p-5 pt-0 flex flex-col gap-2 mt-2">
          <NuxtLink
            :to="`/gyms/${gym.id}/plans`"
            class="btn-primary h-10! text-xs! w-full flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <BadgeCheck class="w-4 h-4" /> Inscribirme / Ver Planes
          </NuxtLink>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="focusGym(gym)"
              class="btn-secondary h-10! text-xs! w-full cursor-pointer"
            >
              Ubicar en Mapa
            </button>
            <button
              type="button"
              @click="openDetail(gym)"
              class="btn-secondary h-10! text-xs! w-full cursor-pointer"
            >
              Ver Detalles
            </button>
          </div>
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
        <MapPin class="w-8 h-8" />
      </div>
      <div>
        <h3 class="text-base font-bold text-white">
          No se encontraron sedes
        </h3>
        <p class="text-xs text-text-sub mt-1 max-w-sm">
          {{
            searchQuery
              ? "No hay gimnasios que coincidan con la búsqueda ingresada."
              : "Actualmente no hay sedes disponibles registradas en el sistema."
          }}
        </p>
      </div>
      <button
        v-if="searchQuery"
        type="button"
        @click="clearSearch"
        class="btn-secondary h-10! text-xs! px-4!"
      >
        Limpiar Filtros
      </button>
    </div>

    <div
      v-if="previewImage"
      class="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      @click="previewImage = null"
    >
      <div class="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-surface-light shadow-2xl">
        <img :src="previewImage" alt="Vista previa" class="w-full h-full object-contain" />
        <button
          type="button"
          @click="previewImage = null"
          class="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>
    <MoleculesBaseModal
      :hidden="showModal"
      :title="gymDetail?.name || 'Detalles de la Sede'"
      width="680px"
      :hide-footer="true"
      @cancel="closeModal"
    >
      <div v-if="gymDetail" class="space-y-6">
        <div class="relative w-full h-48 rounded-2xl overflow-hidden bg-bg-base border border-surface-light">
          <img
            v-if="gymDetail.backgroundUrl"
            :src="gymDetail.backgroundUrl"
            :alt="gymDetail.name"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center text-text-sub"
          >
            <Dumbbell class="w-10 h-10 opacity-30 mb-2" />
            <span class="text-xs">Foto de portada no disponible</span>
          </div>
          <div class="absolute top-3 right-3">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg"
              :class="
                gymDetail.isOpen
                  ? 'bg-success/90 text-white'
                  : 'bg-error/90 text-white'
              "
            >
              {{ gymDetail.isOpen ? "Abierto Ahora" : "Cerrado Actualmente" }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-bg-base/70 p-4 rounded-2xl border border-surface-light">
          <div class="space-y-1">
            <span class="text-text-muted text-[10px] font-semibold uppercase">Dirección</span>
            <p class="text-white flex items-start gap-1.5">
              <MapPin class="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{{ gymDetail.address }}</span>
            </p>
          </div>
          <div class="space-y-1">
            <span class="text-text-muted text-[10px] font-semibold uppercase">Teléfono</span>
            <p class="text-white flex items-center gap-1.5">
              <Phone class="w-4 h-4 text-primary shrink-0" />
              <span>{{ gymDetail.phone || "No especificado" }}</span>
            </p>
          </div>
          <div class="space-y-1">
            <span class="text-text-muted text-[10px] font-semibold uppercase">Correo</span>
            <p class="text-white flex items-center gap-1.5">
              <Mail class="w-4 h-4 text-primary shrink-0" />
              <span class="truncate">{{ gymDetail.email }}</span>
            </p>
          </div>
          <div
            v-if="gymDistance(gymDetail)"
            class="space-y-1"
          >
            <span class="text-text-muted text-[10px] font-semibold uppercase">Distancia</span>
            <p class="text-primary font-bold flex items-center gap-1.5">
              <Compass class="w-4 h-4 shrink-0" />
              <span>{{ gymDistance(gymDetail) }} desde tu ubicación</span>
            </p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-primary" />
            <h4 class="text-sm font-bold text-white">Horarios de Operación</h4>
          </div>

          <div
            v-if="gymDetail.schedules && gymDetail.schedules.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            <div
              v-for="sched in sortedSchedules(gymDetail.schedules)"
              :key="sched.id || sched.dayOfWeek"
              class="p-2.5 rounded-xl border flex items-center justify-between text-xs"
              :class="
                sched.isClosed
                  ? 'bg-surface-light/40 border-surface-light text-white'
                  : 'bg-bg-base/40 border-surface-light/30 text-text-muted'
              "
            >
              <span class="font-semibold">{{ getDayLabel(sched.dayOfWeek) }}</span>
              <span class="font-mono text-[11px]">
                {{
                  sched.isClosed
                    ? `${formatMinutes(sched.openMinutes)} - ${formatMinutes(sched.closeMinutes)}`
                    : "Cerrado"
                }}
              </span>
            </div>
          </div>
          <p v-else class="text-xs text-text-muted italic">
            No se han configurado horarios detallados para esta sede.
          </p>
        </div>

        <div v-if="gymDetail.photos && gymDetail.photos.length > 0" class="space-y-3">
          <div class="flex items-center gap-2">
            <Dumbbell class="w-4 h-4 text-primary" />
            <h4 class="text-sm font-bold text-white">Instalaciones y Áreas</h4>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="photo in gymDetail.photos"
              :key="photo.id"
              class="relative rounded-xl overflow-hidden border border-surface-light aspect-video bg-bg-base group cursor-pointer"
              @click="previewImage = photo.url"
            >
              <img
                :src="photo.url"
                alt="Instalación"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            @click="closeModal"
            class="btn-secondary h-10! text-xs! px-5! cursor-pointer"
          >
            Cerrar
          </button>
          <NuxtLink
            v-if="gymDetail.id"
            :to="`/gyms/${gymDetail.id}/plans`"
            class="btn-primary h-10! text-xs! px-5! flex items-center gap-1.5 cursor-pointer"
          >
            <BadgeCheck class="w-4 h-4" /> Inscribirme / Ver Planes
          </NuxtLink>
        </div>
      </div>
    </MoleculesBaseModal>
  </div>
</template>

<script setup lang="ts">
import {
	BadgeCheck,
	Clock,
	Compass,
	Dumbbell,
	Mail,
	MapPin,
	Phone,
	Search,
	X,
} from "lucide-vue-next";

definePageMeta({
	layout: "user",
	requiresAuth: true,
	roles: [4],
});

const gymStore = useGymStore();
const { publicGyms, publicTotal, loading, gymDetail } = storeToRefs(gymStore);

const currentCenter = ref<[number, number]>([19.39, -99.21]);
const currentZoom = ref(12);
const searchQuery = ref("");
const locating = ref(false);
const userLocation = ref<{ lat: number; lng: number } | null>(null);

const showModal = ref(false);
const previewImage = ref<string | null>(null);

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const gymsWithCoords = computed(() => {
	return publicGyms.value.filter(
		(g) =>
			typeof g.latitude === "number" &&
			typeof g.longitude === "number" &&
			!Number.isNaN(g.latitude) &&
			!Number.isNaN(g.longitude) &&
			(g.latitude !== 0 || g.longitude !== 0),
	);
});

const fetchGyms = async () => {
	await gymStore.getPublicGyms({
		search: searchQuery.value.trim() || undefined,
		lat: userLocation.value?.lat,
		lng: userLocation.value?.lng,
		page: 1,
		pageSize: 20,
	});

	if (gymsWithCoords.value.length > 0 && !userLocation.value) {
		const first = gymsWithCoords.value[0];
		if (first) {
			currentCenter.value = [first.latitude, first.longitude];
		}
	}
};

const focusGym = (gym: Gym) => {
	if (gym.latitude && gym.longitude) {
		currentCenter.value = [gym.latitude, gym.longitude];
		currentZoom.value = 15;
		window.scrollTo({ top: 120, behavior: "smooth" });
	}
};

const openDetail = async (gym: Gym) => {
	showModal.value = true;
	if (gym.id !== undefined) {
		await gymStore.getGymDetail(gym.id);
	}
};

const closeModal = () => {
	showModal.value = false;
	gymStore.clearGymDetail();
};

const clearSearch = () => {
	searchQuery.value = "";
	fetchGyms();
};

const getUserLocation = () => {
	if (typeof navigator !== "undefined" && navigator.geolocation) {
		locating.value = true;
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				locating.value = false;
				userLocation.value = {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				};
				currentCenter.value = [pos.coords.latitude, pos.coords.longitude];
				currentZoom.value = 13;
				fetchGyms();
			},
			() => {
				locating.value = false;
				fetchGyms();
			},
			{ timeout: 7000 },
		);
	} else {
		locating.value = false;
		fetchGyms();
	}
};

const gymDistance = (
	gym?: {
		latitude?: number;
		longitude?: number;
		distanceMeters?: number;
	} | null,
) => {
	if (!gym) return "";
	if (typeof gym.distanceMeters === "number" && gym.distanceMeters > 0) {
		return formatDistance(gym.distanceMeters);
	}
	if (
		userLocation.value &&
		typeof gym.latitude === "number" &&
		typeof gym.longitude === "number" &&
		(gym.latitude !== 0 || gym.longitude !== 0)
	) {
		const d = calculateDistance(
			userLocation.value.lat,
			userLocation.value.lng,
			gym.latitude,
			gym.longitude,
		);
		return formatDistance(d);
	}
	return "";
};

const getDayLabel = (day: number) => {
	const labels: Record<number, string> = {
		1: "Lunes",
		2: "Martes",
		3: "Miércoles",
		4: "Jueves",
		5: "Viernes",
		6: "Sábado",
		0: "Domingo",
	};
	return labels[day] ?? `Día ${day}`;
};

const sortedSchedules = (list: GymScheduleItem[]) => {
	const order = [1, 2, 3, 4, 5, 6, 0];
	return [...list].sort(
		(a, b) => order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek),
	);
};

watch(searchQuery, () => {
	if (searchDebounceTimer) {
		clearTimeout(searchDebounceTimer);
	}
	searchDebounceTimer = setTimeout(() => {
		fetchGyms();
	}, 350);
});

onMounted(() => {
	getUserLocation();
});

onBeforeUnmount(() => {
	if (searchDebounceTimer) {
		clearTimeout(searchDebounceTimer);
	}
});
</script>
