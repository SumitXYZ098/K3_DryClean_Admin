/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const CUSTOMERS_QUERY_KEY = ["customers"];

export const useCustomerHook = () => {
  const queryClient = useQueryClient();
  const {
    customers: storeCustomers,
    hasFetched,
    setCustomers,
    addCustomer: addCustomerToStore,
    toggleCustomerStatus: toggleCustomerStatusStore,
    deleteCustomer: deleteCustomerStore,
  } = useCustomerStore();

  const { showLoading, hideLoading } = useLoadingStore();
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    // Connect socket for real-time customer updates
    connectSocket();
  }, []);

  // TanStack React Query - Get Data (Fetch Customers)
  const {
    data: queriedCustomers,
    isLoading: isQueryLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<Customer[]>({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: async () => {
      const response: GetCustomerResponse = await customerApi.getCustomer();
      const mappedCustomers = (response.data || []).map(
        mapCustomerProfileToCustomer
      );
      setCustomers(mappedCustomers);
      return mappedCustomers;
    },
    initialData: storeCustomers.length > 0 ? storeCustomers : undefined,
  });

  // Keep Zustand store in sync when query data updates
  useEffect(() => {
    if (queriedCustomers && queriedCustomers.length > 0) {
      setCustomers(queriedCustomers);
    }
  }, [queriedCustomers, setCustomers]);

  // Keep React Query cache in sync when storeCustomers changes (e.g. via Socket.IO events)
  useEffect(() => {
    if (storeCustomers && storeCustomers.length > 0) {
      queryClient.setQueryData<Customer[]>(CUSTOMERS_QUERY_KEY, storeCustomers);
    }
  }, [storeCustomers, queryClient]);

  /**
   * Fetch all customers (Refetch Wrapper with backwards compatibility)
   * @param force - Optional boolean to force refetch from backend even if cached
   */
  const fetchCustomers = useCallback(
    async (force = false): Promise<Customer[]> => {
      const state = useCustomerStore.getState();
      if (state.hasFetched && !force && state.customers.length > 0) {
        return state.customers;
      }
      if (state.customers.length === 0) {
        showLoading("Fetching customer directory...");
      }
      try {
        const result = await refetch();
        return result.data || state.customers;
      } finally {
        hideLoading();
      }
    },
    [refetch, showLoading, hideLoading]
  );

  // TanStack React Query - Post Data (Create Customer Mutation)
  const createCustomerMutation = useMutation<
    { response: CreateCustomerResponse; customer: Customer },
    Error,
    CreateCustomerPayload
  >({
    mutationFn: async (payload: CreateCustomerPayload) => {
      showLoading("Creating customer account...");
      try {
        const response: CreateCustomerResponse =
          await customerApi.createCustomer(payload);
        const mappedCustomer = mapCustomerProfileToCustomer(response.data);
        return { response, customer: mappedCustomer };
      } finally {
        hideLoading();
      }
    },
    onSuccess: ({ response, customer }) => {
      const currentList = queryClient.getQueryData<Customer[]>(CUSTOMERS_QUERY_KEY) || storeCustomers;
      const updatedList = [customer, ...currentList];
      queryClient.setQueryData(CUSTOMERS_QUERY_KEY, updatedList);
      setCustomers(updatedList);

      showSnackbar({
        message: response.message || "Customer created successfully.",
        type: "success",
      });

      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
    onError: (err: any) => {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create customer. Please check the provided information.";
      showSnackbar({
        message: errMsg,
        type: "error",
      });
    },
  });

  /**
   * Create customer via API (Wrapper calling React Query mutation)
   */
  const createCustomer = useCallback(
    async (payload: CreateCustomerPayload) => {
      return createCustomerMutation.mutateAsync(payload);
    },
    [createCustomerMutation]
  );

  /**
   * Local/Offline add customer fallback
   */
  const addCustomer = useCallback(
    (data: Parameters<typeof addCustomerToStore>[0]) => {
      const newCustomer = addCustomerToStore(data);
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      return newCustomer;
    },
    [addCustomerToStore, queryClient]
  );

  /**
   * Toggle customer active/suspended status
   */
  const toggleCustomerStatus = useCallback(
    (id: string) => {
      toggleCustomerStatusStore(id);
      queryClient.setQueryData<Customer[]>(CUSTOMERS_QUERY_KEY, (old) =>
        old
          ? old.map((c) =>
              c.id === id
                ? { ...c, status: c.status === "Active" ? "Suspended" : "Active" }
                : c
            )
          : undefined
      );
    },
    [toggleCustomerStatusStore, queryClient]
  );

  /**
   * Delete customer from store
   */
  const deleteCustomer = useCallback(
    (id: string) => {
      deleteCustomerStore(id);
      queryClient.setQueryData<Customer[]>(CUSTOMERS_QUERY_KEY, (old) =>
        old ? old.filter((c) => c.id !== id) : undefined
      );
    },
    [deleteCustomerStore, queryClient]
  );

  const activeCustomers = queriedCustomers || storeCustomers;
  const errorMessage = queryError
    ? (queryError as any).response?.data?.message || (queryError as Error).message || "Failed to fetch customer directory."
    : null;

  return {
    customers: activeCustomers,
    hasFetched,
    isLoading: isQueryLoading || isFetching || createCustomerMutation.isPending,
    isFetching,
    error: errorMessage,
    refetch,
    fetchCustomers,
    createCustomer,
    addCustomer,
    toggleCustomerStatus,
    deleteCustomer,
    createCustomerMutation,
  };
};

export type { CustomerProfileData, CreateCustomerPayload };
export default useCustomerHook;
