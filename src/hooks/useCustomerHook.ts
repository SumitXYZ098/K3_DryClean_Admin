/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import customerApi, {
  type CreateCustomerPayload,
  type CreateCustomerResponse,
  type GetCustomerResponse,
  type CustomerProfileData,
} from "../api/customerApi";
import useCustomerStore, {
  type Customer,
  mapCustomerProfileToCustomer,
} from "../store/useCustomerStore";
import useLoadingStore from "../store/useLoadingStore";
import useSnackbarStore from "../store/useSnackbarStore";
import { connectSocket } from "../services/socketService";

export const useCustomerHook = () => {
  const {
    customers,
    hasFetched,
    setCustomers,
    addCustomer: addCustomerToStore,
    toggleCustomerStatus: toggleCustomerStatusStore,
    deleteCustomer: deleteCustomerStore,
  } = useCustomerStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { showLoading, hideLoading } = useLoadingStore();
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    // Connect socket for real-time customer updates
    connectSocket();
  }, []);

  /**
   * Fetch all customers from API
   * @param force - Optional boolean to force refetch from backend even if cached
   */
  const fetchCustomers = useCallback(
    async (force = false): Promise<Customer[]> => {
      const state = useCustomerStore.getState();

      // Return cached customers if already fetched and not forced
      if (state.hasFetched && !force && state.customers.length > 0) {
        return state.customers;
      }

      setIsLoading(true);
      setError(null);

      // Only display global loading overlay if no cached data exists
      if (state.customers.length === 0) {
        showLoading("Fetching customer directory...");
      }

      try {
        const response: GetCustomerResponse = await customerApi.getCustomer();
        const mappedCustomers = (response.data || []).map(
          mapCustomerProfileToCustomer
        );

        setCustomers(mappedCustomers);
        return mappedCustomers;
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch customer directory.";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [setCustomers, showLoading, hideLoading]
  );

  /**
   * Create customer via API
   * Payload: CreateCustomerPayload
   */
  const createCustomer = useCallback(
    async (
      payload: CreateCustomerPayload
    ): Promise<{ response: CreateCustomerResponse; customer: Customer }> => {
      setIsLoading(true);
      setError(null);
      showLoading("Creating customer account...");

      try {
        const response: CreateCustomerResponse =
          await customerApi.createCustomer(payload);
        const mappedCustomer = mapCustomerProfileToCustomer(response.data);

        // Add created customer to top of customer store array
        setCustomers([mappedCustomer, ...customers]);

        showSnackbar({
          message: response.message || "Customer created successfully.",
          type: "success",
        });

        return { response, customer: mappedCustomer };
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to create customer. Please check the provided information.";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [customers, setCustomers, showLoading, hideLoading, showSnackbar]
  );

  /**
   * Local/Offline add customer fallback
   */
  const addCustomer = useCallback(
    (data: Parameters<typeof addCustomerToStore>[0]) => {
      return addCustomerToStore(data);
    },
    [addCustomerToStore]
  );

  /**
   * Toggle customer active/suspended status
   */
  const toggleCustomerStatus = useCallback(
    (id: string) => {
      toggleCustomerStatusStore(id);
    },
    [toggleCustomerStatusStore]
  );

  /**
   * Delete customer from store
   */
  const deleteCustomer = useCallback(
    (id: string) => {
      deleteCustomerStore(id);
    },
    [deleteCustomerStore]
  );

  return {
    customers,
    hasFetched,
    isLoading,
    error,
    fetchCustomers,
    createCustomer,
    addCustomer,
    toggleCustomerStatus,
    deleteCustomer,
  };
};

export type { CustomerProfileData, CreateCustomerPayload };
export default useCustomerHook;
