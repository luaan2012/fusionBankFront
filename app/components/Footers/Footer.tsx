import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';

export const Footer = () => {
  const institutionalLinks = ['Sobre nós', 'Carreiras', 'Imprensa'];
  const helpLinks = ['Central de Ajuda', 'Segurança', 'Fale conosco'];
  const legalLinks = ['Termos de uso', 'Política de privacidade', 'LGPD'];
  const socialLinks = [faFacebookF, faTwitter, faInstagram, faLinkedinIn];

  return (
    <footer className="bg-white dark:bg-dark-secondary border-t dark:border-dark py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a href="#" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white mr-2">
                <FontAwesomeIcon icon={faUniversity} />
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-light">DeepBank</span>
            </a>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Seu banco digital completo
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8 text-sm">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-gray-800 dark:text-light mb-2">Institucional</h3>
              <ul className="space-y-1">
                {institutionalLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-light smooth-transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-gray-800 dark:text-light mb-2">Ajuda</h3>
              <ul className="space-y-1">
                {helpLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-light smooth-transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-light mb-2">Jurídico</h3>
              <ul className="space-y-1">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-light smooth-transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t dark:border-dark mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            © 2023 DeepBank. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((icon, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-light smooth-transition"
              >
                <FontAwesomeIcon icon={icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;