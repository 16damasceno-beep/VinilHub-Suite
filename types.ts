
export interface Lead {
  id: string;
  name: string;
  platform: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Website';
  contact: string;
  location: string;
  description: string;
  status?: 'pendente' | 'enviado' | 'falha';
}

export interface MarketingPlan {
  tone: string;
  usp: string[];
  strategy: string;
  targetAudience: string;
}

export interface MarketingContent {
  whatsapp: string;
  instagram: string;
  facebook: string;
  title: string;
  plan?: MarketingPlan;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  GENERATOR = 'generator',
  LEAD_FINDER = 'lead_finder',
  CONTACTS = 'contacts'
}
