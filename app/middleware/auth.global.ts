export default defineNuxtRouteMiddleware(async (to, _) => {
	const authStore = useAuthStore();
	const userStore = useUserStore();
	const ownerStore = useOwnerStore();
	const managerStore = useManagerStore();

	const path = to.path.length > 1 && to.path.endsWith("/") ? to.path.slice(0, -1) : to.path;

	const publicPaths = ["/", "/guest", "/login", "/register", "/payment/success", "/payment/cancel"];
	const isPublicRoute =
		publicPaths.includes(path) ||
		path.startsWith("/payment/") ||
		path.startsWith("/forgot-password") ||
		path.startsWith("/confirm-account");

	const requiresAuth =
		!isPublicRoute || to.meta.requiresAuth === true || Boolean(to.meta.roles);

	if (!authStore.authenticated && !authStore.loading) {
		await authStore.getSession();
	}

	if (requiresAuth && !authStore.authenticated) {
		return navigateTo("/login");
	}

	const getProfilePath = (roleId?: number): string => {
		if (roleId === 2) return "/admin/profile";
		if (roleId === 3) return "/manager/profile";
		return "/profile";
	};

	const userRole = authStore.authData?.roleId;
	const targetProfile = getProfilePath(userRole);

	const cashRegisterStore = useCashRegisterStore();

	const isLoginPage =
		path === "/" || path === "/login" || path === "/register";
	if (authStore.authenticated && isLoginPage) {
		if (authStore.authData?.fullProfile === false) {
			return navigateTo(targetProfile);
		}
		if (userRole === 2) {
			return navigateTo("/admin");
		}
		if (userRole === 3) {
			if (!cashRegisterStore.currentRegister && !cashRegisterStore.loading) {
				await cashRegisterStore.getCurrentRegister();
			}
			return navigateTo(
				cashRegisterStore.currentRegister?.isOpen
					? "/admin"
					: "/manager/cash-register/open",
			);
		}
		return navigateTo("/home");
	}

	const profileIncomplete =
		authStore.authenticated && authStore.authData?.fullProfile === false;

	if (profileIncomplete && to.path !== targetProfile) {
		return navigateTo(targetProfile);
	}

	if (
		authStore.authenticated &&
		userRole === 3 &&
		authStore.authData?.fullProfile !== false
	) {
		if (!cashRegisterStore.currentRegister && !cashRegisterStore.loading) {
			await cashRegisterStore.getCurrentRegister();
		}

		const isOpen = cashRegisterStore.currentRegister?.isOpen === true;

		if (
			!isOpen &&
			to.path !== "/manager/cash-register/open" &&
			to.path !== "/manager/profile"
		) {
			return navigateTo("/manager/cash-register/open");
		}

		if (isOpen && to.path === "/manager/cash-register/open") {
			return navigateTo("/admin");
		}
	}

	const allProfilePaths = ["/admin/profile", "/manager/profile", "/profile"];
	if (
		authStore.authenticated &&
		allProfilePaths.includes(to.path) &&
		to.path !== targetProfile
	) {
		return navigateTo(targetProfile);
	}

	if (to.meta.roles && authStore.authData.roleId === 0) {
		return navigateTo("/login");
	}

	if (
		authStore.authenticated &&
		(!isExistValueId(userStore.userForm?.id) ||
			!isExistValueId(ownerStore.ownerData?.id))
	) {
		if (userRole === 2) {
			await ownerStore.getOwner();
		} else if (userRole === 3) {
			await managerStore.getManager();
		} else if (userRole === 4) {
			await userStore.getUser();
		}
	}

	if (to.meta.roles) {
		const allowedRoles = Array.isArray(to.meta.roles)
			? to.meta.roles
			: serializeToJson(to.meta.roles, []);

		if (!allowedRoles.includes(userRole)) {
			return navigateTo([2, 3].includes(userRole) ? "/admin" : "/home");
		}
	}
});

function isExistValueId(value: number | undefined): boolean {
	return value !== undefined && value !== null && value > 0;
}
