import { Problem } from '../domain';

/**
 * Seed set of LLD problems loaded into memory on startup.
 * Stable, human-readable ids so links and attempts remain predictable.
 */
export const seedProblems: Problem[] = [
  {
    id: 'parking-lot',
    title: 'Parking Lot System',
    description:
      'Design a parking lot system that manages multiple levels, different vehicle ' +
      'types, and spot allocation. It should handle vehicles entering and exiting, ' +
      'assign appropriate spots, and calculate parking fees on exit.',
    difficulty: 'Medium',
    category: 'Object-Oriented Design',
    requirements: [
      'Support multiple parking levels, each with a fixed number of spots.',
      'Support different spot sizes: motorcycle, compact, and large.',
      'Assign the nearest available spot that fits the incoming vehicle.',
      'Track availability in real time and reject entry when the lot is full.',
      'Issue a ticket on entry and compute the fee on exit based on duration.',
      'Support multiple entry and exit points operating concurrently.',
    ],
    examples: [
      {
        title: 'Vehicle entry',
        description:
          'A car enters; the system assigns the nearest free compact or large spot ' +
          'and issues a ticket stamped with the entry time.',
      },
      {
        title: 'Lot full',
        description:
          'A truck arrives when all large spots are occupied; the system denies ' +
          'entry and reports "Lot Full" for that vehicle type.',
      },
    ],
  },
  {
    id: 'library-management',
    title: 'Library Management System',
    description:
      'Design a library management system where members search the catalog, borrow ' +
      'and return books, and librarians manage inventory. Track due dates and fines ' +
      'for late returns.',
    difficulty: 'Easy',
    category: 'Object-Oriented Design',
    requirements: [
      'Maintain a catalog of books, each with one or more physical copies.',
      'Allow members to search books by title, author, or category.',
      'Allow a member to borrow an available copy, setting a due date.',
      'Handle returns and mark copies as available again.',
      'Compute fines for overdue returns based on a daily rate.',
      'Allow librarians to add or remove books and copies.',
    ],
    examples: [
      {
        title: 'Borrow a book',
        description:
          "A member borrows an available copy of 'Clean Code'; the copy is marked as " +
          'loaned and a 14-day due date is assigned.',
      },
      {
        title: 'Overdue return',
        description:
          'A member returns a book three days late; the system computes a fine using ' +
          'the configured daily overdue rate.',
      },
    ],
  },
  {
    id: 'food-delivery',
    title: 'Food Delivery System',
    description:
      'Design a food delivery platform (like Swiggy) connecting customers, ' +
      'restaurants, and delivery partners. Handle browsing restaurants, placing ' +
      'orders, assigning delivery partners, and tracking an order end to end.',
    difficulty: 'Hard',
    category: 'System Design',
    requirements: [
      'Let customers browse restaurants and menus filtered by location and cuisine.',
      'Support cart management and placing an order with multiple items.',
      'Assign an available delivery partner near the restaurant on confirmation.',
      'Track the order lifecycle: placed → accepted → preparing → out for delivery → delivered.',
      'Provide real-time status updates and an estimated delivery time.',
      'Process payments and support cancellation with refund rules.',
      'Handle surge scenarios where demand exceeds available delivery partners.',
    ],
    examples: [
      {
        title: 'Place an order',
        description:
          'A customer adds two items to the cart and checks out; the system creates ' +
          "an order in the 'placed' state and notifies the restaurant.",
      },
      {
        title: 'Partner assignment',
        description:
          'On confirmation the system selects the closest available delivery ' +
          "partner and moves the order to 'out for delivery' once it is picked up.",
      },
    ],
  },
];
