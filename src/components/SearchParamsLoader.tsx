"use client";

import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

interface SearchParamsLoaderProps {
  onParamsReceived: (params: ReadonlyURLSearchParams) => void;
}

function Suspender(props: SearchParamsLoaderProps) {
  return (
    <Suspense>
      <Suspended {...props} />
    </Suspense>
  );
}

function Suspended({ onParamsReceived }: SearchParamsLoaderProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onParamsReceived(searchParams);
  });

  return null;
}

const SearchParamsLoader = React.memo(Suspender);
export default SearchParamsLoader;
