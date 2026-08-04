const resetPasswordEmail = (resetLink, userName) => {
    return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8" />
<title>Reset Password</title>
</head>

<body style="
    margin:0;
    padding:40px;
    background:#f8fafc;
    font-family:Arial,sans-serif;
">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
>

<tr>

<td align="center">

<table
    width="600"
    cellpadding="0"
    cellspacing="0"
    style="
        background:#ffffff;
        border-radius:16px;
        overflow:hidden;
        box-shadow:0 10px 40px rgba(0,0,0,.08);
    "
>

<tr>

<td
    style="
        background:#1E3A8A;
        padding:30px;
        color:white;
        text-align:center;
    "
>

<h1
    style="
        margin:0;
        font-size:30px;
    "
>
    Avora
</h1>

<p
    style="
        margin-top:10px;
        opacity:.9;
    "
>
    Travel Diary Platform
</p>

</td>

</tr>

<tr>

<td style="padding:40px;">

<h2 style="margin-top:0;">
Hello ${userName},
</h2>

<p
    style="
        color:#475569;
        line-height:1.8;
    "
>

We received a request to reset your Avora password.

If you made this request, click the button below.

</p>

<div
    style="
        text-align:center;
        margin:40px 0;
    "
>

<a
    href="${resetLink}"
    style="
        display:inline-block;
        background:#3559D4;
        color:white;
        text-decoration:none;
        padding:15px 30px;
        border-radius:12px;
        font-weight:bold;
    "
>

Reset Password

</a>

</div>

<p
    style="
        color:#64748b;
        line-height:1.8;
    "
>

This link expires in
<strong>15 minutes.</strong>

</p>

<p
    style="
        color:#64748b;
        line-height:1.8;
    "
>

If you didn't request a password reset,
you can safely ignore this email.

</p>

<hr
    style="
        border:none;
        border-top:1px solid #e2e8f0;
        margin:35px 0;
    "
>

<p
    style="
        font-size:13px;
        color:#94a3b8;
    "
>

© ${new Date().getFullYear()} Avora.
All rights reserved.

</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;
};

module.exports = resetPasswordEmail;