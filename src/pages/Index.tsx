
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import UserInfoForm from "@/components/UserInfoForm";
import DietaryPreferenceForm from "@/components/DietaryPreferenceForm";
import MealPlanGenerator from "@/components/MealPlanGenerator";
import MealPlanDisplay from "@/components/MealPlanDisplay";
import { useUser } from "@/context/UserContext";

const StepContent = () => {
  const { currentStep } = useUser();

  switch (currentStep) {
    case 0:
      return <UserInfoForm />;
    case 1:
      return <DietaryPreferenceForm />;
    case 2:
      return <MealPlanGenerator />;
    case 3:
      return <MealPlanDisplay />;
    default:
      return <UserInfoForm />;
  }
};

const IndexContent = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Header />
      <div className="container mx-auto pt-4">
        <StepIndicator />
        <StepContent />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <UserProvider>
      <IndexContent />
    </UserProvider>
  );
};

export default Index;
