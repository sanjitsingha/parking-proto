"use client";
import React from "react";

const page = () => {
  return (
    <div className="w-full h-[calc(100vh-90px)]">
      <div className="font-inter bg-blue-light text-white  px-4 pt-8 pb-16 max-w-3xl mx-auto">
        <h1 className="text-lg  mb-3 text-center">Privacy Policy</h1>
        <p className="text-sm text-white/40 text-center mb-6">
          Last updated: October 26, 2025
        </p>

        <p className="mb-4 text-sm">
          Eassy Parking (“we,” “our,” or “us”) is operated by{" "}
          <strong>Sanjit Singha</strong>, based in{" "}
          <strong>Siliguri, West Bengal, India</strong>. This Privacy Policy
          explains how we collect, use, and protect your personal information
          when you use our web application or related services (collectively
          referred to as the “App”). If you have any questions, please contact
          us at{" "}
          <a
            href="mailto:eassyparking@gmail.com"
            className="text-yellow underline"
          >
            eassyparking@gmail.com
          </a>
          .
        </p>

        <section className="mb-6 text-sm">
          <h2 className="text-lg font-regular mb-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Location Data:</strong> Your device’s GPS or searched
              location to show nearby parking spaces.
            </li>
            <li>
              <strong>Search Information:</strong> Locations you search in the
              app to improve recommendations.
            </li>
            <li>
              <strong>Account Information:</strong> Your name, email address,
              and phone number when creating or managing an account.
            </li>
            <li>
              <strong>Usage Analytics:</strong> We use{" "}
              <strong>Umami Analytics</strong> and{" "}
              <strong>Google Analytics</strong> to collect anonymous usage data
              such as page visits and user actions.
            </li>
            <li>
              <strong>Parking Activity:</strong> Details about your parking
              history or reservations (if applicable).
            </li>
          </ul>
        </section>

        <section className="mb-6 text-sm">
          <h2 className="text-lg font-regular mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              To show nearby parking options based on your current or searched
              location.
            </li>
            <li>To improve user experience and optimize app performance.</li>
            <li>To maintain your account and provide support.</li>
            <li>To analyze app usage trends anonymously.</li>
          </ul>
          <p className="mt-2">
            We <strong>do not sell</strong> or trade your personal information.
          </p>
        </section>

        <section className="mb-6 text-sm">
          <h2 className="text-lg font-regular mb-2">
            3. Sharing of Information
          </h2>
          <p>
            We do not intentionally share personal information with third
            parties. However, analytics providers such as Umami and Google
            Analytics may collect limited, anonymous usage data. We ensure these
            providers follow standard data protection practices.
          </p>
        </section>

        <section className="mb-6 text-sm">
          <h2 className="text-lg font-regular mb-2">4. Data Retention</h2>
          <p>
            We retain your data as long as your account is active. If you delete
            your account, all your data will be permanently removed within a
            reasonable time.
          </p>
        </section>

        <section className="mb-6 text-sm">
          <h2 className="text-lg font-regular mb-2">
            5. Your Rights and Choices
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Access, update, or correct your account details.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>
              Control location access from your browser or device settings.
            </li>
          </ul>
          <p className="mt-2">
            To delete your account or request data removal, contact us at{" "}
            <a
              href="mailto:eassyparking@gmail.com"
              className="text-yellow underline"
            >
              eassyparking@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="mb-6 text-sm">
          <h2 className="text-lg font-regular mb-2">
            6. Security of Your Information
          </h2>
          <p>
            We take reasonable steps to protect your data from unauthorized
            access or disclosure. However, no method of transmission or storage
            is 100% secure.
          </p>
        </section>

        <section className="mb-6 text-sm">
          <h2 className="text-lg font-regular mb-2">7. Cookies and Tracking</h2>
          <p>
            Our web app may use cookies or similar technologies for analytics
            and functionality. You can disable cookies through your browser
            settings.
          </p>
        </section>

        <section className="mb-6 text-sm">
          <h2 className="text-lg font-regular mb-2">8. Children’s Privacy</h2>
          <p>
            Eassy Parking is not intended for children under 13. We do not
            knowingly collect data from minors.
          </p>
        </section>

        <section className="mb-6 text-sm">
          <h2 className="text-lg font-regular mb-2">
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy periodically. Any changes will be
            posted here with an updated “Last updated” date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-regular mb-2">10. Contact Us</h2>
          <p>
            📧 <strong>Email:</strong>{" "}
            <a
              href="mailto:eassyparking@gmail.com"
              className="text-yellow underline"
            >
              eassyparking@gmail.com
            </a>
            <br />
            👤 <strong>Operator:</strong> Sanjit Singha
            <br />
            📍 <strong>Location:</strong> Siliguri, West Bengal, India
          </p>
        </section>
      </div>
    </div>
  );
};

export default page;
