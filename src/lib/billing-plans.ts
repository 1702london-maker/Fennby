export type BillingPlan = {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
};

export const billingPlans: BillingPlan[] = [
  {
    name: "Single Child",
    price: "£29/month",
    features: ["1 child", "Digital, print-and-shade, and simulation mocks", "Full parent visibility"],
  },
  {
    name: "Family Plan",
    price: "£49/month",
    features: ["Up to 3 children", "Everything in Single Child", "Priority tutor matching"],
    highlighted: true,
  },
  {
    name: "Family Plus",
    price: "£69/month",
    features: ["Up to 5 children", "Everything in Family Plan", "Vocational track included"],
  },
];
