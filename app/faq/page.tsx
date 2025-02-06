import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import Link from 'next/link';

export default function FAQ() {
  const faqs = [
    {
      question: "What is UnderlayX AI?",
      answer: "UnderlayX AI is a free online tool designed for creative image editing. It allows you to clone images, add text and shapes behind objects, customize backgrounds, and download high-quality edits, all from your browser."
    },
    {
      question: "Do I need to create an account to use UnderlayX AI?",
      answer: "Yes, you need to sign up with Google to access UnderlayX AI and unlock its full suite of features."
    },
    {
      question: "Does UnderlayX AI store my images or personal data?",
      answer: "No, UnderlayX AI operates fully client-side. Your images and edits are processed locally on your device and are never uploaded or stored on our servers."
    },
    {
      question: "Is UnderlayX AI free to use?",
      answer: "Yes, UnderlayX AI is free to use. Premium features and options will be introduced soon for even more functionality."
    },
    {
      question: "What features does UnderlayX AI offer?",
      answer: "UnderlayX AI provides powerful editing tools, including cloning images, customizing backgrounds, adding text behind images, placing shapes behind objects, and downloading high-resolution edits."
    },
    {
      question: "How do I place text behind an image?",
      answer: <span>You can place text behind images effortlessly. Simply visit <Link href="https://www.underlayx.com/text-behind-image" className="text-blue-400 hover:underline">Text Behind Image</Link>.</span>
    },
    {
      question: "How do I place shapes behind objects in an image?",
      answer: <span>To place shapes behind objects in your image, visit <Link href="https://www.underlayx.com/shape-behind-image" className="text-blue-400 hover:underline">Shape Behind Image</Link>.</span>
    },
    {
      question: "How do I remove the background from an image?",
      answer: <span>Removing the background of any image is simple. Visit <Link href="https://www.underlayx.com/remove-background" className="text-blue-400 hover:underline">Remove Background</Link>.</span>
    },
    {
      question: "How do I change the background of an image?",
      answer: <span>Changing the background of an image is quick and easy. Visit <Link href="https://www.underlayx.com/change-background" className="text-blue-400 hover:underline">Change Background</Link>.</span>
    },
    {
      question: "How do I clone images using UnderlayX AI?",
      answer: <span>Cloning images is straightforward. Just visit <Link href="https://www.underlayx.com/clone-image" className="text-blue-400 hover:underline">Clone Image</Link>.</span>
    },
    {
      question: "Can I customize backgrounds with UnderlayX AI?",
      answer: "Yes, you can easily remove, change, or customize backgrounds to fit your creative needs."
    },
    {
      question: "Does UnderlayX AI support high-resolution downloads?",
      answer: "Absolutely! All your edited images can be downloaded in high resolution to ensure the best quality."
    },
    {
      question: "Do I need any design experience to use UnderlayX AI?",
      answer: "Not at all! UnderlayX AI is user-friendly and designed for everyone, from beginners to professionals."
    },
    {
      question: "Is there a limit to how many images I can edit on UnderlayX AI?",
      answer: "No, you can edit as many images as you like without any restrictions."
    },
    {
      question: "Does UnderlayX AI work on all devices?",
      answer: "Yes, UnderlayX AI is a web-based tool designed to work on any device with an internet connection and a modern browser."
    },
    {
      question: "How do I report a bug or request a feature?",
      answer: "You can contact me at dailifyofficial@gmail.com."
    },
    {
      question: "Does UnderlayX AI work offline?",
      answer: "No, UnderlayX AI requires an internet connection to function, as it is a web-based tool."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Frequently Asked Questions
        </h1>
        <div className="max-w-3xl mx-auto space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-3">{faq.question}</h2>
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
