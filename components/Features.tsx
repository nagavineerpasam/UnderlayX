export const Features = () => {
  const features = [
    {
      title: "Clone Objects in Images",
      description: "Easily clone objects within your image and create multiple versions without altering the background.",
      icon: "🔄"
    },
    {
      title: "Place Logos or Images Behind Main Image",
      description: "Effortlessly insert logos, product images, or other graphics behind the main image to enhance the composition.",
      icon: "🎯"
    },
    {
      title: "Change Backgrounds & Move Objects",
      description: "Seamlessly change the background of your images or reposition objects to achieve the perfect look.",
      icon: "🎨"
    },
    {
      title: "Remove Backgrounds",
      description: "Quickly remove the background of your images with precision for a clean, professional look.",
      icon: "✂️"
    },
    {
      title: "Add Text Behind Images",
      description: "Place text behind images to create depth and a unique, polished visual effect.",
      icon: "✍️"
    },
    {
      title: "Add Shapes Behind Images",
      description: "Insert shapes behind objects for added dimension and creative flair.",
      icon: "🔷"
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-16">
          Everything You Need for <span className="text-purple-700 dark:text-purple-400">Professional Designs</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm 
                border border-gray-200 dark:border-white/10 
                hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all
                shadow-sm hover:shadow-md hover:shadow-purple-500/10 dark:hover:shadow-purple-500/10"
            >
              <div className="text-2xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
