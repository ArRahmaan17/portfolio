import { useTranslation } from "react-i18next";

const Hero = (props) => {
  const { t } = useTranslation();

  return (
    <div class="dark:bg-black">
      <div className="relative isolate mx-50 max-w-auto md:mx-20 md:py-16 lg:mx-5 px-6 py-16 lg:px-8 lg:py-56">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={props.customStyle}
          ></div>
        </div>
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-left lg:text-center">
            <h1 className="text-lg font-bold sm:text-2xl dark:text-gray-100">
              {t("im")}
            </h1>
            <div className="flex justify-start lg:justify-center min-h-16 mt-2">
              <h1
                className="text-2xl font-bold text-rose-600 dark:text-indigo-500 sm:text-5xl"
                ref={props.node}
              >
                {""}
              </h1>
            </div>
            <p className="text-sm text-md mt-2 leading-8 sm:text-sm/9 dark:text-gray-100">
              {t("short_intro")}
            </p>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={props.customStyle}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
