import { getCryptos } from "@/app/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import InfiniteMovingCardsDemo from "./MarqueeDemo";

export default async function CryptoFetchBar() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["cryptos"],
    queryFn: getCryptos,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex flex-col items-center justify-center">
        <InfiniteMovingCardsDemo />
      </main>
    </HydrationBoundary>
  );
}
