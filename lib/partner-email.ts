import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import type { PartnerApplication } from '@/lib/partner-types';

let resend: Resend | null = null;

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PARTNER_FROM_EMAIL;
  if (!apiKey || !from) throw new Error('RESEND_API_KEY and PARTNER_FROM_EMAIL are required');
  if (!resend) resend = new Resend(apiKey);
  return { client: resend, from };
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function sendApprovedPartnerCheckout(application: PartnerApplication, checkoutUrl: string) {
  const { client, from } = getEmailConfig();
  const name = escapeHtml(application.contact_name);
  const business = escapeHtml(application.business_name);
  const territory = escapeHtml(application.preferred_territory || application.service_areas);

  const deliveryKey = createHash('sha256').update(checkoutUrl).digest('hex').slice(0, 20);
  const { error } = await client.emails.send({
    from,
    to: application.email,
    subject: `${business} is approved — complete your FindALocalPro checkout`,
    text: [
      `Hi ${application.contact_name},`,
      '',
      `Your ${application.category} application for ${application.preferred_territory || application.service_areas} has been approved.`,
      'No payment was taken with your application.',
      '',
      'Complete secure checkout to activate your founding partner spot:',
      checkoutUrl,
      '',
      'The plan is $500 per month for the first three billing cycles, then $750 per month.',
      '',
      'FindALocalPro',
    ].join('\n'),
    html: `
      <div style="background:#eef3f8;padding:32px 16px;font-family:Arial,sans-serif;color:#0a1f3d">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:18px;padding:32px;border:1px solid #d8e2ec">
          <p style="margin:0 0 8px;color:#3c962d;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Territory approved</p>
          <h1 style="margin:0 0 20px;font-size:28px">Your founding partner spot is ready.</h1>
          <p>Hi ${name},</p>
          <p><strong>${business}</strong> has been approved for <strong>${territory}</strong>. No payment was taken with your application.</p>
          <p style="margin:28px 0"><a href="${checkoutUrl}" style="display:inline-block;background:#82cf36;color:#061a36;text-decoration:none;font-weight:800;padding:15px 22px;border-radius:10px">Complete secure checkout — $500</a></p>
          <p>The first three monthly billing cycles are $500. Beginning with the fourth cycle, the plan is $750 per month.</p>
          <p style="color:#607086;font-size:13px">This private checkout link expires in 14 days. If you did not request this application, reply to this email.</p>
        </div>
      </div>
    `,
  }, { idempotencyKey: `partner-approval-${application.id}-${deliveryKey}` });

  if (error) throw new Error(`Approval email failed: ${error.message}`);
}
