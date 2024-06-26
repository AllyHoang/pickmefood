const DUMMY_DONATIONS = [
  {
    id: 1,
    type: "Donation",
    title: "Family Meal Pack Donation",
    image: "family_meal.jpg",
    description:
      "A donation of canned beans that can serve as a nutritious part of family meals. Ideal for shelters or emergency food services.",
    donorName: "John Doe",
    ownerName: "John Doe",
    item: "Canned Beans",
    quantity: 20,
    location: "New York, NY",
    date: "2024-05-07",
    contactEmail: "johndoe@example.com",
    condition: "New",
    expiryDate: "2026-12-31",
    recurring: false,
  },
  {
    id: 2,
    type: "Request",
    title: "Staple Foods for Relief Efforts",
    image: "staple_food.jpg",
    description:
      "Rice packages to support feeding programs, especially suited for ongoing community relief efforts. This is a monthly recurring donation.",
    donorName: "Sarah Smith",
    ownerName: "Sarah Smith",
    item: "Packaged Rice",
    quantity: 50,
    location: "Los Angeles, CA",
    date: "2024-05-06",
    contactEmail: "sarahsmith@example.com",
    condition: "New",
    expiryDate: "2027-01-15",
    recurring: true,
    recurringFrequency: "Monthly",
  },
  {
    id: 3,
    type: "Request",
    title: "Fresh Bread for Daily Meals",
    image: "fresh_bread.jpg",
    description:
      "Donation of whole wheat bread, fresh and ready for immediate distribution to food pantries or end consumers.",
    donorName: "Carlos Ruiz",
    ownerName: "Carlos Ruiz",
    item: "Whole Wheat Bread",
    quantity: 30,
    location: "Miami, FL",
    date: "2024-05-05",
    contactEmail: "carlosruiz@example.com",
    condition: "Fresh",
    expiryDate: "2024-06-01",
    recurring: false,
  },
  {
    id: 4,
    type: "Donation",
    title: "Vegetable Bundle for Healthy Eating",
    image: "vegetable_bundle.jpg",
    description:
      "A variety of fresh vegetables to enrich local community kitchens with healthy options. Weekly deliveries ensure freshness.",
    donorName: "Alice Johnson",
    ownerName: "Alice Johnson",

    item: "Fresh Vegetables",
    quantity: 40,
    location: "Chicago, IL",
    date: "2024-05-08",
    contactEmail: "alicej@example.com",
    condition: "Fresh",
    expiryDate: "2024-05-20",
    recurring: true,
    recurringFrequency: "Weekly",
  },
  {
    id: 5,
    type: "Request",
    title: "Soup Cans for Cold Weather Support",
    image: "soup_cans.jpg",
    description:
      "Canned tomato soup, perfect for cold weather distributions, ensuring warm meals are available for those in need.",
    donorName: "Tom Bennett",
    ownerName: "Tom Bennett",

    item: "Canned Tomato Soup",
    quantity: 100,
    location: "Phoenix, AZ",
    date: "2024-05-10",
    contactEmail: "tomb@example.com",
    condition: "New",
    expiryDate: "2028-02-22",
    recurring: false,
  },
  {
    id: 6,
    type: "Donation",

    title: "Protein-Rich Nutrition Packs",
    image: "protein_rich.jpg",
    description:
      "Protein bars and ready-to-eat meals, perfect for quick nutrition support in areas affected by emergencies.",
    donorName: "Emily Turner",
    ownerName: "Emily Turner",

    item: "Protein Bars",
    quantity: 200,
    location: "Boston, MA",
    date: "2024-05-09",
    contactEmail: "emilyt@example.com",
    condition: "New",
    expiryDate: "2025-10-01",
    recurring: true,
    recurringFrequency: "Monthly",
  },
  {
    id: 7,
    type: "Donation",

    title: "Breakfast Cereals for Schools",
    image: "cereal.jpg",
    description:
      "Whole grain cereals that provide a healthy start to the day for students in underserved communities.",
    donorName: "Mark Lopez",
    ownerName: "Mark Lopez",

    item: "Breakfast Cereal",
    quantity: 150,
    location: "San Diego, CA",
    date: "2024-05-12",
    contactEmail: "marklopez@example.com",
    condition: "New",
    expiryDate: "2025-01-15",
    recurring: true,
    recurringFrequency: "Bi-monthly",
  },
  {
    id: 8,
    type: "Request",

    title: "Fresh Dairy Products",
    image: "fresh.jpg",
    description:
      "Milk, cheese, and yogurt donated by local farms to support community feeding programs.",
    donorName: "Nancy Green",
    ownerName: "Nancy Green",

    item: "Dairy Products",
    quantity: 75,
    location: "Portland, OR",
    date: "2024-05-11",
    contactEmail: "nancyg@example.com",
    condition: "Fresh",
    expiryDate: "2024-05-25",
    recurring: false,
  },
  {
    id: 9,
    type: "Donation",
    title: "Emergency Water Supply",
    image: "water.jpg",
    description:
      "Bottled water for emergency and disaster relief efforts, ensuring hydration in critical situations.",
    donorName: "David Chen",
    ownerName: "David Chen",

    item: "Bottled Water",
    quantity: 500,
    location: "Houston, TX",
    date: "2024-05-13",
    contactEmail: "davidc@example.com",
    condition: "New",
    expiryDate: "2029-01-01",
    recurring: true,
    recurringFrequency: "Annually",
  },
  {
    id: 10,
    type: "Request",

    title: "Snack Packs for After-School Programs",
    image: "snack.jpg",
    description:
      "Healthy snack packs including fruits, nuts, and juice boxes for after-school programs catering to children.",
    donorName: "Laura Wilson",
    ownerName: "Laura Wilson",
    item: "Snack Packs",
    quantity: 120,
    location: "Atlanta, GA",
    date: "2024-05-14",
    contactEmail: "lauraw@example.com",
    condition: "New",
    expiryDate: "2025-08-20",
    recurring: false,
  },
];

export function getAllDonations() {
  return DUMMY_DONATIONS;
}
