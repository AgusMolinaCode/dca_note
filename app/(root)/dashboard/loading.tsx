import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="h-[600px] flex justify-center items-center">
            <Skeleton className="w-[600px] h-[600px] " />
        </div>
    )
  }