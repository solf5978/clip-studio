import { featuresData } from "../../public/texts/feature-data";
const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Create
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional video editing tools that rival desktop software, all in
            your browser
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, ind) => (
            <div
              key={ind}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.featureTitle}
              </h3>
              <p className="text-gray-600">{feature.featureDescription}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
