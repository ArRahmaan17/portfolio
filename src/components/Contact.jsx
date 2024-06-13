import React from "react";
import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  AtSymbolIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

const contacts = [
  {
    name: "Email",
    description: "ardrah17@gmail.com",
    icon: AtSymbolIcon,
  },
  {
    name: "WhatsApp",
    description: "(+62)89522983270",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: "Telegram",
    description: "(+62)89522983270",
    icon: ChatBubbleOvalLeftEllipsisIcon,
  },
  {
    name: "Phone",
    description: "(+62)89522983270",
    icon: PhoneIcon,
  },
];

export default function Contact() {
  return (
    <div className="bg-black py-40 lg:py-72" id="contact">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-center pt-8 text-2xl md:text-4xl lg:text-6xl text-white">
            Contact Me
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Feel free to contact me for a chat or just some casual chit-chat!
            I'm always up for a conversation. You can reach me at
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
            {contacts.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-300">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {`${feature.name}`}
                  <br />
                  {`${feature.description}`}
                </dt>
                {/* <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd> */}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
