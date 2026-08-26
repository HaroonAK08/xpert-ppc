import nodemailer from 'nodemailer';

import { env } from '../config/env';
import type { CreateLeadInput } from '../validation/lead';

type LeadMailPayload = Omit<CreateLeadInput, 'companyWebsite'> & {
  id?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: string | undefined): string {
  const v = (value ?? '').trim();
  if (!v) return '';
  return `<tr>
    <td style="padding:8px 12px;color:#64748b;font-weight:600;vertical-align:top;white-space:nowrap">${label}</td>
    <td style="padding:8px 12px;color:#0f172a">${escapeHtml(v)}</td>
  </tr>`;
}

export function isMailConfigured(): boolean {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);
}

function createTransport() {
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

export async function sendLeadNotification(lead: LeadMailPayload): Promise<void> {
  if (!isMailConfigured()) {
    console.warn(
      '[mail] SMTP is not configured — lead saved but email not sent. Set SMTP_HOST, SMTP_USER, SMTP_PASS in backend/.env'
    );
    return;
  }

  const transporter = createTransport();

  const subject = `New lead: ${lead.name} (${lead.platform || 'Other'})`;
  const text = [
    'New website lead',
    '',
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || '—'}`,
    `Company: ${lead.company || '—'}`,
    `Website: ${lead.website || '—'}`,
    `Platform: ${lead.platform || '—'}`,
    `Budget: ${lead.monthlyBudget || '—'}`,
    `Source: ${lead.source || '—'}`,
    `Page: ${lead.sourcePath || '—'}`,
    '',
    'Message:',
    lead.message || '—',
  ].join('\n');

  const html = `
    <div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:640px;margin:0 auto">
      <h2 style="margin:0 0 16px;color:#0f172a">New website lead</h2>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden">
        ${row('Name', lead.name)}
        ${row('Email', lead.email)}
        ${row('Phone', lead.phone)}
        ${row('Company', lead.company)}
        ${row('Website', lead.website)}
        ${row('Platform', lead.platform)}
        ${row('Budget', lead.monthlyBudget)}
        ${row('Source', lead.source)}
        ${row('Page', lead.sourcePath)}
        ${row('Message', lead.message)}
      </table>
      ${lead.id ? `<p style="margin:16px 0 0;color:#94a3b8;font-size:12px">Lead ID: ${escapeHtml(lead.id)}</p>` : ''}
    </div>
  `;

  await transporter.sendMail({
    from: env.smtp.from,
    to: env.leadNotifyTo,
    replyTo: lead.email,
    subject,
    text,
    html,
  });
}

export async function sendOtpEmail(opts: {
  to: string;
  name: string;
  code: string;
  purpose: 'signup' | 'login';
}): Promise<{ sent: boolean }> {
  const action = opts.purpose === 'signup' ? 'verify your account' : 'sign in';
  const subject = `Your Xpert PPC verification code: ${opts.code}`;
  const text = [
    `Hi ${opts.name},`,
    '',
    `Your verification code to ${action} is: ${opts.code}`,
    '',
    'This code expires in 10 minutes. If you did not request it, you can ignore this email.',
    '',
    '— Xpert PPC Digital Academy',
  ].join('\n');

  const html = `
    <div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 8px;color:#0f172a">Verification code</h2>
      <p style="margin:0 0 20px;color:#475569">Hi ${escapeHtml(opts.name)}, use this code to ${action}:</p>
      <div style="letter-spacing:8px;font-size:32px;font-weight:800;color:#0066cc;background:#f1f5f9;border-radius:12px;padding:16px 20px;text-align:center">
        ${escapeHtml(opts.code)}
      </div>
      <p style="margin:20px 0 0;color:#94a3b8;font-size:13px">Expires in 10 minutes. If you did not request this, ignore this email.</p>
    </div>
  `;

  if (!isMailConfigured()) {
    console.warn(
      `[mail] SMTP not configured — OTP for ${opts.to}: ${opts.code} (dev fallback)`
    );
    return { sent: false };
  }

  const transporter = createTransport();
  await transporter.sendMail({
    from: env.smtp.otpFrom,
    to: opts.to,
    subject,
    text,
    html,
  });
  return { sent: true };
}

function btn(href: string, label: string, color: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:10px;margin-right:8px">${escapeHtml(label)}</a>`;
}

export async function sendCourseApplicationEmail(opts: {
  name: string;
  email: string;
  country: string;
  interest: string;
  acceptUrl: string;
  rejectUrl: string;
}): Promise<void> {
  if (!isMailConfigured()) {
    console.warn(
      `[mail] SMTP not configured — course application from ${opts.email} saved but not emailed.`
    );
    return;
  }

  const subject = `Course application: ${opts.name}`;
  const text = [
    'New course application',
    '',
    `Name: ${opts.name}`,
    `Email: ${opts.email}`,
    `Country: ${opts.country}`,
    '',
    'What they want to learn:',
    opts.interest,
    '',
    `Accept: ${opts.acceptUrl}`,
    `Reject: ${opts.rejectUrl}`,
  ].join('\n');

  const html = `
    <div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:640px;margin:0 auto">
      <h2 style="margin:0 0 16px;color:#0f172a">New course application</h2>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden">
        ${row('Name', opts.name)}
        ${row('Email', opts.email)}
        ${row('Country', opts.country)}
        ${row('Wants to learn', opts.interest)}
      </table>
      <p style="margin:24px 0 8px;color:#475569">Accept this person so they can sign in with the password they chose.</p>
      <p>${btn(opts.acceptUrl, 'Accept', '#16a34a')}${btn(opts.rejectUrl, 'Reject', '#dc2626')}</p>
    </div>
  `;

  const transporter = createTransport();
  await transporter.sendMail({
    from: env.smtp.from,
    to: env.leadNotifyTo,
    replyTo: opts.email,
    subject,
    text,
    html,
  });
}

export async function sendApplicationDecisionEmail(opts: {
  to: string;
  name: string;
  decision: 'approved' | 'rejected';
  loginUrl: string;
}): Promise<void> {
  if (!isMailConfigured()) return;

  const accepted = opts.decision === 'approved';
  const subject = accepted
    ? 'You’re in — sign in to Xpert PPC Courses'
    : 'Update on your Xpert PPC Courses application';
  const text = accepted
    ? `Hi ${opts.name},\n\nYour application was accepted. Sign in with the password you chose:\n${opts.loginUrl}\n\n— Xpert PPC`
    : `Hi ${opts.name},\n\nThanks for applying to Xpert PPC Courses. We can’t offer a place right now.\n\n— Xpert PPC`;

  const html = accepted
    ? `<div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px;color:#0f172a">You’re approved</h2>
        <p style="color:#475569">Hi ${escapeHtml(opts.name)}, you can now sign in with the password you set on the application form.</p>
        <p>${btn(opts.loginUrl, 'Sign in', '#0066cc')}</p>
      </div>`
    : `<div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px;color:#0f172a">Application update</h2>
        <p style="color:#475569">Hi ${escapeHtml(opts.name)}, thanks for applying. We can’t offer a place on Xpert PPC Courses right now.</p>
      </div>`;

  const transporter = createTransport();
  await transporter.sendMail({
    from: env.smtp.from,
    to: opts.to,
    subject,
    text,
    html,
  });
}
