export const useUserStore = defineStore("user", () => {
  const { exec, loading } = useApiResult();
  const authStore = useAuthStore();
  const userForm = reactive<User>(structuredClone(initialUser));

  const getUser = async () => {
    return await exec(() => apiAuth.get("/users/me"), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        if (!extractedData) {
          throw new Error(
            "Error al obtener el usuario. Por favor, intenta de nuevo.",
          );
        }

        return mapperUser(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(userForm, structuredClone(data));
      },
      onError: (_) => { },
    });
  };

  const create = async () => {
    return await exec(() => apiAuth.post("/users", userToJson(userForm)), {
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
        Object.assign(userForm, data);
        authStore.getSession();
      },
      onError: (_) => { },
    });
  };

  const update= async () => {
    return await exec(
      () =>
        apiAuth.put("/users/me", {
          first_name: userForm.firstName,
          last_name: userForm.lastName,
          phone: userForm.phone,
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
          getUser();
        },
        onError: (_) => { },
      },
    );
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return await exec(
      () =>
        apiAuth.post("/users/me/upload-avatar", formData, {
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
          getUser();
        },
        onError: (_) => { },
      },
    );
  };

  return {
    userForm,
    loading,
    getUser,
    create,
    update,
    uploadAvatar,
  };
});
