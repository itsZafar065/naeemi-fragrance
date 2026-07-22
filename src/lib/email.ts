import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT) || 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || `"Naeemi Fragrance" <naeemifragrance@gmail.com>`;
const businessEmail = process.env.BUSINESS_EMAIL || "naeemifragrance@gmail.com";

// Verify SMTP connection settings are present
const isSmtpConfigured = !!(host && user && pass);

const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // True for 465, false for 587
      auth: {
        user,
        pass,
      },
    })
  : null;

// Helper to execute sending of emails with HTML content and fallback logging
async function sendMailHelper(to: string, subject: string, htmlContent: string) {
  if (!isSmtpConfigured || !transporter) {
    console.warn(`
====== SMTP NOT CONFIGURED (MOCK EMAIL LOG) ======
To: ${to}
Subject: ${subject}
Body: (Check console/logs for content)
==================================================
`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email delivered successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Nodemailer dispatch failed:", error);
    throw error;
  }
}

// Brand CSS Styling Helper (Luxurious Gold & Cream Palette)
const emailBaseTemplate = (title: string, bodyContent: string) => `
<div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; background-color: #faf7f2; padding: 40px 20px; color: #1c1917;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8dec9; border-radius: 28px; overflow: hidden; box-shadow: 0 12px 40px rgba(160, 140, 115, 0.06);">
    <!-- Brand Header -->
    <div style="background-color: #1c1917; padding: 30px; text-align: center; border-bottom: 2px solid #d4af37;">
      <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #faf7f2; display: inline-block; padding: 4px; border: 1px solid rgba(212,175,55,0.3); margin-bottom: 12px; overflow: hidden;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.svg" style="width: 100%; height: 100%; object-fit: cover;" alt="Logo" />
      </div>
      <h1 style="font-family: serif; color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.15em; font-weight: bold; text-transform: uppercase;">NAEEMI FRAGRANCE</h1>
      <p style="color: #d4af37; font-size: 8px; font-weight: bold; letter-spacing: 0.25em; text-transform: uppercase; margin: 6px 0 0 0;">Naeemi Naam Hai Mohabbat Ka</p>
    </div>
    
    <!-- Body Content Area -->
    <div style="padding: 40px 30px; line-height: 1.6; font-size: 13.5px; color: #3f3a36;">
      <h2 style="font-family: serif; color: #aa7c11; font-size: 18px; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #e8dec9; padding-bottom: 10px;">${title}</h2>
      ${bodyContent}
    </div>

    <!-- Brand Footer -->
    <div style="background-color: #faf7f2; padding: 25px; text-align: center; border-top: 1px solid #e8dec9; font-size: 10px; color: #8a827c; font-weight: 500;">
      <p style="margin: 0 0 10px 0;">If you have any questions, reach us on WhatsApp at <strong>03092184760</strong> or email <strong>support@naeemi.com</strong></p>
      <p style="margin: 0;">© ${new Date().getFullYear()} Naeemi Fragrance. Gulberg III, Lahore, Pakistan.</p>
    </div>
  </div>
</div>
`;

// 1. Send Email Verification OTP
export async function sendEmailVerificationOtp(email: string, name: string, otp: string) {
  const title = "Verify Your Email Address";
  const content = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>Thank you for creating an account with Naeemi Fragrance. To secure your profile and verify your registration, please use the 6-digit verification code below:</p>
    
    <div style="background-color: #faf7f2; border: 1px dashed #d4af37; border-radius: 16px; padding: 20px; text-align: center; margin: 30px 0; letter-spacing: 6px; font-size: 28px; font-weight: 900; color: #aa7c11;">
      ${otp}
    </div>
    
    <p style="color: #8a827c; font-size: 11px;">* This verification code is valid for <strong>5 minutes</strong>. Do not share this OTP with anyone.</p>
    <p>We are excited to guide you in finding your luxury scent identity.</p>
  `;
  return sendMailHelper(email, `Naeemi Fragrance - Verify Email (${otp})`, emailBaseTemplate(title, content));
}

// 2. Send Forgot Password OTP
export async function sendForgotPasswordOtp(email: string, name: string, otp: string) {
  const title = "Password Reset Authorization";
  const content = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>We received a request to reset your Naeemi account password. Please enter the following 6-digit security code to authorize your password update:</p>
    
    <div style="background-color: #faf7f2; border: 1px dashed #d4af37; border-radius: 16px; padding: 20px; text-align: center; margin: 30px 0; letter-spacing: 6px; font-size: 28px; font-weight: 900; color: #aa7c11;">
      ${otp}
    </div>
    
    <p style="color: #8a827c; font-size: 11px;">* This security code is valid for <strong>5 minutes</strong>. If you did not request a password reset, please secure your account immediately or contact support.</p>
  `;
  return sendMailHelper(email, `Naeemi Fragrance - Password Reset Code (${otp})`, emailBaseTemplate(title, content));
}

// 3. Send Welcome Email
export async function sendWelcomeEmail(email: string, name: string) {
  const title = "Welcome to the Naeemi Fragrance Vault";
  const content = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>Your email has been successfully verified! Welcome as an official registered member of <strong>Naeemi Fragrance</strong>.</p>
    <p>True to our tagline, <em>"Naeemi Naam Hai Mohabbat Ka"</em>, we strive to bring you ultimate satisfaction through handcrafted luxury Ouds and French floral imports, mixed at maximum longevity concentrations.</p>
    
    <div style="background: linear-gradient(135deg, #faf7f2 0%, #ffffff 100%); border: 1px solid #d4af37; border-radius: 16px; padding: 20px; margin: 25px 0;">
      <h4 style="margin-top:0; color: #aa7c11; font-family: serif; font-size: 14px;">Member Exclusive Benefits:</h4>
      <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #5a5450; space-y: 2px;">
        <li>Track your shipment status in real-time in your Profile.</li>
        <li>Expedited checkouts with saved shipping addresses.</li>
        <li>Access to private member launches and batch discounts.</li>
      </ul>
    </div>
    
    <p>Browse our catalog today and find your signature note.</p>
    <div style="text-align: center; margin-top: 25px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop" style="background-color: #1c1917; color: #ffffff; padding: 12px 25px; border-radius: 12px; font-size: 12px; font-weight: bold; text-decoration: none; display: inline-block; border: 1px solid #d4af37;">Explore Collection</a>
    </div>
  `;
  return sendMailHelper(email, "Welcome to Naeemi Fragrance - Naam Hai Mohabbat Ka", emailBaseTemplate(title, content));
}

// 4. Send Order Confirmation Email
export async function sendOrderConfirmation(email: string, order: any) {
  const title = "Order Placed Successfully";
  
  const itemsListHtml = order.items
    .map(
      (item: any) => `
    <tr style="border-bottom: 1px solid #e8dec9;">
      <td style="padding: 10px 0; font-weight: bold; color: #1c1917;">${item.name} <span style="color: #8a827c; font-weight: 500;">x${item.quantity}</span></td>
      <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #1c1917;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `
    )
    .join("");

  const content = `
    <p>Dear <strong>${order.customerName}</strong>,</p>
    <p>Thank you for your purchase! Your order <strong>${order.id}</strong> has been received and is currently being processed by our curation team.</p>
    
    <h3 style="font-family: serif; color: #aa7c11; font-size: 14px; margin-top: 25px; border-bottom: 1px solid #e8dec9; pb-5;">Invoice Summary:</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
      <thead>
        <tr style="border-bottom: 1px solid #d4af37; font-weight: bold; color: #aa7c11; text-transform: uppercase;">
          <th style="text-align: left; padding-bottom: 8px;">Product</th>
          <th style="text-align: right; padding-bottom: 8px;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsListHtml}
        <tr>
          <td style="padding: 12px 0 6px 0; color: #8a827c;">Shipping Method:</td>
          <td style="padding: 12px 0 6px 0; text-align: right; font-weight: bold;">Cash on Delivery</td>
        </tr>
        <tr style="font-size: 14px; font-weight: bold; border-top: 1px solid #d4af37;">
          <td style="padding: 12px 0; color: #1c1917;">Total Amount Paid:</td>
          <td style="padding: 12px 0; text-align: right; color: #aa7c11;">Rs. ${order.totalAmount.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div style="background-color: #faf7f2; border-radius: 16px; padding: 15px; margin: 25px 0; font-size: 12px; border: 1px solid #e8dec9;">
      <h4 style="margin: 0 0 6px 0; color: #aa7c11; font-family: serif;">Delivery Destination:</h4>
      <p style="margin: 0; color: #5a5450; font-weight: 500; line-height: 1.5;">
        ${order.customerAddress}<br/>
        Contact: ${order.customerPhone}
      </p>
    </div>

    <p style="font-size: 11.5px; color: #8a827c;">* Our logistics partner will deliver your package in <strong>2-4 working days</strong>. Our rider will contact you to coordinate delivery.</p>
  `;
  return sendMailHelper(email, `Naeemi Fragrance - Order Placed (${order.id})`, emailBaseTemplate(title, content));
}

// 5. Send Order Status Notification (Shipped, Completed/Delivered, Cancelled)
export async function sendOrderStatusEmail(order: any, status: string) {
  let title = `Order Status: ${status}`;
  let content = "";
  let subject = `Naeemi Fragrance - Order Update (${order.id})`;

  switch (status.toLowerCase()) {
    case "shipped":
      title = "Your Scent is on the Way!";
      subject = `Naeemi Fragrance - Order Shipped (${order.id})`;
      content = `
        <p>Dear <strong>${order.customerName}</strong>,</p>
        <p>Exciting news! Your Naeemi luxury order <strong>${order.id}</strong> has been carefully packed, sealed, and handed over to our courier partner.</p>
        <p>It is currently on its way to your destination and will be delivered shortly. Please ensure your contact number is active so the rider can coordinate delivery.</p>
        
        <div style="background-color: #faf7f2; border-radius: 16px; padding: 15px; margin: 25px 0; font-size: 12px; border: 1px solid #e8dec9;">
          <h4 style="margin: 0 0 6px 0; color: #aa7c11; font-family: serif;">Shipping Info:</h4>
          <p style="margin: 0; color: #5a5450; font-weight: 500;">
            Order ID: <strong>${order.id}</strong><br/>
            Courier Status: <strong>In Transit</strong><br/>
            Destination: ${order.customerAddress}
          </p>
        </div>
      `;
      break;

    case "completed":
      title = "Delivery Confirmed - Enjoy Your Scents!";
      subject = `Naeemi Fragrance - Order Delivered (${order.id})`;
      content = `
        <p>Dear <strong>${order.customerName}</strong>,</p>
        <p>Our courier partner has confirmed the successful delivery of order <strong>${order.id}</strong>. We hope you absolute love your new fragrances!</p>
        <p>True to our heritage, we mix our scents at Extrait concentrations for ultimate projection. We would be absolutely thrilled to receive your feedback or review on our shop!</p>
        
        <div style="text-align: center; margin-top: 25px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile" style="background-color: #1c1917; color: #ffffff; padding: 12px 25px; border-radius: 12px; font-size: 12px; font-weight: bold; text-decoration: none; display: inline-block; border: 1px solid #d4af37;">Track History & Review</a>
        </div>
      `;
      break;

    case "cancelled":
      title = "Order Cancellation Confirmation";
      subject = `Naeemi Fragrance - Order Cancelled (${order.id})`;
      content = `
        <p>Dear <strong>${order.customerName}</strong>,</p>
        <p>This email confirms that order <strong>${order.id}</strong> has been cancelled.</p>
        <p>If this was a mistake or you wish to modify order contents/address details instead, please call or WhatsApp support at <strong>03092184760</strong> immediately. We would be happy to assist you in re-creating your order.</p>
      `;
      break;

    default:
      content = `
        <p>Dear <strong>${order.customerName}</strong>,</p>
        <p>Your order <strong>${order.id}</strong> status has been updated to: <strong>${status}</strong>.</p>
      `;
      break;
  }

  return sendMailHelper(order.customerEmail, subject, emailBaseTemplate(title, content));
}

// 6. Send Contact Form Submission (Inquiry to Business Owner)
export async function sendContactInquiry(name: string, email: string, phone: string, message: string) {
  const title = "New Customer Inquiry Received";
  const content = `
    <p>You have received a new contact submission from your store website:</p>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; margin: 20px 0; border: 1px solid #e8dec9;">
      <tbody>
        <tr style="background-color: #faf7f2; border-bottom: 1px solid #e8dec9;">
          <td style="padding: 10px; font-weight: bold; width: 120px; color: #aa7c11;">Customer Name:</td>
          <td style="padding: 10px; color: #1c1917;">${name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e8dec9;">
          <td style="padding: 10px; font-weight: bold; color: #aa7c11;">Email Address:</td>
          <td style="padding: 10px; color: #1c1917;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr style="background-color: #faf7f2; border-bottom: 1px solid #e8dec9;">
          <td style="padding: 10px; font-weight: bold; color: #aa7c11;">Mobile Phone:</td>
          <td style="padding: 10px; color: #1c1917;"><a href="tel:${phone}">${phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #aa7c11; vertical-align: top;">Message:</td>
          <td style="padding: 10px; color: #1c1917; line-height: 1.5;">${message}</td>
        </tr>
      </tbody>
    </table>
    
    <p style="font-size: 11px; color: #8a827c;">* You can reply directly to this customer inquiry by clicking their email address above.</p>
  `;
  // Send inquiry email to business owner
  return sendMailHelper(businessEmail, `Naeemi Fragrance Care Inquiry - From ${name}`, emailBaseTemplate(title, content));
}
