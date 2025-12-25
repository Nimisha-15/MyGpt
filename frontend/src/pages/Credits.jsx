import React, { useEffect, useState } from "react";
import { dummyPlans } from "../assets/assets";
import Loading from "./Loading";

const Credits = () => {
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPlan(dummyPlans);
    setLoading(false);
  }, []);

  const buyPlan = (planName) => {
    alert(`Payment system removed.\nYou selected: ${planName}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto mt-10 sm:px-6 lg:px-8 px-4 py-7 ">
      <h2 className="text-3xl font-semibold text-center xl:mt-20 mb-16 text-gray-800 dark:text-white">
        Credits Plans
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {plan.map((plan) => (
          <div
            key={plan._id}
            className={`border rounded-lg shadow p-6 min-w-[300px] flex flex-col ${
              plan._id === "pro"
                ? "bg-cyan-50 dark:bg-cyan-900"
                : "bg-white dark:bg-transparent"
            }`}
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>

              <p className="text-2xl font-semibold text-sky-600 mb-4">
                ${plan.price}
                <span className="text-base text-gray-600">
                  {" "}
                  / {plan.credits} credits
                </span>
              </p>

              <ul className="list-disc list-inside text-sm space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <button
              className="mt-5 text-white py-2 rounded bg-blue-600 hover:bg-blue-700"
              onClick={() => buyPlan(plan.name)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
