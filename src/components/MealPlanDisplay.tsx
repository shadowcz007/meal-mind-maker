
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Share } from "lucide-react";

const MealPlanDisplay = () => {
  const { mealPlan, setCurrentStep, shoppingList } = useUser();
  const [copied, setCopied] = useState(false);

  const goBack = () => {
    setCurrentStep(2);
  };

  const copyToClipboard = () => {
    if (!shoppingList) return;

    const formattedList = `购物清单:\n${shoppingList.map(item => `- ${item}`).join('\n')}`;
    
    navigator.clipboard.writeText(formattedList).then(
      () => {
        setCopied(true);
        toast.success("购物清单已复制到剪贴板");
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("复制失败:", err);
        toast.error("复制失败，请手动复制");
      }
    );
  };

  if (!mealPlan) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-nutrition-primary mb-6 text-center">
          尚未生成食谱
        </h2>
        <p className="text-center mb-4">请返回并生成食谱。</p>
        <div className="flex justify-center">
          <Button
            className="bg-nutrition-primary hover:bg-nutrition-secondary"
            onClick={() => setCurrentStep(2)}
          >
            返回生成食谱
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-nutrition-primary mb-6 text-center">
        您的每日减脂食谱
      </h2>

      <div className="mb-8 prose max-w-none">
        <ReactMarkdown>{mealPlan}</ReactMarkdown>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-xl font-semibold mb-4 text-nutrition-primary">购物清单</h3>
        
        {shoppingList && shoppingList.length > 0 ? (
          <div className="mb-6">
            <ul className="list-disc pl-6 mb-4">
              {shoppingList.map((item, index) => (
                <li key={index} className="mb-1">{item}</li>
              ))}
            </ul>
            
            <Button 
              onClick={copyToClipboard} 
              className="flex items-center gap-2 bg-nutrition-primary hover:bg-nutrition-secondary"
            >
              <Share size={16} />
              {copied ? "已复制!" : "复制购物清单"}
            </Button>
          </div>
        ) : (
          <p>无法提取购物清单，请从食谱中手动提取所需食材。</p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
        >
          返回
        </Button>
        <Button
          className="bg-nutrition-primary hover:bg-nutrition-secondary"
          onClick={() => setCurrentStep(2)}
        >
          重新生成食谱
        </Button>
      </div>
    </div>
  );
};

export default MealPlanDisplay;
