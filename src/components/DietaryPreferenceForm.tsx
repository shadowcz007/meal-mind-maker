
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  restrictions: z.array(z.string()).optional(),
  cuisineType: z.string({
    required_error: "请选择口味偏好",
  }),
  cookingTime: z.string({
    required_error: "请选择烹饪时间",
  }),
});

const dietaryRestrictions = [
  { id: "vegetarian", label: "素食" },
  { id: "vegan", label: "纯素食" },
  { id: "glutenFree", label: "无麸质" },
  { id: "dairyFree", label: "无乳糖" },
  { id: "nutFree", label: "无坚果" },
  { id: "lowCarb", label: "低碳水" },
  { id: "lowFat", label: "低脂" },
];

export function DietaryPreferenceForm() {
  const { userData, setUserData, setCurrentStep } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restrictions: userData.dietaryPreferences.restrictions,
      cuisineType: userData.dietaryPreferences.cuisineType,
      cookingTime: userData.dietaryPreferences.cookingTime,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setUserData({
      ...userData,
      dietaryPreferences: {
        restrictions: values.restrictions || [],
        cuisineType: values.cuisineType,
        cookingTime: values.cookingTime,
      },
    });
    setCurrentStep(2);
  }

  const goBack = () => {
    setCurrentStep(0);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-nutrition-primary mb-6 text-center">
        饮食偏好
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="restrictions"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>饮食限制（忌口）</FormLabel>
                  <FormDescription>
                    选择您需要避免的食物类型
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryRestrictions.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="restrictions"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        item.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cuisineType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>口味偏好</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择您喜欢的烹饪风格" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="chinese">中式</SelectItem>
                    <SelectItem value="western">西式</SelectItem>
                    <SelectItem value="japanese">日式</SelectItem>
                    <SelectItem value="mixed">混合</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cookingTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>烹饪时间</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择您可接受的烹饪时间" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="short">快速（15分钟内）</SelectItem>
                    <SelectItem value="medium">适中（15-30分钟）</SelectItem>
                    <SelectItem value="long">不限时间</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
            >
              返回
            </Button>
            <Button 
              type="submit"
              className="bg-nutrition-primary hover:bg-nutrition-secondary"
            >
              下一步
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default DietaryPreferenceForm;
