export type PartnerRole = "admin" | "partner";

export interface Partner {
  id: number;
  name: string;
  role: PartnerRole;
  share_percent: string;
  is_active: boolean;
  username: string | null;
}

export interface AuthPartner {
  id: number;
  name: string;
  username: string;
  role: PartnerRole;
}

export interface CreatePartnerInput {
  name: string;
  role?: PartnerRole;
  share_percent?: number;
}

export interface UpdatePartnerInput {
  name?: string;
  role?: PartnerRole;
  is_active?: boolean;
  share_percent?: number;
}
