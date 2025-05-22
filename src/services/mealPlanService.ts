
import { AppSettings } from "../context/UserContext";

export const generateMealPlan = async (
  userPrompt: string, 
  settings: AppSettings
): Promise<string> => {
  try {
    const systemPrompt = `你是一名专业的减脂营养师，根据用户提供的身体数据（BMI、目标体重）和饮食偏好（忌口、口味、烹饪时间），生成**简单、可执行、热量可控**的每日食谱，并附带清晰的食材清单。规则: 
1. **科学优先**  
   - 每日总热量 = 用户基础代谢 × 活动系数 - 300~500kcal（安全减脂缺口）  
   - 营养素分配：蛋白质30% / 脂肪25% / 碳水45%  
   - 食材选择：高饱腹感（燕麦、鸡胸肉）、低GI（糙米、西兰花）  

2. **严格遵循用户偏好**  
   - 若用户选择"素食"，禁用所有肉类，用豆类/藜麦替代蛋白质  
   - 若用户选择"中式"，避免生冷沙拉，推荐蒸煮炒等烹饪方式  

3. **输出格式标准化**  
   \`\`\`markdown
   ## 早餐  
   - [菜名]：[食材+分量]（如：燕麦粥：燕麦50g+牛奶200ml）  
   - **热量**：XXX kcal  

   ## 午餐（示例）  
   - 糙米饭：糙米80g  
   - 清蒸鱼：鲈鱼100g + 姜片  
   - **总热量**：XXX kcal  

   ## 购物清单  
   - 燕麦 50g  
   - 鲈鱼 100g  
   \`\`\`  

4. **禁止行为**  
   - ❌ 推荐用户忌口的食材（如用户选择"无乳糖"时禁用牛奶）  
   - ❌ 复杂烹饪步骤（单菜烹饪时间≤20分钟）  
   - ❌ 模糊分量（必须标注克数/毫升数）`;

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "model": settings.model,
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": userPrompt
          }
        ],
        "stream": false,
        "max_tokens": 1024,
        "enable_thinking": false
      })
    };

    const response = await fetch(settings.apiUrl, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate meal plan');
    }

    // Extract the content from the API response
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in API response');
    }

    return content;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};
