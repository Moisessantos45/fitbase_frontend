export const useGymStore = defineStore("gym", () => {
  const { exec, loading } = useApiResult();

  const gymForm = reactive<Gym>(structuredClone(initialGym));
  const myGyms = ref<Gym[]>([]);
  const schedules = ref<GymScheduleItem[]>([...initialSchedules]);
  const photos = ref<GymPhoto[]>([]);
  const publicGyms = ref<Gym[]>([]);
  const publicTotal = ref(0);
  const gymDetail = ref<GymDetail | null>(null);

  const createGym = async (formData: FormData) => {
    return await exec(() => apiAuth.post("/gyms", formData), {
      mapper(res) {
        const extractedData = res.data.data;
        if (!isRecord(extractedData)) {
          throw new Error(
            "Error al crear el gimnasio. Por favor, intenta de nuevo.",
          );
        }
        return mapperGym(extractedData);
      },
      onSuccess: async (data) => {
        Object.assign(gymForm, data);
        await getMyGym();
      },
      onError: (_) => {},
    });
  };

  const getMyGym = async () => {
    return await exec(() => apiAuth.get("/gyms/my-gym"), {
      mapper(res) {
        const extractedData = res.data.data;
        if (!isRecord(extractedData)) {
          throw new Error("No se encontraron datos para la sede del usuario.");
        }
        return mapperGym(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(gymForm, data);
        if (data.schedules?.length) {
          schedules.value = data.schedules;
        }
        if (data.photos?.length) {
          photos.value = data.photos;
        }
      },
      onError: (_) => {},
    });
  };

  const getMyGyms = async (page = 1, pageSize = 10) => {
    return await exec(
      () =>
        apiAuth.get("/gyms/my-gyms", {
          params: { page, page_size: pageSize },
        }),
      {
        mapper(res) {
          const raw = res.data.data;
          const rawList =
            isRecord(raw) && Array.isArray(raw.data)
              ? raw.data
              : Array.isArray(raw)
                ? raw
                : [];
          return rawList.filter(isRecord).map(mapperGym);
        },
        onSuccess: (list) => {
          myGyms.value = list;
          if (list.length > 0 && gymForm.id === undefined) {
            const firstGym = list[0];
            if (firstGym) {
              Object.assign(gymForm, firstGym);
              if (firstGym.schedules?.length) {
                schedules.value = firstGym.schedules;
              }
              if (firstGym.photos?.length) {
                photos.value = firstGym.photos;
              }
            }
          }
        },
        onError: (_) => {},
      },
    );
  };

  const getGymDetail = async (id: number) => {
    return await exec(() => apiPublic.get(`/gyms/${id}`), {
      mapper(res) {
        const extractedData = res.data.data;
        if (!isRecord(extractedData)) {
          throw new Error("No se encontraron datos para la sede solicitada.");
        }
        return mapperGymDetail(extractedData);
      },
      onSuccess: (data) => {
        gymDetail.value = data;
      },
      onError: (_) => {},
    });
  };

  const clearGymDetail = () => {
    gymDetail.value = null;
  };

  const updateGym = async (id: number, payload: Partial<Gym>) => {
    return await exec(() => apiAuth.put(`/gyms/${id}`, gymToJson(payload)), {
      mapper(res) {
        return res.data.message ?? "Gimnasio actualizado exitosamente";
      },
      onSuccess: () => {
        Object.assign(gymForm, payload);
      },
      onError: (_) => {},
    });
  };

  const setSchedules = async (
    gymId: number,
    schedulesList: GymScheduleItem[],
  ) => {
    return await exec(
      () =>
        apiAuth.post(`/gyms/${gymId}/schedules`, {
          schedules: schedulesListToJson(schedulesList),
        }),
      {
        mapper(res) {
          return res.data.message ?? "Horarios actualizados exitosamente";
        },
        onSuccess: () => {
          schedules.value = schedulesList;
        },
        onError: (_) => {},
      },
    );
  };

  const updateSchedule = async (
    gymId: number,
    scheduleId: number,
    payload: Partial<GymScheduleItem>,
  ) => {
    return await exec(
      () =>
        apiAuth.put(
          `/gyms/${gymId}/schedules/${scheduleId}`,
          scheduleToJson(payload),
        ),
      {
        mapper(res) {
          return res.data.message ?? "Horario actualizado exitosamente";
        },
        onSuccess: () => {
          const idx = schedules.value.findIndex((s) => s.id === scheduleId);
          if (idx !== -1 && schedules.value[idx]) {
            Object.assign(schedules.value[idx], payload);
          }
        },
        onError: (_) => {},
      },
    );
  };

  const uploadCover = async (gymId: number, file: File) => {
    const formData = new FormData();
    formData.append("cover", file);

    return await exec(() => apiAuth.post(`/gyms/${gymId}/cover`, formData), {
      mapper(res) {
        const responseData = res.data?.data;
        if (
          isRecord(responseData) &&
          typeof responseData.background_url === "string"
        ) {
          gymForm.backgroundUrl = responseData.background_url;
        }

        return res.data?.message ?? "Foto de portada actualizada exitosamente";
      },
      onSuccess: () => {
        getMyGym();
      },
      onError: (_) => {},
    });
  };

  const uploadPhotos = async (gymId: number, files: File[]) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }

    return await exec(() => apiAuth.post(`/gyms/${gymId}/photos`, formData), {
      mapper(res) {
        return res.data.message ?? "Imágenes subidas exitosamente";
      },
      onSuccess: () => {
        getMyGym();
      },
      onError: (_) => {},
    });
  };

  const deletePhoto = async (gymId: number, photoId: number) => {
    return await exec(
      () => apiAuth.delete(`/gyms/${gymId}/photos/${photoId}`),
      {
        mapper(res) {
          return res.data.message ?? "Fotografía eliminada exitosamente";
        },
        onSuccess: () => {
          photos.value = photos.value.filter((p) => p.id !== photoId);
        },
        onError: (_) => {},
      },
    );
  };

  const getPublicGyms = async (params?: {
    search?: string;
    lat?: number;
    lng?: number;
    page?: number;
    pageSize?: number;
  }) => {
    return await exec(
      () =>
        apiPublic.get("/gyms", {
          params: {
            search: params?.search || undefined,
            lat: params?.lat !== undefined ? params.lat : undefined,
            lng: params?.lng !== undefined ? params.lng : undefined,
            page: params?.page ?? 1,
            page_size: params?.pageSize ?? 10,
          },
        }),
      {
        mapper(res) {
          const raw = res.data.data;
          const rawList =
            isRecord(raw) && Array.isArray(raw.data)
              ? raw.data
              : Array.isArray(raw)
                ? raw
                : [];
          if (isRecord(raw) && isRecord(raw.paginate)) {
            publicTotal.value = Number(raw.paginate.total) || 0;
          }
          return rawList.filter(isRecord).map(mapperGym);
        },
        onSuccess: (list) => {
          publicGyms.value = list;
        },
        onError: (_) => {},
      },
    );
  };

  return {
    gymForm,
    myGyms,
    schedules,
    photos,
    publicGyms,
    publicTotal,
    gymDetail,
    loading,
    createGym,
    getMyGym,
    getMyGyms,
    getGymDetail,
    clearGymDetail,
    updateGym,
    setSchedules,
    updateSchedule,
    uploadCover,
    uploadPhotos,
    deletePhoto,
    getPublicGyms,
  };
});
