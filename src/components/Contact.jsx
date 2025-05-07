import React from "react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  let { t } = useTranslation();
  const contacts = [
    {
      name: "Email",
      description: "ardrah17@gmail.com",
      link: "mailto:ardrah17@gmail.com",
    },
    {
      name: "Github",
      description: "github.com/ArRahmaan17",
      link: "https://github.com/ArRahmaan17/",
    },
  ];

  return (
    <div className="py-40 lg:py-72 dark:bg-black" id="contact">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl lg:text-center">
          <h2 className="pt-8 text-center text-2xl md:text-4xl lg:text-6xl dark:text-gray-100">
            {t("contact")}
          </h2>
          <p className="mt-6 text-lg leading-8 dark:text-gray-100">
            {t("short_contact")}
          </p>
        </div>
        <div className="mx-auto mt-16 w-full max-w-max">
          <dl className="flex flex-row flex-wrap justify-center justify-items-stretch gap-2">
            {contacts.map((contact) => (
              <div
                key={contact.name}
                className="md:basis-1/8 group grow basis-1/12 cursor-pointer pt-5 ease-linear"
              >
                <dt className="min-w-max text-base font-semibold leading-7">
                  <a
                    href={contact.link}
                    target="_blank"
                    className="delay-300 duration-100 ease-linear hover:text-gray-600 dark:text-gray-100 hover:dark:text-gray-300"
                  >{`${contact.description}`}</a>
                </dt>
              </div>
            ))}
          </dl>
          <div className="items-center justify-center flex flex-row gap-2 mt-10">
            <img
                loading="lazy"
              src="https://www.codewars.com/users/Ardhi%20Rahmaan/badges/micro"
              alt="codewar-badges"
            />
          </div>
        </div>
      </div>
    </div>
  );
}