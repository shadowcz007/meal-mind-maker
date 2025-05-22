
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { generateMealPlan } from "@/services/mealPlanService";
import { formatUserDataForPrompt, extractShoppingList } from "@/utils/calculations";
import { toast } from "sonner";

const MealPlanGenerator = () => {
  const { 
    userData, 
    settings, 
    isLoading, 
    setIsLoading, 
    setCurrentStep, 
    mealPlan, 
    setMealPlan,
    setShoppingList
  } = useUser();

  const [apiError, setApiError] = useState<string | null>(null);

  const validateSettings = () => {
    if (!settings.apiKey) {
      toast.error("请先设置API密钥");
      return false;
    }
    return true;
  };

  const handleGenerateMealPlan = async () => {
    if (!validateSettings()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const userPrompt = formatUserDataForPrompt(userData);
      const result = await generateMealPlan(userPrompt, settings);
      setMealPlan(result);
      
      // Extract shopping list items from the meal plan
      const items = extractShoppingList(result);
      setShoppingList(items);
      
      setCurrentStep(3);
    } catch (error) {
      console.error("Meal plan generation error:", error);
      setApiError(error instanceof Error ? error.message : "生成食谱失败，请检查API设置");
      toast.error(error instanceof Error ? error.message : "生成食谱失败，请检查API设置");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setCurrentStep(1);
  };

  useEffect(() => {
    if (!settings.apiKey) {
      toast("请先设置API密钥才能生成食谱", {
        description: "点击右上角的设置按钮配置API",
      });
    }
  }, [settings.apiKey]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-nutrition-primary mb-6 text-center">
        生成每日减脂食谱
      </h2>

      <div className="space-y-4 mb-6">
        <div className="p-4 border border-nutrition-light rounded-md bg-nutrition-light">
          <h3 className="font-semibold text-nutrition-primary mb-2">您的信息摘要</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <span className="font-medium">性别:</span> {userData.gender === "male" ? "男" : "女"}
            </li>
            <li>
              <span className="font-medium">年龄:</span> {userData.age} 岁
            </li>
            <li>
              <span className="font-medium">身高/体重:</span> {userData.height}cm / {userData.weight}kg
            </li>
            <li>
              <span className="font-medium">目标体重:</span> {userData.targetWeight}kg
            </li>
            <li>
              <span className="font-medium">饮食限制:</span> {userData.dietaryPreferences.restrictions.length > 0 
                ? userData.dietaryPreferences.restrictions.join(", ") 
                : "无"}
            </li>
          </ul>
        </div>
      </div>

      {apiError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          <p className="font-medium">错误</p>
          <p className="text-sm">{apiError}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
        >
          返回
        </Button>
        <Button
          className="bg-nutrition-primary hover:bg-nutrition-secondary"
          onClick={handleGenerateMealPlan}
          disabled={isLoading}
        >
          {isLoading ? "生成中..." : "生成食谱"}
        </Button>
      </div>
    </div>
  );
};

export default MealPlanGenerator;
