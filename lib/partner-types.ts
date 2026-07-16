export type PartnerApplicationStatus =
  | 'checkout_pending'
  | 'paid_pending_review'
  | 'approved'
  | 'decline_processing'
  | 'declined_refunded'
  | 'refund_failed'
  | 'cancelled'
  | 'billing_setup_failed';

export type PartnerApplicationInput = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  category: string;
  serviceAreas: string;
  preferredTerritory?: string;
  yearsInBusiness?: string;
  googleProfile?: string;
  notes?: string;
  confirmed: boolean;
};

export type PartnerApplication = {
  id: string;
  created_at: string;
  updated_at: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string | null;
  category: string;
  service_areas: string;
  preferred_territory: string | null;
  years_in_business: string | null;
  google_profile: string | null;
  notes: string | null;
  confirmed: boolean;
  status: PartnerApplicationStatus;
  billing_status: string;
  stripe_checkout_session_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_schedule_id: string | null;
  stripe_last_invoice_id: string | null;
  stripe_refund_ids: string[];
  amount_paid_cents: number;
  currency: string;
  approved_at: string | null;
  declined_at: string | null;
  refunded_at: string | null;
  telegram_notified_at: string | null;
  failure_reason: string | null;
};

export type PartnerReviewAction = 'approve' | 'decline';

export type PartnerReviewToken = {
  id: string;
  application_id: string;
  token_hash: string;
  action: PartnerReviewAction;
  expires_at: string;
  consumed_at: string | null;
  created_at: string;
};
