import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "WanderQuest <onboarding@resend.dev>"; // Replace with custom domain later

interface BookingEmailData {
  referenceNo: string;
  customerName: string;
  customerEmail: string;
  packageTitle: string;
  travelDate: string;
  travelers: number;
}

interface CabBookingEmailData {
  referenceNo: string;
  customerName: string;
  customerEmail: string;
  cabType: string;
  pickup: string;
  drop: string;
  date: string;
  time: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Booking Confirmed — ${data.referenceNo} | WanderQuest`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e67e22;">WanderQuest Travels</h1>
        <h2>Booking Received!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Thank you for booking with WanderQuest! Here are your booking details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Reference No.</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.referenceNo}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Package</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.packageTitle}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Travel Date</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.travelDate}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Travelers</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.travelers}</td></tr>
        </table>
        <p>We'll confirm your booking within 24 hours. If you have any questions, reply to this email or call us at +91-98765-43210.</p>
        <p>Happy travels!<br/>Team WanderQuest</p>
      </div>
    `,
  });
}

export async function sendBookingAlertToAdmin(data: BookingEmailData) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New Booking: ${data.referenceNo} — ${data.packageTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Booking Received</h2>
        <p><strong>Reference:</strong> ${data.referenceNo}</p>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Package:</strong> ${data.packageTitle}</p>
        <p><strong>Date:</strong> ${data.travelDate}</p>
        <p><strong>Travelers:</strong> ${data.travelers}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings">View in Dashboard →</a></p>
      </div>
    `,
  });
}

export async function sendCabBookingConfirmation(data: CabBookingEmailData) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Cab Booking Confirmed — ${data.referenceNo} | WanderQuest`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e67e22;">WanderQuest Travels</h1>
        <h2>Cab Booking Received!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Your cab booking details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Reference No.</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.referenceNo}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Cab Type</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.cabType}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Pickup</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.pickup}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Drop</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.drop}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Date & Time</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.date} at ${data.time}</td></tr>
        </table>
        <p>We'll confirm your cab booking shortly. Contact us at +91-98765-43210 for any questions.</p>
        <p>Happy travels!<br/>Team WanderQuest</p>
      </div>
    `,
  });
}

export async function sendCabBookingAlertToAdmin(data: CabBookingEmailData) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New Cab Booking: ${data.referenceNo}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Cab Booking</h2>
        <p><strong>Reference:</strong> ${data.referenceNo}</p>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Cab:</strong> ${data.cabType}</p>
        <p><strong>Route:</strong> ${data.pickup} → ${data.drop}</p>
        <p><strong>Date:</strong> ${data.date} at ${data.time}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/cab-bookings">View in Dashboard →</a></p>
      </div>
    `,
  });
}

export async function sendStatusUpdate(
  customerEmail: string,
  customerName: string,
  referenceNo: string,
  newStatus: string,
  bookingType: "package" | "cab"
) {
  const statusMessages: Record<string, string> = {
    CONFIRMED: "Great news! Your booking has been confirmed.",
    COMPLETED: "Your trip has been marked as completed. We hope you had a wonderful experience!",
    CANCELLED: "Your booking has been cancelled. If this was a mistake, please contact us.",
  };

  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Booking ${newStatus} — ${referenceNo} | WanderQuest`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e67e22;">WanderQuest Travels</h1>
        <h2>Booking Status Update</h2>
        <p>Hi ${customerName},</p>
        <p>${statusMessages[newStatus] || `Your ${bookingType} booking status has been updated to: ${newStatus}`}</p>
        <p><strong>Reference:</strong> ${referenceNo}</p>
        <p>Questions? Contact us at +91-98765-43210 or reply to this email.</p>
        <p>Team WanderQuest</p>
      </div>
    `,
  });
}

export async function sendInquiryAlert(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New Inquiry from ${data.name} | WanderQuest`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p style="background: #f9f9f9; padding: 15px; border-radius: 8px;">${data.message}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/inquiries">View in Dashboard →</a></p>
      </div>
    `,
  });
}
