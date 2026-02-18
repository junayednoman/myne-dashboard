export type UserTableItem = {
  id: string;
  userName: string;
  email: string;
  registrationDate: string;
  status: "active" | "blocked";
  avatar: string;
  isBlocked?: boolean;
  businessName?: string;
  contact?: string;
  location?: string;
};
