import { Role } from '@prisma/client';

export interface GeneratedUser {
  firstName: string;
  lastName: string;
  birthDate: string;
  city: string;
  country: string;
  avatar: string;
  company: string;
  jobPosition: string;
  mobile: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

// 15 pays africains avec leurs codes ISO2 et indicatifs téléphoniques
const AFRICAN_COUNTRIES = [
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', format: '## ## ## ## ##' },
  { code: 'SN', name: 'Sénégal',        dialCode: '+221', format: '## ### ## ##' },
  { code: 'CM', name: 'Cameroun',       dialCode: '+237', format: '# ## ## ## ##' },
  { code: 'ML', name: 'Mali',           dialCode: '+223', format: '## ## ## ##' },
  { code: 'BF', name: 'Burkina Faso',   dialCode: '+226', format: '## ## ## ##' },
  { code: 'GN', name: 'Guinée',         dialCode: '+224', format: '### ## ## ##' },
  { code: 'TG', name: 'Togo',           dialCode: '+228', format: '## ## ## ##' },
  { code: 'BJ', name: 'Bénin',          dialCode: '+229', format: '## ## ## ##' },
  { code: 'NE', name: 'Niger',          dialCode: '+227', format: '## ## ## ##' },
  { code: 'NG', name: 'Nigeria',        dialCode: '+234', format: '### ### ####' },
  { code: 'GH', name: 'Ghana',          dialCode: '+233', format: '## ### ####' },
  { code: 'MA', name: 'Maroc',          dialCode: '+212', format: '## ## ## ## ##' },
  { code: 'TN', name: 'Tunisie',        dialCode: '+216', format: '## ### ###' },
  { code: 'KE', name: 'Kenya',          dialCode: '+254', format: '### ### ###' },
  { code: 'ZA', name: 'Afrique du Sud', dialCode: '+27',  format: '## ### ####' },
];

let faker: any = null;

const getFaker = async () => {
  if (!faker) {
    const { faker: fakerInstance } = await import('@faker-js/faker');
    faker = fakerInstance;
  }
  return faker;
};

/**
 * Génère un numéro de téléphone au format local d'un pays africain.
 */
const formatPhoneNumber = (dialCode: string, format: string, fakerLib: any): string => {
  const digits = format.replace(/#/g, () => fakerLib.number.int({ min: 0, max: 9 }).toString());
  return `${dialCode} ${digits}`;
};

/**
 * Génère une date de naissance réaliste.
 */
const generateBirthDate = (fakerLib: any): string => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Tranche d'âge : 18 à 65 ans
  const age = fakerLib.number.int({ min: 18, max: 65 });
  const birthYear = currentYear - age;

  // Mois et jour aléatoires
  const birthMonth = fakerLib.number.int({ min: 1, max: 12 });
  // Sécurise le jour max selon le mois (simplifié, février = 28)
  const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
  const birthDay = fakerLib.number.int({ min: 1, max: daysInMonth });

  const mm = String(birthMonth).padStart(2, '0');
  const dd = String(birthDay).padStart(2, '0');

  return `${birthYear}-${mm}-${dd}`;
};

export const generateUsers = async (count: number = 10): Promise<GeneratedUser[]> => {
  const fakerLib = await getFaker();
  const users: GeneratedUser[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = fakerLib.person.firstName();
    const lastName  = fakerLib.person.lastName();

    const username = fakerLib.internet
      .username({ firstName, lastName })
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    // Sélection aléatoire d'un pays africain
    const country = AFRICAN_COUNTRIES[
      fakerLib.number.int({ min: 0, max: AFRICAN_COUNTRIES.length - 1 })
    ];

    users.push({
      firstName,
      lastName,
      birthDate:   generateBirthDate(fakerLib),
      city:        fakerLib.location.city(),
      country:     country.code,
      avatar:      fakerLib.image.avatar(),
      company:     fakerLib.company.name(),
      jobPosition: fakerLib.person.jobTitle(),
      mobile:      formatPhoneNumber(country.dialCode, country.format, fakerLib),
      username,
      email:       fakerLib.internet.email({ firstName, lastName }).toLowerCase(),
      password:    fakerLib.internet.password({
        length: fakerLib.number.int({ min: 6, max: 10 }),
      }),
      role: Math.random() > 0.7 ? Role.ADMIN : Role.USER,
    });
  }

  return users;
};