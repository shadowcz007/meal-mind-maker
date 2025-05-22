
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface UserData {
  gender: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  targetWeight: number | null;
  activityLevel: string;
  dietaryPreferences: {
    restrictions: string[];
    cuisineType: string;
    cookingTime: string;
  };
  bmi?: number;
}

export interface AppSettings {
  apiKey: string;
  apiUrl: string;
  model: string;
}

interface UserContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  mealPlan: string | null;
  setMealPlan: React.Dispatch<React.SetStateAction<string | null>>;
  shoppingList: string[] | null;
  setShoppingList: React.Dispatch<React.SetStateAction<string[] | null>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const initialUserData: UserData = {
  gender: "male",
  age: null,
  height: null,
  weight: null,
  targetWeight: null,
  activityLevel: "moderate",
  dietaryPreferences: {
    restrictions: [],
    cuisineType: "chinese",
    cookingTime: "medium",
  },
};

const initialSettings: AppSettings = {
  apiKey: "",
  apiUrl: "https://api.siliconflow.cn/v1/chat/completions",
  model: "Qwen/Qwen3-8B",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<string[] | null>(null);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        mealPlan,
        setMealPlan,
        shoppingList,
        setShoppingList,
        settings,
        setSettings,
        isLoading,
        setIsLoading,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
