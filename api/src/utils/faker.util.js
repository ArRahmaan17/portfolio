const { fakerID_ID: faker } = require("@faker-js/faker");

const DEPARTMENTS = ["Engineering", "HR", "Finance", "Marketing", "Sales"];
const ROLES = [
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
    return {
      name: fullName,
      email: `${emailSlug}.${Date.now()}.${index}@company.com`,
      role: faker.helpers.arrayElement(ROLES),
      department: faker.helpers.arrayElement(DEPARTMENTS),
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
