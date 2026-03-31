export type UserBagItem = {
  id: string;
  bagName: string;
  bagImage: string;
  ownerName: string;
  ownerImage: string;
  brand: string;
  brandLogo?: string;
  model: string;
  purchaseYear: number;
  cost: number;
  currentValue: number;
  changePercentage?: number;
};
