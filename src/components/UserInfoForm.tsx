
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUser } from "@/context/UserContext";
import { calculateBMI } from "@/utils/calculations";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  gender: z.enum(["male", "female"], {
    required_error: "请选择性别",
  }),
  age: z.coerce
    .number({
      required_error: "请输入年龄",
      invalid_type_error: "年龄必须是数字",
    })
    .min(12, "年龄必须至少为12岁")
    .max(100, "年龄不能超过100岁"),
  height: z.coerce
    .number({
      required_error: "请输入身高",
      invalid_type_error: "身高必须是数字",
    })
    .min(100, "身高必须至少为100厘米")
    .max(220, "身高不能超过220厘米"),
  weight: z.coerce
    .number({
      required_error: "请输入体重",
      invalid_type_error: "体重必须是数字",
    })
    .min(30, "体重必须至少为30公斤")
    .max(200, "体重不能超过200公斤"),
  targetWeight: z.coerce
    .number({
      required_error: "请输入目标体重",
      invalid_type_error: "目标体重必须是数字",
    })
    .min(30, "目标体重必须至少为30公斤")
    .max(200, "目标体重不能超过200公斤"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "veryActive"], {
    required_error: "请选择活动水平",
  }),
});

export function UserInfoForm() {
  const { userData, setUserData, setCurrentStep } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: userData.gender,
      age: userData.age || undefined,
      height: userData.height || undefined,
      weight: userData.weight || undefined,
      targetWeight: userData.targetWeight || undefined,
      activityLevel: userData.activityLevel,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const bmi = calculateBMI(values.height, values.weight);
    setUserData({
      ...userData,
      ...values,
      bmi,
    });
    setCurrentStep(1);
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-nutrition-primary mb-6 text-center">
        基本信息
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>性别</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        男性
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        女性
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>年龄 (岁)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="18"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>身高 (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="170"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>当前体重 (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="65"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目标体重 (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="60"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>活动水平</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择您的活动水平" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sedentary">久坐（几乎不运动）</SelectItem>
                    <SelectItem value="light">轻度活动（每周运动1-3次）</SelectItem>
                    <SelectItem value="moderate">中度活动（每周运动3-5次）</SelectItem>
                    <SelectItem value="active">重度活动（每周运动6-7次）</SelectItem>
                    <SelectItem value="veryActive">非常活跃（每天高强度训练）</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit"
            className="w-full bg-nutrition-primary hover:bg-nutrition-secondary"
          >
            下一步
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default UserInfoForm;
