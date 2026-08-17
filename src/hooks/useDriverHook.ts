/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import driverApi, {
  type CreateDriverPayload,
  type UpdateDriverPayload,
  type CreateDriverResponse,
  type UpdateDriverResponse,
  type GetDriverByIdResponse,
  type UploadFileResponse,
} from "../api/driverApi";
import useDriverStore, {
  type Driver,
  mapApiDriverToDriver,
} from "../store/useDriverStore";
import useLoadingStore from "../store/useLoadingStore";
import useSnackbarStore from "../store/useSnackbarStore";

export const DRIVERS_QUERY_KEY = ["drivers"];

export const useDriverHook = () => {
  const queryClient = useQueryClient();
  const {
    drivers: storeDrivers,
    selectedDriver,
    hasFetched,
    setDrivers,
    addDriver: addDriverToStore,
    updateDriverInStore,
    deleteDriverFromStore,
    setSelectedDriver,
  } = useDriverStore();

  const { showLoading, hideLoading } = useLoadingStore();
  const { showSnackbar } = useSnackbarStore();

  // TanStack React Query - Get All Drivers
  const {
    data: queriedDrivers,
    isLoading: isDriversLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<Driver[]>({
    queryKey: DRIVERS_QUERY_KEY,
    queryFn: async () => {
      const response = await driverApi.getAllDrivers();
      const mapped = (response.data || []).map(mapApiDriverToDriver);
      setDrivers(mapped);
      return mapped;
    },
    initialData: storeDrivers.length > 0 ? storeDrivers : undefined,
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (queriedDrivers && queriedDrivers.length > 0) {
      setDrivers(queriedDrivers);
    }
  }, [queriedDrivers, setDrivers]);

  /**
   * Fetch all drivers from API (Refetch wrapper)
   * @param force - Force refetch from backend
   */
  const fetchDrivers = useCallback(
    async (force = false): Promise<Driver[]> => {
      const state = useDriverStore.getState();
      if (state.hasFetched && !force && state.drivers.length > 0) {
        return state.drivers;
      }
      const result = await refetch();
      return result.data || state.drivers;
    },
    [refetch]
  );

  /**
   * Fetch driver details by documentId
   */
  const fetchDriverById = useCallback(
    async (documentId: string): Promise<Driver> => {
      showLoading("Fetching driver details...");
      try {
        const response: GetDriverByIdResponse =
          await driverApi.getDriverById(documentId);
        const mapped = mapApiDriverToDriver(response.data);
        setSelectedDriver(mapped);
        return mapped;
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch driver details.";
        showSnackbar({ message: errMsg, type: "error" });
        throw err;
      } finally {
        hideLoading();
      }
    },
    [setSelectedDriver, showLoading, hideLoading, showSnackbar]
  );

  // TanStack React Query - Post Data (Create Driver Mutation)
  const createDriverMutation = useMutation<
    { response: CreateDriverResponse; driver: Driver },
    Error,
    CreateDriverPayload
  >({
    mutationFn: async (payload: CreateDriverPayload) => {
      showLoading("Registering new driver...");
      try {
        const response = await driverApi.createDriver(payload);
        const mappedDriver = mapApiDriverToDriver(response.data);
        return { response, driver: mappedDriver };
      } finally {
        hideLoading();
      }
    },
    onSuccess: ({ response, driver }) => {
      addDriverToStore(driver);
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });

      showSnackbar({
        message:
          response.message ||
          `Driver "${driver.fullName}" registered successfully.`,
        type: "success",
      });
    },
    onError: (err: any) => {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create driver. Please try again.";
      showSnackbar({ message: errMsg, type: "error" });
    },
  });

  const createDriver = useCallback(
    async (payload: CreateDriverPayload) => {
      return createDriverMutation.mutateAsync(payload);
    },
    [createDriverMutation]
  );

  // TanStack React Query - Update Driver Mutation
  const updateDriverMutation = useMutation<
    { response: UpdateDriverResponse; driver: Driver },
    Error,
    { documentId: string; payload: UpdateDriverPayload }
  >({
    mutationFn: async ({ documentId, payload }) => {
      showLoading("Updating driver details...");
      try {
        const response = await driverApi.updateDriver(documentId, payload);
        const mappedDriver = response.data
          ? mapApiDriverToDriver(response.data)
          : ({
              ...useDriverStore
                .getState()
                .drivers.find((d) => d.documentId === documentId),
              ...payload,
            } as Driver);
        return { response, driver: mappedDriver };
      } finally {
        hideLoading();
      }
    },
    onSuccess: ({ response, driver }, variables) => {
      updateDriverInStore(variables.documentId, driver);
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });

      showSnackbar({
        message:
          response.message ||
          `Driver "${driver.fullName}" updated successfully.`,
        type: "success",
      });
    },
    onError: (err: any) => {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update driver.";
      showSnackbar({ message: errMsg, type: "error" });
    },
  });

  const updateDriver = useCallback(
    async (documentId: string, payload: UpdateDriverPayload) => {
      return updateDriverMutation.mutateAsync({ documentId, payload });
    },
    [updateDriverMutation]
  );

  // TanStack React Query - Delete Driver Mutation
  const deleteDriverMutation = useMutation<void, Error, string>({
    mutationFn: async (documentId: string) => {
      showLoading("Removing driver...");
      try {
        await driverApi.deleteDriver(documentId);
      } finally {
        hideLoading();
      }
    },
    onSuccess: (_, documentId) => {
      deleteDriverFromStore(documentId);
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
      showSnackbar({
        message: "Driver removed from roster.",
        type: "info",
      });
    },
    onError: (_, documentId) => {
      deleteDriverFromStore(documentId);
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
      showSnackbar({
        message: "Driver removed locally.",
        type: "info",
      });
    },
  });

  const deleteDriver = useCallback(
    async (documentId: string) => {
      return deleteDriverMutation.mutateAsync(documentId);
    },
    [deleteDriverMutation]
  );

  // TanStack React Query - Upload Document Mutation
  const uploadDocumentMutation = useMutation<UploadFileResponse[], Error, File>({
    mutationFn: async (file: File) => {
      showLoading(`Uploading ${file.name}...`);
      try {
        return await driverApi.uploadDocument(file);
      } finally {
        hideLoading();
      }
    },
    onSuccess: (_, file) => {
      showSnackbar({
        message: `Document "${file.name}" uploaded successfully!`,
        type: "success",
      });
    },
    onError: (_, file) => {
      showSnackbar({
        message: `Failed to upload ${file.name}.`,
        type: "error",
      });
    },
  });

  const uploadDocumentFile = useCallback(
    async (file: File) => {
      return uploadDocumentMutation.mutateAsync(file);
    },
    [uploadDocumentMutation]
  );

  /**
   * Toggle driver active status
   */
  const toggleDriverStatus = useCallback(
    async (driver: Driver) => {
      const newStatus = !driver.isActive;
      try {
        await updateDriver(driver.documentId, { isActive: newStatus });
      } catch {
        updateDriverInStore(driver.documentId, { isActive: newStatus });
        queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
        showSnackbar({
          message: `Driver status set to ${newStatus ? "Active" : "Offline"}.`,
          type: newStatus ? "success" : "info",
        });
      }
    },
    [updateDriver, updateDriverInStore, showSnackbar, queryClient]
  );

  const activeDrivers = queriedDrivers || storeDrivers;
  const errorMessage = queryError
    ? (queryError as any).response?.data?.message || (queryError as Error).message || "Failed to fetch drivers."
    : null;

  return {
    drivers: activeDrivers,
    selectedDriver,
    hasFetched,
    isLoading:
      isDriversLoading ||
      createDriverMutation.isPending ||
      updateDriverMutation.isPending ||
      deleteDriverMutation.isPending,
    isFetching,
    error: errorMessage,
    refetch,
    fetchDrivers,
    fetchDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
    uploadDocumentFile,
    toggleDriverStatus,
    setSelectedDriver,
    createDriverMutation,
    updateDriverMutation,
    deleteDriverMutation,
  };
};

export default useDriverHook;
