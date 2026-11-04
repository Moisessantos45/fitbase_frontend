<template>
  <div class="min-h-screen bg-bg-base text-white font-sans p-3 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto py-2 sm:py-4 space-y-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-light"
      >
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/login"
            class="w-10 h-10 rounded-2xl bg-surface border border-surface-light flex items-center justify-center text-white hover:text-primary transition shrink-0"
          >
            <ChevronLeft class="w-5 h-5" />
          </NuxtLink>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-white">
              Modo Invitado
            </h1>
            <p class="text-xs font-semibold text-primary">
              Explora las sedes y agenda tu pase de un solo uso
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="savedSlug"
            type="button"
            @click="loadSavedTicket"
            class="px-4 py-2.5 rounded-xl bg-surface border border-primary/30 text-primary hover:bg-primary/10 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode class="w-4 h-4" />
            Ver mi Pase QR
          </button>
          <button
            type="button"
            @click="daypassStore.openLookup"
            class="px-3.5 py-2.5 rounded-xl bg-surface border border-surface-light text-text-sub hover:text-white text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            title="Consultar boleto por código"
          >
            <Search class="w-3.5 h-3.5" />
            Consultar Pase
          </button>
          <NuxtLink
            v-if="!authenticated"
            to="/register"
            class="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-dark transition shadow-md"
          >
            Registrarse
          </NuxtLink>
        </div>
      </div>

      <div
        class="bg-surface border border-surface-light rounded-2xl sm:rounded-3xl p-3 sm:p-5 overflow-hidden shadow-sm"
      >
        <form
          @submit.prevent="fetchGyms"
          class="flex flex-col md:flex-row items-stretch gap-2.5 sm:gap-3 w-full"
        >
          <div class="relative flex-1 min-w-0">
            <Search
              class="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar sede por nombre o colonia (ej. Roma Norte, Del Valle)..."
              class="input-field h-11! py-2! pl-10! pr-8! text-xs font-medium w-full"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div
            class="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full md:w-auto shrink-0"
          >
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary h-11! px-4 sm:px-5! text-xs! w-full sm:w-auto! flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Search class="w-3.5 h-3.5" /> Buscar
            </button>
            <button
              type="button"
              @click="requestUserLocation"
              :disabled="locating"
              class="btn-secondary h-11! px-3 sm:px-4! text-xs! w-full sm:w-auto! flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              title="Buscar sedes cercanas a mi posición"
            >
              <Navigation
                class="w-3.5 h-3.5 text-primary"
                :class="{ 'animate-spin': locating }"
              />
              {{ locating ? "Localizando..." : "Cerca de mí" }}
            </button>
          </div>
        </form>
      </div>

      <div
        class="w-full h-72 sm:h-96 md:h-110 rounded-2xl sm:rounded-3xl border border-surface-light overflow-hidden shadow-inner bg-surface relative z-0 isolate"
      >
        <ClientOnly>
          <LMap
            ref="mapRef"
            :zoom="mapZoom"
            :center="mapCenter"
            @ready="onMapReady"
            style="height: 100%; width: 100%"
          >
            <LTileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LMarker v-if="userCoords" :lat-lng="userCoords">
              <LPopup>
                <div class="p-2 text-white text-center">
                  <p class="text-xs font-bold text-primary">📍 Tu ubicación</p>
                </div>
              </LPopup>
            </LMarker>

            <LMarker
              v-for="gym in gymsWithCoords"
              :key="gym.id ?? gym.name"
              :lat-lng="[gym.latitude, gym.longitude]"
            >
              <LPopup>
                <div class="p-2 text-white min-w-48 max-w-64">
                  <div
                    v-if="gym.backgroundUrl"
                    class="w-full h-20 rounded-lg overflow-hidden mb-2 bg-bg-base"
                  >
                    <img
                      :src="gym.backgroundUrl"
                      :alt="gym.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <p class="text-[10px] font-black uppercase text-primary">
                      SEDE FITBASE
                    </p>
                    <span
                      class="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      :class="
                        gym.isOpen
                          ? 'bg-success/20 text-success'
                          : 'bg-surface-light text-text-muted'
                      "
                    >
                      {{ gym.isOpen ? "Abierto" : "Cerrado" }}
                    </span>
                  </div>
                  <p class="text-xs font-bold text-white">{{ gym.name }}</p>
                  <p class="text-[11px] text-text-sub mt-0.5">
                    {{ gym.address }}
                  </p>
                  <p
                    v-if="gymDistance(gym)"
                    class="text-[10px] text-primary font-bold mt-1"
                  >
                    A {{ gymDistance(gym) }} de ti
                  </p>
                  <div
                    class="pt-2 mt-2 border-t border-surface-light flex flex-col gap-1.5"
                  >
                    <button
                      type="button"
                      class="w-full py-1 rounded bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                      @click="daypassStore.openDayPass(gym)"
                    >
                      <Ticket class="w-3 h-3" />
                      Pase 1 Día
                    </button>
                    <button
                      type="button"
                      class="text-primary hover:underline font-bold text-[11px] cursor-pointer text-center"
                      @click="openDetail(gym)"
                    >
                      Ver detalles &rarr;
                    </button>
                  </div>
                </div>
              </LPopup>
            </LMarker>
          </LMap>
        </ClientOnly>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <Building class="w-4 h-4 text-primary" /> Sedes Disponibles
            <span class="text-xs font-normal text-text-sub"
              >({{ publicTotal || publicGyms.length }})</span
            >
          </h3>
          <span
            v-if="userCoords"
            class="text-[11px] text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20"
          >
            Ordenadas por cercanía
          </span>
        </div>

        <div
          v-if="loading"
          class="p-12 text-center bg-surface border border-surface-light rounded-2xl sm:rounded-3xl"
        >
          <div
            class="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="text-xs text-text-sub mt-3 font-medium">
            Consultando sedes disponibles...
          </p>
        </div>

        <div
          v-else-if="publicGyms.length === 0"
          class="p-12 text-center bg-surface border border-surface-light rounded-2xl sm:rounded-3xl space-y-3"
        >
          <MapPin class="w-10 h-10 text-text-muted mx-auto opacity-50" />
          <p class="text-sm font-bold text-white">No se encontraron sedes</p>
          <p class="text-xs text-text-sub">
            No encontramos resultados para tu búsqueda. Intenta con otro
            término.
          </p>
          <button
            type="button"
            @click="clearSearch"
            class="btn-secondary h-9! px-4! text-xs! mx-auto mt-2 cursor-pointer"
          >
            Ver todas las sedes
          </button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="gym in publicGyms"
            :key="gym.id ?? gym.name"
            class="bg-surface border border-surface-light hover:border-primary/40 transition-colors rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div class="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
              <div
                class="w-full sm:w-24 sm:h-24 h-40 rounded-xl sm:rounded-2xl bg-surface-light border border-surface-light overflow-hidden shrink-0 flex items-center justify-center text-primary"
              >
                <img
                  v-if="gym.backgroundUrl"
                  :src="gym.backgroundUrl"
                  :alt="gym.name"
                  class="w-full h-full object-cover"
                />
                <Building v-else class="w-8 h-8" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="font-bold text-white text-base truncate">
                    {{ gym.name }}
                  </h2>
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold shrink-0"
                    :class="
                      gym.isOpen
                        ? 'bg-success/20 text-success border border-success/30'
                        : 'bg-surface-light text-text-muted'
                    "
                  >
                    {{ gym.isOpen ? "Abierto Ahora" : "Cerrado" }}
                  </span>
                  <span
                    v-if="gymDistance(gym)"
                    class="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 shrink-0"
                  >
                    {{ gymDistance(gym) }}
                  </span>
                </div>
                <p
                  class="text-xs text-text-sub mt-1.5 flex items-start gap-1.5"
                >
                  <MapPin class="w-3.5 h-3.5 shrink-0 text-text-muted mt-0.5" />
                  <span class="break-words-word">{{ gym.address }}</span>
                </p>
                <p
                  v-if="gym.phone"
                  class="text-xs text-text-muted mt-1 flex items-center gap-1.5"
                >
                  <Phone class="w-3.5 h-3.5 shrink-0 text-text-muted" />
                  <span>Tel: {{ gym.phone }}</span>
                </p>
              </div>
            </div>
            <div
              class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-surface-light/60 shrink-0"
            >
              <button
                type="button"
                @click="focusOnGym(gym)"
                class="btn-secondary h-10! px-3! text-xs! w-full sm:w-auto! flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MapPin class="w-3.5 h-3.5" /> En mapa
              </button>
              <button
                type="button"
                @click="openDetail(gym)"
                class="btn-secondary h-10! px-3! text-xs! w-full sm:w-auto! flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Ver detalles
              </button>
              <button
                type="button"
                @click="daypassStore.openDayPass(gym)"
                class="btn-primary h-10! px-3.5! text-xs! w-full sm:w-auto! flex items-center justify-center gap-1.5 cursor-pointer font-bold shadow-sm"
              >
                <Ticket class="w-3.5 h-3.5" /> Agendar Pase
              </button>
              <NuxtLink
                to="/register"
                class="btn-secondary h-10! px-3! text-xs! w-full sm:w-auto! text-center flex items-center justify-center text-text-sub hover:text-white"
              >
                Membresía &rarr;
              </NuxtLink>
            </div>
          </div>
        </div>
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
        <div
          class="relative w-full h-48 rounded-2xl overflow-hidden bg-bg-base border border-surface-light"
        >
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

        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-bg-base/70 p-4 rounded-2xl border border-surface-light"
        >
          <div class="space-y-1">
            <span class="text-text-muted text-[10px] font-semibold uppercase"
              >Dirección</span
            >
            <p class="text-white flex items-start gap-1.5">
              <MapPin class="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{{ gymDetail.address }}</span>
            </p>
          </div>
          <div class="space-y-1">
            <span class="text-text-muted text-[10px] font-semibold uppercase"
              >Teléfono</span
            >
            <p class="text-white flex items-center gap-1.5">
              <Phone class="w-4 h-4 text-primary shrink-0" />
              <span>{{ gymDetail.phone || "No especificado" }}</span>
            </p>
          </div>
          <div class="space-y-1">
            <span class="text-text-muted text-[10px] font-semibold uppercase"
              >Correo</span
            >
            <p class="text-white flex items-center gap-1.5">
              <Mail class="w-4 h-4 text-primary shrink-0" />
              <span class="truncate">{{ gymDetail.email }}</span>
            </p>
          </div>
          <div v-if="gymDistance(gymDetail)" class="space-y-1">
            <span class="text-text-muted text-[10px] font-semibold uppercase"
              >Distancia</span
            >
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
              <span class="font-semibold">{{
                getDayLabel(sched.dayOfWeek)
              }}</span>
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

        <div
          v-if="gymDetail.photos && gymDetail.photos.length > 0"
          class="space-y-3"
        >
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

        <div
          class="pt-3 border-t border-surface-light flex items-center justify-end gap-2.5"
        >
          <button
            type="button"
            @click="closeModal"
            class="btn-secondary h-10! text-xs! px-4!"
          >
            Cerrar
          </button>
          <button
            type="button"
            @click="openDayPassFromDetail"
            class="btn-primary h-10! text-xs! px-4! flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Ticket class="w-3.5 h-3.5" />
            Agendar Pase de 1 Día
          </button>
          <NuxtLink
            to="/register"
            class="btn-secondary h-10! text-xs! px-4! flex items-center justify-center text-text-sub hover:text-white"
          >
            Inscribirme
          </NuxtLink>
        </div>
      </div>
    </MoleculesBaseModal>

    <FeaturesGuestDayPassModal />
    <FeaturesGuestTicketQrModal />
    <FeaturesGuestTicketLookupModal />

    <div
      v-if="previewImage"
      class="fixed inset-0 z-10000 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      @click="previewImage = null"
    >
      <div
        class="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-surface-light shadow-2xl"
      >
        <img
          :src="previewImage"
          alt="Vista previa"
          class="w-full h-full object-contain"
        />
        <button
          type="button"
          @click="previewImage = null"
          class="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Building,
  ChevronLeft,
  Clock,
  Compass,
  Dumbbell,
  Mail,
  MapPin,
  Navigation,
  Phone,
  QrCode,
  Search,
  Ticket,
  X,
} from "lucide-vue-next";

definePageMeta({
  name: "guest",
  layout: "default",
});

const gymStore = useGymStore();
const authStore = useAuthStore();
const daypassStore = useDayPassStore();

const { publicGyms, publicTotal, loading, gymDetail } = storeToRefs(gymStore);
const { authenticated } = storeToRefs(authStore);
const savedSlug = toRef(daypassStore, "savedSlug");
const currentTicket = toRef(daypassStore, "currentTicket");

const searchQuery = ref("");
const locating = ref(false);
const userCoords = ref<[number, number] | null>(null);
const mapCenter = ref<[number, number]>([19.4194, -99.1622]);
const mapZoom = ref(12);
const mapRef = ref<unknown>(null);

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

const onMapReady = (map: unknown) => {
  if (isRecord(map) && typeof map.invalidateSize === "function") {
    setTimeout(() => {
      if (typeof map.invalidateSize === "function") {
        map.invalidateSize();
      }
    }, 150);
  }
};

const focusOnGym = (gym: Gym) => {
  if (gym.latitude && gym.longitude) {
    mapCenter.value = [gym.latitude, gym.longitude];
    mapZoom.value = 16;
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
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

const openDayPassFromDetail = () => {
  if (!gymDetail.value) return;
  const detail = gymDetail.value;
  closeModal();
  daypassStore.openDayPass({
    id: detail.id,
    name: detail.name,
    address: detail.address,
  });
};

const loadSavedTicket = async () => {
  if (!savedSlug.value) return;
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("fitbase_daypass_ticket");
    if (cached) {
      try {
        daypassStore.openTicket(JSON.parse(cached));
        return;
      } catch (_) {}
    }
  }

  await daypassStore.getTicketBySlug(savedSlug.value);
  if (currentTicket.value) {
    daypassStore.openTicket();
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
    userCoords.value &&
    typeof gym.latitude === "number" &&
    typeof gym.longitude === "number" &&
    (gym.latitude !== 0 || gym.longitude !== 0)
  ) {
    const d = calculateDistance(
      userCoords.value[0],
      userCoords.value[1],
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

const fetchGyms = async () => {
  await gymStore.getPublicGyms({
    search: searchQuery.value.trim() || undefined,
    lat: userCoords.value ? userCoords.value[0] : undefined,
    lng: userCoords.value ? userCoords.value[1] : undefined,
    page: 1,
    pageSize: 20,
  });

  if (gymsWithCoords.value.length > 0 && !userCoords.value) {
    const first = gymsWithCoords.value[0];
    if (first) {
      mapCenter.value = [first.latitude, first.longitude];
    }
  }
};

const clearSearch = async () => {
  searchQuery.value = "";
  await fetchGyms();
};

const requestUserLocation = () => {
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    locating.value = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locating.value = false;
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        userCoords.value = [lat, lng];
        mapCenter.value = [lat, lng];
        mapZoom.value = 13;
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

watch(searchQuery, () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
  searchDebounceTimer = setTimeout(() => {
    fetchGyms();
  }, 350);
});

onMounted(async () => {
  if (!authenticated.value) {
    await authStore.getSession();
  }
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("fitbase_daypass_slug");
    if (saved) {
      savedSlug.value = saved;
    }
  }
  requestUserLocation();
});

onBeforeUnmount(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
});
</script>
