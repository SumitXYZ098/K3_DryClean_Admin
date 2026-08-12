/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
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

export const useDriverHook = () => {
  const {
    drivers,
    selectedDriver,
    hasFetched,
    setDrivers,
    addDriver: addDriverToStore,
    updateDriverInStore,
    deleteDriverFromStore,
    setSelectedDriver,
  } = useDriverStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { showLoading, hideLoading } = useLoadingStore();
  const { showSnackbar } = useSnackbarStore();

  /**
   * Fetch all drivers from API
   * @param force - Force refetch from backend
   */
  const fetchDrivers = useCallback(
    async (force = false): Promise<Driver[]> => {
      const state = useDriverStore.getState();

      if (state.hasFetched && !force && state.drivers.length > 0) {
        return state.drivers;
      }

      setIsLoading(true);
      setError(null);

      if (state.drivers.length === 0) {
        showLoading("Fetching driver roster...");
      }

      try {
        const response = await driverApi.getAllDrivers();
        const mapped = (response.data || []).map(mapApiDriverToDriver);
        setDrivers(mapped);
        return mapped;
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch drivers.";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [setDrivers, showLoading, hideLoading]
  );

  /**
   * Fetch driver details by documentId
   */
  const fetchDriverById = useCallback(
    async (documentId: string): Promise<Driver> => {
      setIsLoading(true);
      setError(null);
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
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [setSelectedDriver, showLoading, hideLoading]
  );

  /**
   * Create a new driver via API
   */
  const createDriver = useCallback(
    async (
      payload: CreateDriverPayload
    ): Promise<{ response: CreateDriverResponse; driver: Driver }> => {
      setIsLoading(true);
      setError(null);
      showLoading("Registering new driver...");

      try {
        const response = await driverApi.createDriver(payload);
        const mappedDriver = mapApiDriverToDriver(response.data);

        addDriverToStore(mappedDriver);

        // Automatically refetch driver list from backend to sync latest roster
        try {
          const freshList = await driverApi.getAllDrivers();
          if (freshList?.data) {
            setDrivers(freshList.data.map(mapApiDriverToDriver));
          }
        } catch {
          // Ignore refetch errors to maintain local store update
        }

        showSnackbar({
          message: response.message || `Driver "${mappedDriver.fullName}" registered successfully.`,
          type: "success",
        });

        return { response, driver: mappedDriver };
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to create driver. Please try again.";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [addDriverToStore, setDrivers, showLoading, hideLoading, showSnackbar]
  );

  /**
   * Update driver via API
   */
  const updateDriver = useCallback(
    async (
      documentId: string,
      payload: UpdateDriverPayload
    ): Promise<{ response: UpdateDriverResponse; driver: Driver }> => {
      setIsLoading(true);
      setError(null);
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

        updateDriverInStore(documentId, mappedDriver);

        // Automatically refetch driver list from backend to sync latest roster
        try {
          const freshList = await driverApi.getAllDrivers();
          if (freshList?.data) {
            setDrivers(freshList.data.map(mapApiDriverToDriver));
          }
        } catch {
          // Ignore refetch errors to maintain local store update
        }

        showSnackbar({
          message: response.message || `Driver "${mappedDriver.fullName}" updated successfully.`,
          type: "success",
        });

        return { response, driver: mappedDriver };
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to update driver.";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [updateDriverInStore, setDrivers, showLoading, hideLoading, showSnackbar]
  );

  /**
   * Delete driver via API
   */
  const deleteDriver = useCallback(
    async (documentId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      showLoading("Removing driver...");

      try {
        await driverApi.deleteDriver(documentId);
        deleteDriverFromStore(documentId);

        // Automatically refetch driver list from backend to sync latest roster
        try {
          const freshList = await driverApi.getAllDrivers();
          if (freshList?.data) {
            setDrivers(freshList.data.map(mapApiDriverToDriver));
          }
        } catch {
          // Ignore refetch errors to maintain local store update
        }

        showSnackbar({
          message: "Driver removed from roster.",
          type: "info",
        });
      } catch {
        // Even if server request fails, provide fallback removal or report error
        deleteDriverFromStore(documentId);
        showSnackbar({
          message: "Driver removed locally.",
          type: "info",
        });
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [deleteDriverFromStore, setDrivers, showLoading, hideLoading, showSnackbar]
  );

  /**
   * Upload document file helper
   */
  const uploadDocumentFile = useCallback(
    async (file: File): Promise<UploadFileResponse[]> => {
      showLoading(`Uploading ${file.name}...`);
      try {
        const result = await driverApi.uploadDocument(file);
        showSnackbar({
          message: `Document "${file.name}" uploaded successfully!`,
          type: "success",
        });
        return result;
      } catch (err: any) {
        showSnackbar({
          message: `Failed to upload ${file.name}.`,
          type: "error",
        });
        throw err;
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading, showSnackbar]
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
        // Fallback update in store
        updateDriverInStore(driver.documentId, { isActive: newStatus });
        showSnackbar({
          message: `Driver status set to ${newStatus ? "Active" : "Offline"}.`,
          type: newStatus ? "success" : "info",
        });
      }
    },
    [updateDriver, updateDriverInStore, showSnackbar]
  );

  return {
    drivers,
    selectedDriver,
    hasFetched,
    isLoading,
    error,
    fetchDrivers,
    fetchDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
    uploadDocumentFile,
    toggleDriverStatus,
    setSelectedDriver,
  };
};

export default useDriverHook;
