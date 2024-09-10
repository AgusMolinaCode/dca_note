"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { loadUsers, searchCryptos } from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import FirstDialogModal from "../modals/FirstDialogModal";
import SecondDialogModal from "../modals/SecondDialogModal";
import { useUser } from "@clerk/clerk-react";
import NicknameDialogModal from "../modals/NicknameDialogModal";

function useDebouncedQuery(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return useQuery({
    queryKey: ["searchCryptos", debouncedQuery],
    queryFn: () => searchCryptos(debouncedQuery),
    enabled: !!debouncedQuery,
  });
}

export function ButtonAsset() {
  const [selectedCrypto, setSelectedCrypto] = useState<{
    crypto: string;
    price: number;
    imageUrl: string;
  } | null>(null);

  const { user } = useUser();
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: loadUsers,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const {
    data: searchResults,
    isLoading,
    isSuccess,
  } = useDebouncedQuery(query);

  const handleSelect = (crypto: string, price: number, imageUrl: string) => {
    setSelectedCrypto({ crypto, price, imageUrl });
    setIsDialogOpen(true);
    setIsMainDialogOpen(false);
  };

  const dataUserId = data?.filter((item) => item.clerkId === user?.id);

  return (
    <div>
      <>
        {dataUserId && dataUserId.length > 0 ? (
          <>
            <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
              <DialogTrigger asChild>
              <button className="group rounded-xl relative inline-flex h-9 items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-700 px-3 md:px-6 font-medium text-neutral-200 transition hover:scale-110">
                <span className="text-sm md:text-md">Add Asset</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20"></div>
                </div>
              </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Asset</DialogTitle>
                </DialogHeader>
                <FirstDialogModal
                  query={query}
                  setQuery={setQuery}
                  searchResults={searchResults as any}
                  isLoading={isLoading}
                  isSuccess={isSuccess}
                  handleSelect={handleSelect as any}
                />
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[425px] bg-gray-800">
                <DialogTitle hidden />
                <SecondDialogModal
                  selectedCrypto={selectedCrypto}
                  onAddTransaction={() => {
                    setIsDialogOpen(false);
                    setIsMainDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
            <DialogTrigger asChild>
              <button className="group rounded-xl relative inline-flex h-9 items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-700 px-3 md:px-6 font-medium text-neutral-200 transition hover:scale-110">
                <span className="text-sm md:text-md">Add Nickname</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20"></div>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">Add Nickname</DialogTitle>
              </DialogHeader>
              <NicknameDialogModal />
            </DialogContent>
          </Dialog>
        )}
      </>
    </div>
  );
}
