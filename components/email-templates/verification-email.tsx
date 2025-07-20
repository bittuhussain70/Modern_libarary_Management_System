interface VerificationEmailProps {
  recipientName: string
  verificationLink: string
}

export function VerificationEmail({ recipientName, verificationLink }: VerificationEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ background: "#f0f4f8", padding: "20px", textAlign: "center" as const }}>
        <h1 style={{ color: "#3b82f6", margin: "0" }}>Library Management System</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <h2>Verify Your Email Address</h2>

        <p>Hello {recipientName},</p>

        <p>
          Thank you for registering with our Library Management System. To complete your registration and access all
          features, please verify your email address by clicking the button below:
        </p>

        <div style={{ textAlign: "center" as const, margin: "30px 0" }}>
          <a
            href={verificationLink}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "12px 24px",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Verify Email Address
          </a>
        </div>

        <p>If you didn't create an account, you can safely ignore this email.</p>

        <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>

        <p style={{ wordBreak: "break-all", color: "#6b7280" }}>{verificationLink}</p>

        <p>This verification link will expire in 24 hours.</p>

        <p>
          Best regards,
          <br />
          The Library Management Team
        </p>
      </div>

      <div
        style={{
          background: "#f0f4f8",
          padding: "20px",
          textAlign: "center" as const,
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  )
}
