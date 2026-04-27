const { fakerID_ID: faker } = require("@faker-js/faker");

const DEPARTMENTS = ["Engineering", "Finance", "Marketing", "Sales"];
const ROLES_FINANCE = ["Accountant", "Financial Analyst", "Controller", "CFO"];
const ROLES_MARKETING = ["Marketing Manager", "Content Strategist", "SEO Specialist", "Social Media Manager"];
const ROLES_SALES = ["Sales Representative", "Account Executive", "Sales Manager", "Business Development"];
const ROLES_ENGINEERING = [
  "Junior Developer",
  "Senior Developer",
  "QA Engineer",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Data Analyst",
];
const STATUSES = ["active", "inactive", "probation"];

const generateEmployees = (count = 25) => {
  return Array.from({ length: count }, (_, index) => {
    const fullName = faker.person.fullName();
    const emailSlug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, ".");
    let role;
    let department = faker.helpers.arrayElement(DEPARTMENTS);
    switch (department) {
      case "Engineering":
        role = faker.helpers.arrayElement(ROLES_ENGINEERING);
        break;
      case "Finance":
        role = faker.helpers.arrayElement(ROLES_FINANCE);
        break;
      case "Marketing":
        role = faker.helpers.arrayElement(ROLES_MARKETING);
        break;
      case "Sales":
        role = faker.helpers.arrayElement(ROLES_SALES);
        break;
      default:
        role = faker.helpers.arrayElement([...ROLES_ENGINEERING, ...ROLES_FINANCE, ...ROLES_MARKETING, ...ROLES_SALES]);
    }
    return {
      name: fullName,
      email: `${emailSlug}.${Date.now()}.${index}@company.com`,
      role: role,
      department: department,
      salary: faker.number.int({ min: 5000000, max: 50000000 }),
      join_date: faker.date.past({ years: 3 }).toISOString(),
      status: faker.helpers.arrayElement(STATUSES),
      performance: faker.number.float({ min: 0.1, max: 1, fractionDigits: 2 }),
      is_remote: faker.datatype.boolean(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(faker.string.uuid())}`,
    };
  });
};

module.exports = { generateEmployees };
