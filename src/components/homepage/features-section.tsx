import { imageSource } from "@/config/constants";

export const FeaturesSection = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-[96rem] sm:text-center">
          <h2 className="text-base font-semibold leading-7 md:text-2xl">
            We&#39;ve got what you need
          </h2>
          <h2 className="mt-2 text-4xl font-bold uppercase tracking-tight text-gray-900 sm:text-7xl">
            No car? No problem
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our exclusive collection offers unmatched luxury and speed for the
            unlimited driving experience
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16 sm:-mb-24 xl:mb-0">
        <div
          className="mx-auto h-[380px] max-w-7xl bg-cover bg-bottom bg-no-repeat shadow-2xl xl:rounded-t-xl"
          style={{
            background: `url(${imageSource.featured})`,
            backgroundPosition: "bottom",
          }}
        />
        <div aria-hidden="true" className="relative hidden xl:block">
          <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white to-transparent pt-[3%]" />
        </div>
      </div>
    </div>
  );
};
