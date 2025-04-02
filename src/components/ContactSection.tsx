
import ContactForm from "./contact/ContactForm";
import ContactInfo from "./contact/ContactInfo";

const ContactSection = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactSection;
