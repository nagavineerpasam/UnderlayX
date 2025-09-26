"use client";

const BADGE_DIMENSIONS = {
  width: 250,
  height: 54, // Standard height for Product Hunt badges
};

export const ProductHuntBadges = () => {
  return (
    <section className="py-16 md:py-24">
      {/* Achievement Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Recognized by{" "}
          <span className="inline-flex md:inline">
            <span className="text-purple-400">Product Hunt</span>
          </span>
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Proud to be ranked among the top products in Marketing and Design
          tools, trusted by creators worldwide
        </p>
      </div>

      {/* Badges Container */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-4 mt-8 px-4 pb-10">
        {[
          {
            href: "https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-underlayx",
            src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=739682&theme=light&period=weekly&topic_id=44",
          },
          {
            href: "https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-underlayx",
            src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=739682&theme=light&period=daily",
          },
          {
            href: "https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-underlayx",
            src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=739682&theme=light&period=weekly&topic_id=164",
          },
        ].map((badge, index) => (
          <a
            key={index}
            href={badge.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <img
              src={badge.src}
              alt="UnderlayX - Product Hunt Badge"
              width={BADGE_DIMENSIONS.width}
              height={BADGE_DIMENSIONS.height}
              className="w-full max-w-[250px] h-auto mx-auto"
            />
          </a>
        ))}
      </div>
    </section>
  );
};
