export const useOwnerStore = defineStore("owner", () => {
  const { exec, loading } = useApiResult();
  const authStore = useAuthStore();
  const ownerData = reactive<User>(structuredClone(initialUser));

  const getOwner = async () => {
    return await exec(() => apiAuth.get("/owner/me"), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        console.log("extractedData", extractedData);
        if (!extractedData) {
          throw new Error(
            "Error al obtener el usuario. Por favor, intenta de nuevo.",
          );
        }

        return mapperUser(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(ownerData, structuredClone(data));
      },
      onError: (_) => {},
    });
  };

  const create = async () => {
    return await exec(
      () => apiAuth.post("/owner/complete-profile", userToJson(ownerData)),
      {
        mapper(res) {
          const extractedData = res.data.data ?? null;
          if (!extractedData) {
            throw new Error(
              "Error al iniciar sesión. Por favor, intenta de nuevo.",
            );
          }
          return mapperUser(extractedData);
        },
        onSuccess: (data) => {
          Object.assign(ownerData, data);
          authStore.getSession();
        },
        onError: (_) => {},
      },
    );
  };

  const update = async () => {
    return await exec(
      () =>
        apiAuth.put("/owner/me", {
          first_name: ownerData.firstName,
          last_name: ownerData.lastName,
          phone: ownerData.phone,
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
          getOwner();
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
        apiAuth.post("/owner/me/upload-avatar", formData, {
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
          getOwner();
        },
        onError: (_) => {},
      },
    );
  };

  return {
    ownerData,
    loading,
    getOwner,
    create,
    update,
    uploadAvatar,
  };
});
