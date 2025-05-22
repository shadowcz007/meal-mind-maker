
import { UserData } from "../context/UserContext";

export const calculateBMI = (height: number, weight: number): number => {
  // Height in cm, weight in kg
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const calculateBMR = (userData: UserData): number => {
  if (!userData.weight || !userData.height || !userData.age || !userData.gender) {
    return 0;
  }
  
  // Using the Mifflin-St Jeor Equation
  let bmr = 0;
  if (userData.gender === "male") {
    bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5;
  } else {
    bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age - 161;
  }
  
  return Math.round(bmr);
};

export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Heavy exercise 6-7 days/week
    veryActive: 1.9, // Very heavy exercise, physical job or training twice/day
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
};

export const calculateDailyCalorieTarget = (tdee: number): number => {
  // Safe deficit for weight loss (500 kcal is common)
  return tdee - 500;
};

export const formatUserDataForPrompt = (userData: UserData): string => {
  const bmr = calculateBMR(userData);
  const tdee = calculateTDEE(bmr, userData.activityLevel);
  const calorieTarget = calculateDailyCalorieTarget(tdee);
  
  let bmiCategory = "normal weight";
  const bmi = calculateBMI(userData.height || 0, userData.weight || 0);
  
  if (bmi < 18.5) bmiCategory = "underweight";
  else if (bmi >= 25) bmiCategory = "overweight";
  else if (bmi >= 30) bmiCategory = "obese";
  
  return `
性别：${userData.gender === "male" ? "男" : "女"}
年龄：${userData.age}岁
身高：${userData.height}cm
体重：${userData.weight}kg
目标体重：${userData.targetWeight}kg
BMI：${bmi}（${bmiCategory}）
基础代谢率：${bmr}卡路里
活动水平：${activityLevelToText(userData.activityLevel)}
每日目标热量：${calorieTarget}卡路里

饮食偏好：
忌口：${userData.dietaryPreferences.restrictions.join("、") || "无"}
口味偏好：${cuisineTypeToText(userData.dietaryPreferences.cuisineType)}
烹饪时间要求：${cookingTimeToText(userData.dietaryPreferences.cookingTime)}

请根据以上信息，帮我设计一份今日减脂餐食谱，包括早餐、午餐、晚餐及加餐（如需要）。
`;
};

export const activityLevelToText = (level: string): string => {
  const map: Record<string, string> = {
    sedentary: "久坐（几乎不运动）",
    light: "轻度活动（每周运动1-3次）",
    moderate: "中度活动（每周运动3-5次）",
    active: "重度活动（每周运动6-7次）",
    veryActive: "非常活跃（每天高强度训练或体力劳动）",
  };
  return map[level] || level;
};

export const cuisineTypeToText = (type: string): string => {
  const map: Record<string, string> = {
    chinese: "中式",
    western: "西式",
    japanese: "日式",
    mixed: "混合",
  };
  return map[type] || type;
};

export const cookingTimeToText = (time: string): string => {
  const map: Record<string, string> = {
    short: "快速（15分钟内）",
    medium: "适中（15-30分钟）",
    long: "不限时间",
  };
  return map[time] || time;
};

export const extractShoppingList = (mealPlanText: string): string[] => {
  // Look for shopping list section
  const shoppingListPattern = /## 购物清单([\s\S]*?)(?:##|$)/i;
  const match = mealPlanText.match(shoppingListPattern);
  
  if (!match || !match[1]) {
    return [];
  }
  
  // Split by lines, clean up, and filter out empty lines
  return match[1]
    .split('\n')
    .map(item => item.trim())
    .filter(item => item && item.startsWith('-'))
    .map(item => item.substring(1).trim());
};
