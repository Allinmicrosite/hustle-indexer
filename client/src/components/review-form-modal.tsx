import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertReviewSchema, type InsertReview } from '@shared/schema';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Plus, X } from 'lucide-react';

interface ReviewFormModalProps {
  hustleId: string;
  hustleName: string;
  isOpen: boolean;
  onClose: () => void;
}

const reviewFormSchema = insertReviewSchema.extend({
  prosInput: z.string().optional(),
  consInput: z.string().optional(),
  overallScore: z.number().min(1).max(10),
  earningPotentialScore: z.number().min(1).max(10).optional(),
  timeInvestmentScore: z.number().min(1).max(10).optional(),
  difficultyScore: z.number().min(1).max(10).optional(),
  legitimacyScore: z.number().min(1).max(10).optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export function ReviewFormModal({ hustleId, hustleName, isOpen, onClose }: ReviewFormModalProps) {
  const [prosItems, setProsItems] = useState<string[]>([]);
  const [consItems, setConsItems] = useState<string[]>([]);
  const [prosInput, setProsInput] = useState("");
  const [consInput, setConsInput] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      hustleId,
      username: '',
      email: '',
      overallScore: 5.0,
      earningPotentialScore: 5.0,
      timeInvestmentScore: 5.0,
      difficultyScore: 5.0,
      legitimacyScore: 5.0,
      title: '',
      content: '',
      monthlyEarnings: undefined,
      timeSpentHours: undefined,
      experienceMonths: undefined,
      isAnonymous: 0,
      isVerified: 0,
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: InsertReview) => {
      const response = await apiRequest('POST', '/api/reviews', data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hustles', hustleId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hustles', hustleId] });
      queryClient.invalidateQueries({ queryKey: ['/api/hustles/top-rated'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      
      toast({ title: 'Review submitted successfully!', description: 'Thank you for sharing your experience.' });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to submit review',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    form.reset();
    setProsItems([]);
    setConsItems([]);
    setProsInput("");
    setConsInput("");
  };

  const addPro = () => {
    if (prosInput.trim() && !prosItems.includes(prosInput.trim())) {
      setProsItems([...prosItems, prosInput.trim()]);
      setProsInput("");
    }
  };

  const addCon = () => {
    if (consInput.trim() && !consItems.includes(consInput.trim())) {
      setConsItems([...consItems, consInput.trim()]);
      setConsInput("");
    }
  };

  const removePro = (index: number) => {
    setProsItems(prosItems.filter((_, i) => i !== index));
  };

  const removeCon = (index: number) => {
    setConsItems(consItems.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ReviewFormData) => {
    const reviewData: InsertReview = {
      ...data,
      pros: prosItems.length > 0 ? prosItems : undefined,
      cons: consItems.length > 0 ? consItems : undefined,
      overallScore: data.overallScore.toString(),
      earningPotentialScore: data.earningPotentialScore?.toString(),
      timeInvestmentScore: data.timeInvestmentScore?.toString(),
      difficultyScore: data.difficultyScore?.toString(),
      legitimacyScore: data.legitimacyScore?.toString(),
    };

    createReviewMutation.mutate(reviewData);
  };

  const renderStarRating = (value: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= value / 2 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{value.toFixed(1)}/10</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review for {hustleName}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          {...field} 
                          data-testid="input-username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          {...field} 
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value === 1}
                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                        data-testid="checkbox-anonymous"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Submit anonymously</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Your name won't be displayed with this review
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Review Content */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Summarize your experience..." 
                        {...field} 
                        data-testid="input-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Review *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your detailed experience with this hustle..."
                        className="min-h-24"
                        {...field} 
                        data-testid="textarea-content"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Overall Rating */}
            <FormField
              control={form.control}
              name="overallScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating *</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Slider
                        value={[field.value || 5]}
                        onValueChange={(value) => field.onChange(value[0])}
                        max={10}
                        min={1}
                        step={0.5}
                        className="w-full"
                        data-testid="slider-overall-score"
                      />
                      {renderStarRating(field.value || 5)}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Detailed Scores */}
            <div className="space-y-4">
              <h4 className="font-medium">Detailed Ratings (Optional)</h4>
              
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="earningPotentialScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Earning Potential</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            value={[field.value || 5]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={10}
                            min={1}
                            step={0.5}
                            data-testid="slider-earning-potential"
                          />
                          <div className="text-sm text-muted-foreground">
                            {(field.value || 5).toFixed(1)}/10
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeInvestmentScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Investment</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            value={[field.value || 5]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={10}
                            min={1}
                            step={0.5}
                            data-testid="slider-time-investment"
                          />
                          <div className="text-sm text-muted-foreground">
                            {(field.value || 5).toFixed(1)}/10
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficultyScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            value={[field.value || 5]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={10}
                            min={1}
                            step={0.5}
                            data-testid="slider-difficulty"
                          />
                          <div className="text-sm text-muted-foreground">
                            {(field.value || 5).toFixed(1)}/10
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legitimacyScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legitimacy</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            value={[field.value || 5]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={10}
                            min={1}
                            step={0.5}
                            data-testid="slider-legitimacy"
                          />
                          <div className="text-sm text-muted-foreground">
                            {(field.value || 5).toFixed(1)}/10
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Pros and Cons */}
            <div className="space-y-4">
              <h4 className="font-medium">Pros & Cons (Optional)</h4>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <FormLabel>Pros</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a positive point..."
                      value={prosInput}
                      onChange={(e) => setProsInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                      data-testid="input-pros"
                    />
                    <Button 
                      type="button" 
                      onClick={addPro} 
                      size="sm"
                      data-testid="button-add-pro"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prosItems.map((pro, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {pro}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removePro(index)}
                          data-testid={`button-remove-pro-${index}`}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <FormLabel>Cons</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a negative point..."
                      value={consInput}
                      onChange={(e) => setConsInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                      data-testid="input-cons"
                    />
                    <Button 
                      type="button" 
                      onClick={addCon} 
                      size="sm"
                      data-testid="button-add-con"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {consItems.map((con, index) => (
                      <Badge key={index} variant="destructive" className="gap-1">
                        {con}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeCon(index)}
                          data-testid={`button-remove-con-${index}`}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Financial Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Your Experience (Optional)</h4>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="monthlyEarnings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Earnings ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2500" 
                          {...field} 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          data-testid="input-monthly-earnings"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeSpentHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours per Week</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="20" 
                          {...field} 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          data-testid="input-time-spent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experienceMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (Months)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="6" 
                          {...field} 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          data-testid="input-experience-months"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createReviewMutation.isPending}
                data-testid="button-submit-review"
              >
                {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}