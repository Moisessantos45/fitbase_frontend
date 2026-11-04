export const useManagerStore = defineStore("manager", () => {
  const { exec, loading } = useApiResult();

  const managers = ref<Manager[]>([]);
  const managerForm = reactive<ManagerForm>(
    structuredClone(initialManagerForm),
  );
  const pagination = reactive<PaginationManager>(
    structuredClone(initialPaginationManagerState),
  );

  const getManagersByGym = async () => {
    return await exec(
      () =>
        apiAuth.get(`/gyms/managers`, {
          params: {
            page: pagination.page,
            pageSize: pagination.pageSize,
            search: pagination.search,
          },
        }),
      {
        mapper(res) {
          const raw = res.data.data.data ?? [];

          return {
            data: raw.filter(isRecord).map(mapperManager),
            pagination: mapperPagination(res.data.data.paginate),
          };
        },
        onSuccess: (data) => {
          managers.value = data.data;
          Object.assign(pagination, structuredClone(data.pagination));
        },
        onError: (_) => {},
      },
    );
  };

  const createManager = async (form?: ManagerForm) => {
    const payload = form ?? managerForm;
    return await exec(() => apiAuth.post("/managers", managerToJson(payload)), {
      mapper(res) {
        return res.data.message ?? "Encargado registrado exitosamente";
      },
      onSuccess: () => {
        getManagersByGym();
      },
      onError: (_) => {},
    });
  };

  const getManager = async () => {
    return await exec(() => apiAuth.get("/managers/me"), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        console.log("res.data", res.data);
        console.log("extractedData", extractedData);
        if (!extractedData) {
          throw new Error(
            "Error al obtener el usuario. Por favor, intenta de nuevo.",
          );
        }

        return mapperUser(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(managerForm, structuredClone(data));
      },
      onError: (_) => {},
    });
  };

  const update = async () => {
    return await exec(
      () =>
        apiAuth.put("/managers/me", {
          first_name: managerForm.firstName,
          last_name: managerForm.lastName,
          phone: managerForm.phone,
        }),
      {
        mapper(res) {
          const extractedData = res.data.message ?? "";
          if (!extractedData) {
            throw new Error(
              "Error al actualizar el usuario. Por favor, intenta de nuevo.",
            );
          }
          return extractedData;
        },
        onSuccess: () => {
          getManager();
        },
        onError: (_) => {},
      },
    );
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return await exec(
      () =>
        apiAuth.post("/managers/me/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      {
        mapper(res) {
          const extractedData = res.data.message ?? "";
          if (!extractedData) {
            throw new Error(
              "Error al subir el avatar. Por favor, intenta de nuevo.",
            );
          }
          return extractedData;
        },
        onSuccess: () => {
          getManager();
        },
        onError: (_) => {},
      },
    );
  };

  const resetForm = () => {
    Object.assign(managerForm, structuredClone(initialManagerForm));
  };

  return {
    managers,
    managerForm,
    pagination,
    loading,
    getManagersByGym,
    createManager,
    getManager,
    update,
    uploadAvatar,
    resetForm,
  };
});
