import CurrentBalance from "../dashboard/balance/CurrentBalance";
import { CurrentHoldings } from "../dashboard/holding/CurrentHoldings";
import CurrentNotes from "../dashboard/notes/CurrentNotes";
import CurrentPerformance from "../dashboard/performance/CurrentPerformance";
import CurrentTransactions from "../dashboard/transaction/CurrentTransactions";

const AdvancedChart = () => {
  return (
    <div className="flex px-1 lg:px-4 gap-1 lg:gap-4">
      <div className="block md:flex w-full px-1 lg:px-4 gap-1 lg:gap-4">
        <div className="block xs:flex md:block justify-center gap-4">
          <div className="dark:bg-gray-800 bg-gray-600 w-[320px] flex justify-center mx-auto px-2 rounded-xl p-4 mt-4">
            <CurrentBalance />
          </div>

          <div className=" dark:bg-gray-800 bg-gray-600 w-[320px] flex justify-center mx-auto px-2 rounded-xl p-4 mt-4">
            <CurrentPerformance />
          </div>
          <div className=" dark:bg-gray-800 bg-gray-600 w-[320px]  px-2 rounded-xl p-4 mt-4">
            <CurrentHoldings />
          </div>


          <div className=" dark:bg-gray-800 bg-gray-600 w-[320px] flex justify-center mx-auto px-2 rounded-xl p-4 mt-4">
            <CurrentNotes />
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
