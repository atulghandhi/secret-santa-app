# Hosted authentication emails

The app sends pairing emails through Resend using `lib/email.ts`. Supabase sends account confirmation emails independently; deploying the Next.js app does **not** install these templates in the hosted Supabase project.

In the project's **Authentication → Email Templates** dashboard:

1. Open **Confirm sign up**, set the subject to `Confirm your email | Santa Switch`, and copy `confirmation.html` into the body. Preserve any existing custom confirmation URL if the deployed authentication flow requires one; this template uses Supabase's standard `{{ .ConfirmationURL }}`.
2. Append the contents of `affiliate-footer.html` inside the body of every other enabled authentication or security notification template. Preserve each existing action link, OTP, security instructions, and variables. The app currently invokes only signup confirmation; other template types may be enabled independently in Supabase.
3. Check that the Site URL and permitted redirect URLs match the production domain. Preview the confirmation email in Supabase, then test a signup using an account you control.

The footer uses Amazon UK and Store ID `santaswitch-21`, matching `lib/affiliate.ts`. The app's Resend messages include both HTML and plain text. These hosted Supabase assets configure its HTML template body; check the resulting message in the project's SMTP delivery setup as well.

Only send emails with affiliate links to recipients who have agreed to receive them. The app does not collect or infer that consent from an organiser entering an address. Amazon's current UK policies permit Special Links in solicited email and require disclosure. Signup or security email status alone should not be treated as proof of agreement to affiliate marketing.

Sources checked 7 September 2026: [Supabase email templates](https://supabase.com/docs/guides/auth/auth-email-templates), [Amazon UK programme policies, section 4](https://affiliate-program.amazon.co.uk/help/operating/policies/), [Amazon UK disclosure requirement, section 5](https://affiliate-program.amazon.co.uk/help/operating/agreement/).
