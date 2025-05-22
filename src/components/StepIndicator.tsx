
import { useUser } from "@/context/UserContext";

const StepIndicator = () => {
  const { currentStep } = useUser();
  const steps = ["基础信息", "饮食偏好", "生成食谱", "购物清单"];

  return (
    <div className="w-full px-4 py-5">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              index <= currentStep ? "text-nutrition-primary" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 mb-2 ${
                index < currentStep
                  ? "bg-nutrition-primary border-nutrition-primary text-white"
                  : index === currentStep
                  ? "border-nutrition-primary text-nutrition-primary"
                  : "border-gray-300 text-gray-300"
              }`}
            >
              {index < currentStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className="text-sm font-medium">{step}</span>
          </div>
        ))}
      </div>
      <div className="relative flex justify-between items-center mb-12">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`flex-1 ${index === steps.length - 1 ? "hidden" : ""}`}
          >
            <div
              className={`h-1 ${
                index < currentStep ? "bg-nutrition-primary" : "bg-gray-300"
              }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
