
interface IntegrationLogo {
  name: string;
  src: string;
  alt: string;
}

const logos: IntegrationLogo[] = [
  {
    name: "LinkedIn",
    src: "/lovable-uploads/f308a0ab-613e-4584-b384-33ddfae3fe5f.png",
    alt: "LinkedIn logo"
  },
  {
    name: "Gmail",
    src: "/lovable-uploads/839bb465-4a8a-4cb1-a24a-6e9530978c3c.png",
    alt: "Gmail logo"
  }
];

export const IntegrationFooter = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-sm border-t border-gray-800 mt-12">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-0.5 bg-blue-500" />
          <p className="text-sm text-gray-400">Integrates with</p>
          <div className="flex justify-center items-center gap-12">
            {logos.map((logo) => (
              <img
                key={logo.name}
                src={logo.src}
                alt={logo.alt}
                className="h-8 object-contain filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
