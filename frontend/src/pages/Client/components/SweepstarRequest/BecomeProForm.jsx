import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  User,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const applicationSchema = z.object({
  id_number: z
    .string()
    .min(6, "ID/Passport number must be at least 6 characters."),
  hourly_rate: z.coerce
    .number()
    .min(10, "Minimum hourly rate is $10.00.")
    .max(500, "Hourly rate cannot exceed $500.00."),
  bio: z
    .string()
    .min(20, "Please provide a bio of at least 20 characters.")
    .max(200, "Bio cannot exceed 200 characters."),
});

export default function BecomeProForm({
  onSubmit,
  isSubmitting,
  submitError,
  submitSuccess,
}) {
  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      id_number: "",
      hourly_rate: 25.0,
      bio: "",
    },
    mode: "onChange",
  });

  const bioLength = form.watch("bio")?.length || 0;

  return (
    <Card className="rounded-2xl border border-border bg-card/95 dark:bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
      <CardHeader className="border-b border-border bg-gradient-to-r from-background to-muted/30 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            Application Details
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Help us get to know you better
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-8">
        {submitError && (
          <Alert className="mb-6 border-destructive/40 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-destructive">Submission Failed</AlertTitle>
            <AlertDescription className="text-destructive">
              {submitError}
            </AlertDescription>
          </Alert>
        )}

        {submitSuccess && (
          <Alert className="mb-6 border-emerald-300/60 bg-emerald-50/60 dark:bg-emerald-900/20 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <AlertTitle className="text-emerald-900 dark:text-emerald-200">
              Application Submitted!
            </AlertTitle>
            <AlertDescription className="text-emerald-800 dark:text-emerald-300">
              {submitSuccess}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ID Number */}
            <FormField
              control={form.control}
              name="id_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-foreground">
                    ID / Passport Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                      <Input
                        placeholder="e.g. 900101 5000 089"
                        className="pl-10 h-11 bg-muted/40 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Hourly Rate */}
            <FormField
              control={form.control}
              name="hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel className="text-base font-semibold text-foreground">
                      Desired Hourly Rate
                    </FormLabel>
                    {field.value && (
                      <Badge
                        variant="outline"
                        className="text-sm font-semibold text-primary bg-primary/5 border-primary/20"
                      >
                        ${Number(field.value).toFixed(2)}/hr
                      </Badge>
                    )}
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                      <Input
                        type="number"
                        step="0.50"
                        className="pl-10 h-11 bg-muted/40 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    We deduct a small service fee. You'll keep the majority of your
                    earnings.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel className="text-base font-semibold text-foreground">
                      Tell Us About Yourself
                    </FormLabel>
                    <span className="text-xs font-medium text-muted-foreground">
                      {bioLength}/200
                    </span>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                      <Textarea
                        placeholder="Share your experience, specialties, reliability, and what makes you exceptional..."
                        className="pl-10 min-h-[140px] resize-none bg-muted/40 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                        maxLength={200}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    This helps customers understand your expertise
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Rate Preview */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Your Hourly Rate
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Commission deducted automatically
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">
                    ${Number(form.watch("hourly_rate")).toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">/hr</span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-lg font-semibold text-base bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Application...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Applications typically reviewed within 24 hours
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
