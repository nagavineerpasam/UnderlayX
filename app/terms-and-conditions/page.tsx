import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
          Terms and Conditions
        </h1>
        <p className="text-gray-400 text-center mb-12">Effective Date: January 21, 2024</p>
        <div className="max-w-3xl mx-auto">
          <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
            <p className="text-gray-300 mb-6">
              By accessing or using UnderlayX AI ("the Service"), you agree to comply with and be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, do not use the Service.
            </p>

            {[
              {
                title: "1. Acceptance of Terms",
                content: "By using UnderlayX AI, you agree to these Terms and Conditions, which may be updated from time to time. We encourage you to review these Terms periodically to stay informed of any changes."
              },
              {
                title: "2. User Authentication",
                content: ["Google Sign-In: To access certain features of the Service, you must authenticate via Google Sign-In. We use the Google Sign-In redirect method to authenticate you and retrieve your email address and avatar from Google. This information will be used to create your account and display your avatar and email on the user interface (UI).",
                "You are solely responsible for maintaining the confidentiality of your login credentials."]
              },
              {
                title: "3. Image Processing",
                content: ["All image processing, including adding text and shapes behind images, occurs entirely on your device's browser. UnderlayX AI does not process or store any of your images on our servers.",
                "The Service only processes images locally, which means your data never leaves your device unless you choose to download the processed file."]
              },
              {
                title: "4. Data Privacy and Security",
                content: ["UnderlayX AI does not store any images or personal data on its servers. All images and data are processed on your device's browser.",
                "We do not track or store personal data. Any data (such as images) provided by you is processed locally and deleted once you exit the page or download the processed image.",
                "Third-Party Integrations:",
                "• We use PayU for payments within India, requiring a phone number to send transaction SMS. This information is passed to PayU securely but is not stored in our database.",
                "• We use Replicate API to process images. Images are sent to their API for processing, and results are returned without being stored by us. Replicate deletes any input or output files after one hour."]
              },
              {
                title: "5. User Responsibilities",
                content: ["We encourage you to explore your creativity and have fun using UnderlayX AI! To keep the platform enjoyable and safe for everyone, we ask that you:",
                "• Use the Service responsibly and in ways that inspire creativity.",
                "• Avoid uploading or creating content that could harm others or violate any laws, such as offensive, explicit, or illegal material.",
                "• Respect intellectual property rights and ensure the content you create does not infringe on the rights of others.",
                "• Help us maintain smooth operations by using the platform as intended and avoiding unauthorized activities."]
              },
              {
                title: "6. Limitations of Liability",
                content: ["UnderlayX AI provides the Service \"as is\" and does not guarantee that the Service will be uninterrupted or error-free.",
                "We are not responsible for any direct, indirect, incidental, or consequential damages arising from the use of the Service, including but not limited to any loss of data or images."]
              },
              {
                title: "7. Termination",
                content: "UnderlayX AI reserves the right to suspend or terminate your access to the Service if we determine that you have violated these Terms."
              },
              {
                title: "8. Changes to Terms",
                content: "We reserve the right to modify or update these Terms at any time. When we make changes, we will post the updated Terms on this page, and the changes will become effective immediately upon posting."
              },
              {
                title: "9. Contact Information",
                content: ["If you have any questions about these Terms and Conditions, please contact us at:",
                "Email: dailifyofficial@gmail.com",
                "Website: https://www.underlayx.com/"]
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
