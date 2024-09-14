import CurrentBalance from "../dashboard/balance/CurrentBalance";
import { CurrentHoldings } from "../dashboard/holding/CurrentHoldings";
import CurrentNotes from "../dashboard/notes/CurrentNotes";
import CurrentPerformance from "../dashboard/performance/CurrentPerformance";
import CurrentTransactions from "../dashboard/transaction/CurrentTransactions";

const AdvancedChart = () => {
  return (
    <div className="flex px-1 lg:px-4 gap-1 lg:gap-4">
      <div className="block lg:flex w-full px-1 lg:px-4 gap-1 lg:gap-4">
        <div className="block justify-center gap-4 px-1 md:px-0">
          <div className="lg:block block sm:flex gap-2">
            <div className="dark:bg-gray-800 bg-white shadow-md border dark:border-none border-gray-200 w-full lg:w-[260px] flex justify-center mx-auto px-2 rounded-xl p-4 mt-4">
              <CurrentBalance />
            </div>

            <div className=" dark:bg-gray-800 bg-white shadow-md border dark:border-none border-gray-200 w-full lg:w-[260px] flex justify-center mx-auto px-2 rounded-xl p-4 mt-4">
              <CurrentPerformance />
            </div>
          </div>
          <div className="lg:block block sm:flex gap-2">
            <div className=" dark:bg-gray-800 bg-white shadow-md border dark:border-none border-gray-200 w-full lg:w-[260px] flex justify-center mx-auto px-2 rounded-xl p-4 mt-4">
              <CurrentHoldings />
            </div>

            {/* <div className=" dark:bg-gray-800 bg-white shadow-md border dark:border-none border-gray-200 w-full lg:w-[260px] flex justify-center mx-auto px-2 rounded-xl p-4 mt-4">
              <CurrentNotes />
            </div> */}
          </div>
        </div>

        <div className="w-full">
          <div className="mt-4">
            <CurrentTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChart;
