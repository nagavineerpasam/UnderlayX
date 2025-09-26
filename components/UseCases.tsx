export const UseCases = () => {
  const cases = [
    {
      title: "Content Creators",
      subtitle: "Effortlessly Create Stunning Visuals",
      description:
        "Add shapes, text, and glow effects behind objects in your images to create captivating YouTube thumbnails, Instagram posts, and more. Clone objects, place logos, or change backgrounds with ease for your visual storytelling.",
      icon: "🎥",
    },
    {
      title: "Marketers",
      subtitle: "Boost Your Campaigns",
      description:
        "Design high-quality visuals with custom fonts, colors, and styles to make your ads, banners, and promotional materials stand out. Place logos or other images behind your products, clone objects, and remove backgrounds to achieve the perfect marketing visuals.",
      icon: "📈",
    },
    {
      title: "Photographers",
      subtitle: "Enhance Your Photos",
      description:
        "Transform ordinary images into extraordinary works of art by seamlessly placing text, shapes, and other elements behind objects. Adjust your backgrounds or move objects to create the ideal composition.",
      icon: "📸",
    },
    {
      title: "Digital Artists",
      subtitle: "Unleash Your Creativity",
      description:
        "Experiment with colors, fonts, and effects to bring your artistic vision to life with AI-powered tools. Place text, logos, or images behind your artwork, and use cloning and background-changing features for unique creations.",
      icon: "🎨",
    },
    {
      title: "Social Media Creators",
      subtitle: "Stand Out on Every Platform",
      description:
        "Design engaging content for Instagram, TikTok, Facebook, and beyond in seconds. Use AI to place text and objects behind your images for a professional, layered look.",
      icon: "📱",
    },
    {
      title: "Students & Educators",
      subtitle: "Simplify Creative Projects",
      description:
        'Easily design posters, presentations, and visual aids for school or teaching projects. Use the "behind-image layering" feature to add shapes, logos, or text to your projects with ease.',
      icon: "📚",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-16">
          For Every{" "}
          <span className="text-purple-700 dark:text-purple-400">Creator</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cases.map((card, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm 
                border border-gray-200 dark:border-white/10 
                hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all
                shadow-sm hover:shadow-md hover:shadow-purple-500/10 dark:hover:shadow-purple-500/10"
            >
              <div className="text-2xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {card.title}
              </h3>
              <h4 className="text-lg text-purple-700 dark:text-purple-400 font-medium mb-3">
                {card.subtitle}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
