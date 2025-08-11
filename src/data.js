const data = [
  {
    id: 1,
    question: "Where was the BRICS summit held in 2014?",
    answers: [
      {
        text: "Brazil",
        correct: true,
      },
      {
        text: "India",
        correct: false,
      },
      {
        text: "Russia",
        correct: false,
      },
      {
        text: "China",
        correct: false,
      },
    ],
  },
  {
    id: 2,
    question: "Which of these spices is the smallest in size?",
    answers: [
      {
        text: "Ajwain",
        correct: true,
      },
      {
        text: "Jeera",
        correct: false,
      },
      {
        text: "Saunf",
        correct: false,
      },
      {
        text: "Methi Seeds",
        correct: false,
      },
    ],
  },
  {
    id: 3,
    question:
      "Which battle in 1757 marked the beginning of British occupation in India?",
    answers: [
      {
        text: "Plassey",
        correct: true,
      },
      {
        text: "Assaye",
        correct: false,
      },
      {
        text: "Buxar",
        correct: false,
      },
      {
        text: "Cuddalore",
        correct: false,
      },
    ],
  },
  {
    id: 4,
    question: "Which is the second most spoken language of Nepal?",
    answers: [
      {
        text: "Bajjika",
        correct: false,
      },
      {
        text: "Nepali",
        correct: false,
      },
      {
        text: "Maithili",
        correct: true,
      },
      {
        text: "Bhojpuri",
        correct: false,
      },
    ],
  },
  {
    id: 5,
    question: "In which of these two sports is the term 'free hit' used?",
    answers: [
      {
        text: "Football, Squash",
        correct: false,
      },
      {
        text: "Badminton, Tennis",
        correct: false,
      },
      {
        text: "Badminton, Cricket",
        correct: false,
      },
      {
        text: "Hockey, Cricket",
        correct: true,
      },
    ],
  },
  {
    id: 6,
    question: "Which is the largest desert in the world?",
    answers: [
      {
        text: "Sahara Desert",
        correct: true,
      },
      {
        text: "Arabian Desert",
        correct: false,
      },
      {
        text: "Gobi Desert",
        correct: false,
      },
      {
        text: "Kalahari Desert",
        correct: false,
      },
    ],
  },
  {
    id: 7,
    question: "Who was the first Prime Minister of India?",
    answers: [
      {
        text: "Sardar Vallabhbhai Patel",
        correct: false,
      },
      {
        text: "Jawaharlal Nehru",
        correct: true,
      },
      {
        text: "Dr. Rajendra Prasad",
        correct: false,
      },
      {
        text: "Subhas Chandra Bose",
        correct: false,
      },
    ],
  },
  {
    id: 8,
    question: "Which country is known as the 'Land of the Rising Sun'?",
    answers: [
      {
        text: "China",
        correct: false,
      },
      {
        text: "South Korea",
        correct: false,
      },
      {
        text: "Japan",
        correct: true,
      },
      {
        text: "Thailand",
        correct: false,
      },
    ],
  },
  {
    id: 9,
    question: "In which year did India gain independence from British rule?",
    answers: [
      {
        text: "1945",
        correct: false,
      },
      {
        text: "1946",
        correct: false,
      },
      {
        text: "1947",
        correct: true,
      },
      {
        text: "1948",
        correct: false,
      },
    ],
  },
  {
    id: 10,
    question: "Which is the national sport of India?",
    answers: [
      {
        text: "Cricket",
        correct: false,
      },
      {
        text: "Hockey",
        correct: true,
      },
      {
        text: "Football",
        correct: false,
      },
      {
        text: "Kabaddi",
        correct: false,
      },
    ],
  },
  {
    id: 11,
    question: "Which is the highest mountain peak in the world?",
    answers: [
      {
        text: "K2",
        correct: false,
      },
      {
        text: "Mount Everest",
        correct: true,
      },
      {
        text: "Kangchenjunga",
        correct: false,
      },
      {
        text: "Lhotse",
        correct: false,
      },
    ],
  },
  {
    id: 12,
    question: "Who is known as the 'Father of the Nation' in India?",
    answers: [
      {
        text: "Jawaharlal Nehru",
        correct: false,
      },
      {
        text: "Subhas Chandra Bose",
        correct: false,
      },
      {
        text: "Mahatma Gandhi",
        correct: true,
      },
      {
        text: "Sardar Vallabhbhai Patel",
        correct: false,
      },
    ],
  },
  {
    id: 13,
    question: "Which is the capital of Australia?",
    answers: [
      {
        text: "Sydney",
        correct: false,
      },
      {
        text: "Melbourne",
        correct: false,
      },
      {
        text: "Canberra",
        correct: true,
      },
      {
        text: "Brisbane",
        correct: false,
      },
    ],
  },
  {
    id: 14,
    question: "In which sport is the term 'Grand Slam' used?",
    answers: [
      {
        text: "Tennis",
        correct: true,
      },
      {
        text: "Golf",
        correct: false,
      },
      {
        text: "Cricket",
        correct: false,
      },
      {
        text: "Football",
        correct: false,
      },
    ],
  },
  {
    id: 15,
    question: "Which river is known as the 'Ganga of the South'?",
    answers: [
      {
        text: "Krishna",
        correct: false,
      },
      {
        text: "Godavari",
        correct: true,
      },
      {
        text: "Cauvery",
        correct: false,
      },
      {
        text: "Narmada",
        correct: false,
      },
    ],
  },
];

const prizeMoney = [
  { id: 1, amount: "₹ 5000" },
  { id: 2, amount: "₹ 15000" },
  { id: 3, amount: "₹ 30000" },
  { id: 4, amount: "₹ 60000" },
  { id: 5, amount: "₹ 100000" },
  { id: 6, amount: "₹ 150000" },
  { id: 7, amount: "₹ 250000" },
  { id: 8, amount: "₹ 400000" },
  { id: 9, amount: "₹ 600000" },
  { id: 10, amount: "₹ 1000000" },
  { id: 11, amount: "₹ 5000000" },
  { id: 12, amount: "₹ 100000000" },
  { id: 13, amount: "₹ 300000000" },
  { id: 14, amount: "₹ 500000000" },
  { id: 15, amount: "₹ 1000000000" },
].reverse();

export { prizeMoney, data };
