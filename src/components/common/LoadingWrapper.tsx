import type React from "react";
import { useEffect, useRef } from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import useLoadingStore from "../../store/useLoadingStore";

interface LoadingWrapperProps {
  children?: React.ReactNode;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  const { isLoading: isStoreLoading, pendingRequests } = useLoadingStore();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const ref = useRef<LoadingBarRef>(null);

  const isApiLoading =
    isFetching > 0 || isMutating > 0 || isStoreLoading || pendingRequests > 0;

  useEffect(() => {
    if (isApiLoading) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [isApiLoading]);

  return (
    <>
      <LoadingBar
        color="#b7000c"
        ref={ref}
        height={3}
        shadow={true}
      />
      {children}
    </>
  );
};

export default LoadingWrapper;
