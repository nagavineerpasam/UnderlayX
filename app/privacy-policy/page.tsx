import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-center mb-12">Effective Date: January 21, 2024</p>
        <div className="max-w-3xl mx-auto">
          <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
            <p className="text-gray-300 mb-6">
              UnderlayX AI ("the Service") respects your privacy and is committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our Service.
            </p>

            {[
              {
                title: "1. Information We Collect",
                content: [
                  "We only collect the following information when you use our Service:",
                  "1.1 Google Account Information:",
                  "When you sign in using Google Sign-In, we collect your email address and avatar (profile picture) to create your account and display this information on the user interface.",
                  "1.2 Payment Information:",
                  "• For transactions requiring Indian payment methods (via PayU), we collect your phone number.",
                  "• This number is required by PayU to send transaction confirmation SMS messages.",
                  "Note: We do not store your phone number in our database. It is only used to facilitate the transaction process."
                ]
              },
              {
                title: "2. Image Processing",
                content: [
                  "2.1 Local Processing:",
                  "For features not requiring third-party services, all image processing occurs locally on your device's browser. Your images are not uploaded to or stored on our servers.",
                  "2.2 Integration with Replicate API:",
                  "When using features powered by the Replicate API, your image is temporarily sent to their servers for processing.",
                  "Replicate's Policy: Input and output files are automatically deleted after one hour on their servers.",
                  "We do not store or use your input or output images for any purpose beyond delivering the processed result.",
                  "Note: If you wish to retain the processed image, you must download it, as neither Replicate nor UnderlayX stores these images permanently."
                ]
              },
              {
                title: "3. How We Use Your Information",
                content: [
                  "We use the collected information for the following purposes:",
                  "• Account Creation and Display: To create your account and display your email address and avatar on the interface.",
                  "• Authentication: To verify your identity and enable access to certain features of the Service.",
                  "• Transaction Facilitation: To ensure successful payment processing for Indian users via PayU.",
                  "• Improving the Service: To understand usage patterns and enhance the Service (via anonymized data from Google Analytics)."
                ]
              },
              {
                title: "4. Data Privacy and Security",
                content: [
                  "• No Image Storage: Your images are not stored on our servers. Images sent to the Replicate API are automatically deleted after processing or within one hour, as per their policy.",
                  "• No Data Sharing: We do not share, sell, or distribute your personal information with third parties.",
                  "• Google Analytics: We use Google Analytics to track anonymous usage statistics, such as page views and session times. This data is not tied to your personal information."
                ]
              },
              {
                title: "5. Third-Party Services",
                content: [
                  "We use the following third-party services:",
                  "• Google Sign-In: To authenticate users and retrieve email addresses and avatars.",
                  "• Google Analytics: To collect anonymized usage data for improving the Service.",
                  "• PayU: To process payments for Indian users, which requires a phone number for transaction SMS notifications.",
                  "• Replicate API: To process images sent by users. Input and output files are deleted after one hour as per Replicate's policy.",
                  "These services may have their own privacy policies, which you can review to understand how they handle your data."
                ]
              },
              {
                title: "6. Your Rights",
                content: [
                  "As a user, you have the following rights:",
                  "Data Deletion: Since no images or personal data are permanently stored on our servers, your data is automatically removed after processing or upon exiting the Service."
                ]
              },
              {
                title: "7. Changes to This Privacy Policy",
                content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the updated policy will become effective upon posting."
              },
              {
                title: "8. Contact Us",
                content: [
                  "If you have any questions or concerns about this Privacy Policy, please contact us:",
                  "Email: dailifyofficial@gmail.com",
                  "Website: https://www.underlayx.com"
                ]
              }
            ].map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
                {Array.isArray(section.content) ? (
                  <div className="space-y-2">
                    {section.content.map((item, i) => (
                      <p key={i} className="text-gray-300">{item}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300">{section.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
