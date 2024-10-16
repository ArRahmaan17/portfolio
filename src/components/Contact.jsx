import React from "react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  let { t } = useTranslation();
  const contacts = [
    {
      name: "Email",
      description: "ardrah17@gmail.com",
    },{
      name: "Github",
      description: "github.com/ArRahmaan17",
    },
    {
      name: "Phone",
      description: "(+62) 895 228 327 0",
    },
  ];

  return (
    <div className="bg-black py-40 lg:py-72" id="contact">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl lg:text-center">
          <h2 className="pt-8 text-center text-2xl text-white md:text-4xl lg:text-6xl">
            {t("contact")}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
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
                <dt className="min-w-max text-base font-semibold leading-7 text-gray-300">
                  <div className="text-slate-600 delay-300 duration-100 ease-linear group-hover:text-slate-100">{`${contact.description}`}</div>
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
