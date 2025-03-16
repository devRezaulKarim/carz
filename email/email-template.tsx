export const EmailTemplate = ({ code }: { code: string }) => {
  return `
    <html>
  <head>
    <title>Verification Code for Signing in to Carz</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f4f4f4; padding: 20px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="600px"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"
          >
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <h2 style="color: #333;">Two-Factor Authentication (2FA)</h2>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 10px 20px;">
                <p style="color: #666; font-size: 16px;">
                  Use the verification code below to complete your login:
                </p>
                <p style="font-size: 24px; font-weight: bold; color: #007bff; background-color: #e9ecef; padding: 10px; border-radius: 5px; display: inline-block;">
                  ${code}
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 20px;">
                <p style="color: #666; font-size: 14px;">
                  If you didn't request this code, you can ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 20px;">
                <p style="color: #999; font-size: 12px;">
                  &copy; 2025 Carz. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>;

    `;
};
