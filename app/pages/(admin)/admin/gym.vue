<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">Datos del Gimnasio</h1>
      <p class="text-sm text-text-sub mt-1">
        Configuración general de la sede, geolocalización y aforo
      </p>
    </div>

    <div class="bg-surface border border-surface-light rounded-3xl p-5 flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Store class="w-6 h-6" />
      </div>
      <div>
        <h2 class="font-bold text-white text-base">Sede Central</h2>
        <p class="text-xs text-text-sub">
          Parámetros operativos y ubicación en OpenStreetMap
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div>
        <form @submit.prevent="saveGymData" class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text-sub mb-1.5">Imagen de Portada / Fondo</label>
            <div
              class="relative w-full h-44 rounded-2xl border border-dashed border-surface-light overflow-hidden bg-bg-base flex items-center justify-center group">
              <img v-if="coverPreview" :src="coverPreview" alt="Portada" class="w-full h-full object-cover" />
              <div v-else class="flex flex-col items-center justify-center text-text-sub p-4 text-center">
                <Image class="w-8 h-8 mb-2 opacity-50" />
                <span class="text-xs font-medium">Seleccionar imagen de portada</span>
                <span class="text-[10px] text-text-muted mt-0.5">PNG, JPG o WEBP (Máx. 5MB)</span>
              </div>
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label
                  class="p-2.5 rounded-full bg-primary text-on-primary hover:scale-105 transition cursor-pointer shadow-lg"
                  :class="{
                    'opacity-50 pointer-events-none cursor-not-allowed':
                      uploadingCover,
                  }" title="Cambiar portada">
                  <Camera class="w-4 h-4" />
                  <input type="file" accept="image/*" class="hidden" :disabled="uploadingCover"
                    @change="handleCoverChange" />
                </label>
                <button v-if="coverPreview" type="button" @click="removeCover"
                  class="p-2.5 rounded-full bg-error text-white hover:scale-105 transition shadow-lg"
                  title="Eliminar portada">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <MoleculesInputField label="Nombre de la Sede" id="gymName" required type="text" inputmode="text"
            v-model="gymForm.name" placeholder="Fitbase Central Hub" />

          <MoleculesInputField label="Dirección Completa" id="gymAddress" required type="text" inputmode="text"
            v-model="gymForm.address" placeholder="Av. Insurgentes Sur 1450, Del Valle, CDMX" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MoleculesInputField label="Teléfono de Contacto" id="gymPhone" required type="tel" inputmode="tel"
              v-model="gymForm.phone" placeholder="+52 55 1234 5678" />

            <MoleculesInputField label="Correo de Atención" id="gymEmail" required type="email" inputmode="email"
              v-model="gymForm.email" placeholder="contacto@fitbasegym.com" />
          </div>

          <MoleculesInputField label="Coordenadas (Latitud, Longitud)" id="gymCoords" required type="text"
            inputmode="text" v-model="gymForm.coordsStr" placeholder="Ej. 19.3734, -99.1798" />

          <div class="pt-2 flex justify-end">
            <button type="submit" :disabled="loading"
              class="btn-primary md:w-56! h-12! text-sm! disabled:opacity-50 disabled:cursor-not-allowed">
              <Save class="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <div class="bg-surface border border-surface-light rounded-3xl p-6 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-base font-bold text-white">
                Geolocalización OpenStreetMap
              </h3>
              <p class="text-xs text-text-sub mt-0.5">
                Haz clic en el mapa o arrastra el marcador para fijar la
                ubicación
              </p>
            </div>
            <span
              class="text-[10px] font-bold text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
              Punto Activo
            </span>
          </div>

          <div class="w-full h-80 sm:h-107 rounded-2xl overflow-hidden border border-surface-light shadow-inner mt-3">
            <ClientOnly>
              <LMap :zoom="15" :center="coords" @click="onMapClick" style="height: 100%; width: 100%">
                <LTileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                <LMarker :lat-lng="coords" :draggable="true" @dragend="onMarkerDragEnd">
                  <LPopup>
                    <div class="p-2 text-white">
                      <p class="text-sm font-bold">{{ gymForm.name }}</p>
                      <p class="text-xs text-text-sub">{{ gymForm.address }}</p>
                    </div>
                  </LPopup>
                </LMarker>
              </LMap>
            </ClientOnly>
          </div>
        </div>

        <div
          class="p-4 bg-bg-base rounded-2xl border border-surface-light flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-sub">
          <div>
            <p class="font-bold text-white">{{ gymForm.name }}</p>
            <p class="text-[11px] mt-0.5 font-mono text-primary">
              {{ coords[0].toFixed(5) }}° N, {{ coords[1].toFixed(5) }}° W
            </p>
          </div>
          <button type="button" @click="useCurrentLocation" class="btn-secondary h-8! px-3! text-xs! w-fit">
            📍 Usar mi ubicación
          </button>
        </div>
      </div>
    </div>

    <div class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Clock class="w-4 h-4" />
            </div>
            <h3 class="text-base font-bold text-white">
              Horarios de Operación
            </h3>
          </div>
          <p class="text-xs text-text-sub mt-1">
            Configura los días y horarios en formato de 24 horas (apertura y
            cierre)
          </p>
        </div>

        <div v-if="gymForm.id !== undefined" class="flex items-center gap-2 shrink-0">
          <button type="button" :disabled="savingSchedules || loading" @click="saveSchedulesData"
            class="btn-primary h-10! text-xs! px-4! disabled:opacity-50 disabled:cursor-not-allowed">
            <Save class="w-4 h-4" /> Guardar Todos
          </button>
        </div>
      </div>

      <div class="space-y-3 pt-2">
        <div v-for="(schedule, index) in schedules" :key="index"
          class="p-4 rounded-2xl border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          :class="schedule.isClosed
              ? 'bg-bg-base/60 border-surface-light'
              : 'bg-surface-hover/20 border-surface-light/40 opacity-70'
            ">
          <div class="w-full md:w-56">
            <label class="block text-[11px] font-medium text-text-sub mb-1">
              Día de la semana (Valor: {{ schedule.dayOfWeek }})
            </label>
            <select v-model.number="schedule.dayOfWeek" class="input-field h-10! py-1! text-xs font-semibold">
              <option v-for="day in daysOfWeekOptions" :key="day.value" :value="day.value">
                {{ day.label }} (Día {{ day.value }})
              </option>
            </select>
          </div>

          <div class="flex-1 grid grid-cols-2 gap-3 items-center">
            <div>
              <label class="block text-[11px] font-medium text-text-sub mb-1">
                Hora Apertura (24h)
              </label>
              <input type="time" :value="toTimeString(schedule.openMinutes)" @input="
                schedule.openMinutes = ($event.target as HTMLInputElement)
                  .value as unknown as number
                " :disabled="!schedule.isClosed"
                class="input-field h-10! text-xs font-mono disabled:opacity-40 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label class="block text-[11px] font-medium text-text-sub mb-1">
                Hora Cierre (24h)
              </label>
              <input type="time" :value="toTimeString(schedule.closeMinutes)" @input="
                schedule.closeMinutes = ($event.target as HTMLInputElement)
                  .value as unknown as number
                " :disabled="!schedule.isClosed"
                class="input-field h-10! text-xs font-mono disabled:opacity-40 disabled:cursor-not-allowed" />
            </div>
          </div>

          <div class="flex items-center gap-2 justify-end shrink-0 pt-2 md:pt-0">
            <button
              v-if="gymForm.id !== undefined && schedule.id && isScheduleModified(schedule)"
              type="button"
              :disabled="updatingScheduleId === schedule.id"
              @click="updateSingleSchedule(schedule)"
              class="h-10 px-3.5 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition flex items-center gap-1.5 shadow-sm"
              title="Guardar cambios de este día"
            >
              <Save class="w-3.5 h-3.5" />
              {{ updatingScheduleId === schedule.id ? "Guardando..." : "Actualizar Día" }}
            </button>

            <button type="button" @click="toggleDayOpen(schedule)"
              class="h-10 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5" :class="schedule.isClosed
                  ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
                  : 'bg-surface-light text-text-muted hover:text-white'
                ">
              <span class="w-2 h-2 rounded-full" :class="schedule.isClosed ? 'bg-primary' : 'bg-text-muted'"></span>
              {{ schedule.isClosed ? "Abre este día" : "No abre (Cerrado)" }}
            </button>

            <button type="button" @click="removeSchedule(index)"
              class="p-2.5 rounded-xl text-text-sub hover:text-error hover:bg-error/10 transition"
              title="Eliminar horario">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-white">Imágenes de Referencia</h3>
          <p class="text-xs text-text-sub mt-0.5">
            Fotografías de las instalaciones, equipos y áreas del gimnasio
          </p>
        </div>
        <span class="text-xs font-semibold text-text-sub">
          {{ referencePreviews.length }} seleccionadas
        </span>
      </div>

      <label
        class="border border-dashed border-surface-light hover:border-primary/50 bg-bg-base/50 hover:bg-surface-hover/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition cursor-pointer"
        :class="{
          'opacity-50 pointer-events-none cursor-not-allowed': uploadingPhotos,
        }">
        <Upload class="w-8 h-8 text-primary mb-2" />
        <span class="text-sm font-semibold text-white">
          Haz clic para subir fotos de referencia
        </span>
        <span class="text-xs text-text-muted mt-1">
          Puedes seleccionar múltiples imágenes (PNG, JPG o WEBP)
        </span>
        <input type="file" multiple accept="image/*" class="hidden" :disabled="uploadingPhotos"
          @change="handleReferenceImagesChange" />
      </label>

      <div v-if="storePhotos.length > 0" class="space-y-2 pt-2">
        <h4 class="text-xs font-semibold text-text-sub">Fotos Guardadas</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="photo in storePhotos" :key="photo.id"
            class="group relative rounded-xl overflow-hidden border border-surface-light bg-bg-base aspect-square">
            <img :src="photo.url" alt="Foto del gimnasio"
              class="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
            <div
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" @click="deleteSavedPhoto(photo.id)"
                class="p-2 rounded-full bg-error text-white hover:scale-110 transition shadow-md" title="Eliminar foto">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="referencePreviews.length > 0" class="space-y-2 pt-2">
        <h4 class="text-xs font-semibold text-text-sub">Fotos por Subir</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="(preview, index) in referencePreviews" :key="index"
            class="group relative rounded-xl overflow-hidden border border-surface-light bg-bg-base aspect-square">
            <img :src="preview.url" :alt="preview.file.name"
              class="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
            <div
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" @click="removeReferenceImage(index)"
                class="p-2 rounded-full bg-error text-white hover:scale-110 transition shadow-md" title="Eliminar foto">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            <div
              class="absolute bottom-0 inset-x-0 bg-black/70 px-2 py-1 text-[10px] text-white truncate pointer-events-none">
              <p class="truncate">{{ preview.file.name }}</p>
              <p class="text-text-sub text-[9px]">
                {{ formatSize(preview.file.size) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="savedSuccess"
      class="fixed bottom-6 right-6 z-50 bg-success text-on-primary px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
      Datos guardados correctamente
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Camera,
  Clock,
  Image,
  Plus,
  Save,
  Store,
  Trash2,
  Upload,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
  name: "admin-gym",
  layout: "admin",
  requiresAuth: true,
  roles: [2, 3],
});

const toast = useToast();
const gymStore = useGymStore();
const {
  gymForm,
  schedules,
  photos: storePhotos,
  loading,
} = storeToRefs(gymStore);

const coverFile = ref<File | null>(null);
const coverPreview = ref<string>("");
const uploadingCover = ref(false);
const uploadingPhotos = ref(false);
const savingSchedules = ref(false);
const updatingScheduleId = ref<number | null>(null);
const savedSuccess = ref(false);
const referencePreviews = ref<ImagePreview[]>([]);
const originalSchedulesMap = ref<Record<number, string>>({});

const getScheduleHash = (s: GymScheduleItem) => {
  return `${s.dayOfWeek}_${toMinutes(s.openMinutes)}_${toMinutes(s.closeMinutes)}_${s.isClosed}`;
};

const snapshotSchedules = () => {
  const map: Record<number, string> = {};
  schedules.value.forEach((s) => {
    if (s.id) {
      map[s.id] = getScheduleHash(s);
    }
  });
  originalSchedulesMap.value = map;
};

const snapshotSchedule = (s: GymScheduleItem) => {
  if (s.id) {
    originalSchedulesMap.value[s.id] = getScheduleHash(s);
  }
};

const isScheduleModified = (schedule: GymScheduleItem): boolean => {
  if (!schedule.id || !originalSchedulesMap.value[schedule.id]) return false;
  return originalSchedulesMap.value[schedule.id] !== getScheduleHash(schedule);
};

const removeSchedule = (index: number) => {
  schedules.value.splice(index, 1);
};

const toggleDayOpen = (schedule: GymScheduleItem) => {
  schedule.isClosed = !schedule.isClosed;
};

const coords = computed<[number, number]>(() => {
  const parts = gymForm.value.coordsStr.split(",");
  const lat = parseFloat(parts[0]?.trim() ?? "");
  const lng = parseFloat(parts[1]?.trim() ?? "");
  if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
    return [lat, lng];
  }
  return [19.3734, -99.1798];
});

const onMapClick = (e: LeafletMapClickEvent) => {
  if (e?.latlng) {
    const lat = Number(e.latlng.lat.toFixed(6));
    const lng = Number(e.latlng.lng.toFixed(6));
    gymForm.value.coordsStr = `${lat}, ${lng}`;
  }
};

const onMarkerDragEnd = (e: LeafletMarkerDragEvent) => {
  const target = e.target;
  if (target?.getLatLng) {
    const latlng = target.getLatLng();
    const lat = Number(latlng.lat.toFixed(6));
    const lng = Number(latlng.lng.toFixed(6));
    gymForm.value.coordsStr = `${lat}, ${lng}`;
  }
};

const useCurrentLocation = () => {
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = Number(pos.coords.latitude.toFixed(6));
      const lng = Number(pos.coords.longitude.toFixed(6));
      gymForm.value.coordsStr = `${lat}, ${lng}`;
    });
  }
};

const handleCoverChange = async (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Por favor selecciona un archivo de imagen válido");
    return;
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.error("La imagen de portada no debe superar los 5MB");
    return;
  }

  if (gymForm.value.id !== undefined) {
    uploadingCover.value = true;
    const res = await gymStore.uploadCover(gymForm.value.id, file);
    uploadingCover.value = false;
    if (res.isSuccess) {
      if (gymForm.value.backgroundUrl) {
        coverPreview.value = gymForm.value.backgroundUrl;
      }
      toast.success("Foto de portada actualizada correctamente");
    } else {
      toast.error(res.getError?.msg || "Error al subir foto de portada");
    }
  } else {
    coverFile.value = file;
    coverPreview.value = URL.createObjectURL(file);
    toast.success("Foto de portada seleccionada");
  }
};

const removeCover = () => {
  coverFile.value = null;
  coverPreview.value = "";
};

const handleReferenceImagesChange = async (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const maxSize = 5 * 1024 * 1024;
  const validFiles: File[] = [];

  for (const file of Array.from(files)) {
    if (!file.type.startsWith("image/")) {
      toast.error(`"${file.name}" no es una imagen válida`);
      continue;
    }
    if (file.size > maxSize) {
      toast.error(`"${file.name}" supera los 5MB`);
      continue;
    }
    validFiles.push(file);
  }

  if (validFiles.length === 0) {
    event.target.value = "";
    return;
  }

  if (gymForm.value.id !== undefined) {
    uploadingPhotos.value = true;
    const res = await gymStore.uploadPhotos(gymForm.value.id, validFiles);
    uploadingPhotos.value = false;
    if (res.isSuccess) {
      toast.success(`${validFiles.length} imagen(es) subida(s) correctamente`);
    } else {
      toast.error(res.getError?.msg || "Error al subir fotografías");
    }
  } else {
    for (const file of validFiles) {
      referencePreviews.value.push({
        file,
        url: URL.createObjectURL(file),
      });
    }
    toast.success(`${validFiles.length} imagen(es) agregada(s)`);
  }

  event.target.value = "";
};

const removeReferenceImage = (index: number) => {
  referencePreviews.value.splice(index, 1);
};

const deleteSavedPhoto = async (photoId: number) => {
  if (gymForm.value.id === undefined) return;
  const res = await gymStore.deletePhoto(gymForm.value.id, photoId);
  if (res.isSuccess) {
    toast.success("Fotografía eliminada");
  } else {
    toast.error(res.getError?.msg || "Error al eliminar fotografía");
  }
};

const updateSingleSchedule = async (schedule: GymScheduleItem) => {
  if (gymForm.value.id === undefined || !schedule.id) return;
  updatingScheduleId.value = schedule.id;

  const res = await gymStore.updateSchedule(gymForm.value.id, schedule.id, {
    dayOfWeek: schedule.dayOfWeek,
    openMinutes: toMinutes(schedule.openMinutes),
    closeMinutes: toMinutes(schedule.closeMinutes),
    isClosed: !schedule.isClosed,
  });

  updatingScheduleId.value = null;

  if (res.isSuccess) {
    snapshotSchedule(schedule);
    toast.success("Horario del día actualizado");
  } else {
    toast.error(res.getError?.msg || "Error al actualizar horario");
  }
};

const saveSchedulesData = async () => {
  if (gymForm.value.id === undefined) return;

  const mappedSchedules = schedules.value.map((s) => ({
    dayOfWeek: s.dayOfWeek,
    openMinutes: toMinutes(s.openMinutes),
    closeMinutes: toMinutes(s.closeMinutes),
    isClosed: !s.isClosed,
  }));

  savingSchedules.value = true;
  const res = await gymStore.setSchedules(gymForm.value.id, mappedSchedules);
  savingSchedules.value = false;

  if (res.isSuccess) {
    snapshotSchedules();
    toast.success("Horarios actualizados correctamente");
  } else {
    toast.error(res.getError?.msg || "Error al actualizar horarios");
  }
};

const saveGymData = async () => {
  const latLng = coords.value;

  if (gymForm.value.id !== undefined) {
    const updateRes = await gymStore.updateGym(gymForm.value.id, {
      name: gymForm.value.name,
      address: gymForm.value.address,
      phone: gymForm.value.phone,
      email: gymForm.value.email,
      latitude: latLng[0],
      longitude: latLng[1],
    });

    if (!updateRes.isSuccess) {
      toast.error(updateRes.getError?.msg || "Error al actualizar la sede");
      return;
    }

    await getData();
    savedSuccess.value = true;
    toast.success("Datos del gimnasio actualizados correctamente");
    setTimeout(() => {
      savedSuccess.value = false;
    }, 2500);
  } else {
    const mappedSchedules = schedules.value.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      openMinutes: toMinutes(s.openMinutes),
      closeMinutes: toMinutes(s.closeMinutes),
      isClosed: !s.isClosed,
    }));

    const formData = new FormData();
    formData.append("name", gymForm.value.name);
    formData.append("address", gymForm.value.address);
    formData.append("phone", gymForm.value.phone);
    formData.append("email", gymForm.value.email);
    formData.append("latitude", String(latLng[0]));
    formData.append("longitude", String(latLng[1]));
    formData.append(
      "schedules",
      JSON.stringify(
        mappedSchedules.map((s) => ({
          day_of_week: s.dayOfWeek,
          open_minutes: s.openMinutes,
          close_minutes: s.closeMinutes,
          is_closed: s.isClosed,
        })),
      ),
    );

    if (coverFile.value) {
      formData.append("cover", coverFile.value);
    }
    for (const preview of referencePreviews.value) {
      formData.append("images", preview.file);
    }

    const createRes = await gymStore.createGym(formData);
    if (createRes.isSuccess) {
      coverFile.value = null;
      referencePreviews.value = [];
      await getData();
      savedSuccess.value = true;
      toast.success("Gimnasio registrado correctamente");
      setTimeout(() => {
        savedSuccess.value = false;
      }, 2500);
    } else {
      toast.error(createRes.getError?.msg || "Error al registrar gimnasio");
    }
  }
};

const getData = async () => {
  await gymStore.getMyGym();
  snapshotSchedules();
  if (gymForm.value.id !== undefined) {
    if (gymForm.value.backgroundUrl) {
      coverPreview.value = gymForm.value.backgroundUrl;
    }
  }
};

onMounted(() => {
  getData();
});
</script>
