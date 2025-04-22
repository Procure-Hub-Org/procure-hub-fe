export const mockBidProposals = [
  {
    id: '1',
    sellerName: 'TechSolutions Inc.',
    sellerLogo: 'https://via.placeholder.com/40',
    price: '45000',
    deliveryTime: 120,
    proposalDescription: 'We offer a team of 5 senior developers with expertise in React, Node.js, and AWS. Our approach includes weekly sprints with regular demos and feedback sessions.',
    submissionDate: '2025-04-10T10:30:00Z',
    isEvaluated: true,
    evaluation: {
      scores: {
        quality: 4,
        priceFeasibility: 5,
        deliveryTimeline: 3,
        experience: 5,
        communication: 4
      },
      comment: 'Strong technical proposal with good pricing. Timeline seems a bit optimistic.',
      averageScore: '4.2',
      evaluationDate: '2025-04-12T14:20:00Z'
    },
    isAwarded: false
  },
  {
    id: '2',
    sellerName: 'DevPros Group',
    sellerLogo: 'https://via.placeholder.com/40',
    price: '52000',
    deliveryTime: 90,
    proposalDescription: 'Our team specializes in rapid development with high quality. We propose a solution using microservices architecture and CI/CD pipeline for continuous deployment.',
    submissionDate: '2025-04-11T15:45:00Z',
    isEvaluated: false,
    isAwarded: false
  },
  {
    id: '3',
    sellerName: 'Digital Innovators LLC',
    sellerLogo: 'https://via.placeholder.com/40',
    price: '48500',
    deliveryTime: 110,
    proposalDescription: 'We bring a cross-functional team with UX designers and full-stack developers. Our methodology focuses on user-centered design with test-driven development.',
    submissionDate: '2025-04-09T09:15:00Z',
    isEvaluated: true,
    evaluation: {
      scores: {
        technicalQuality: 5,
        priceFeasibility: 4,
        deliveryTimeline: 4,
        experience: 4,
        communication: 5
      },
      comment: 'Excellent technical approach with good focus on user experience. Competitive pricing.',
      averageScore: '4.4',
      evaluationDate: '2025-04-13T11:30:00Z'
    },
    isAwarded: false
  },
  {
    id: '4',
    sellerName: 'CodeCrafters',
    sellerLogo: 'https://via.placeholder.com/40',
    price: '43000',
    deliveryTime: 130,
    proposalDescription: 'We offer the most cost-effective solution with a team of skilled offshore developers. We follow agile methodology with bi-weekly deliverables.',
    submissionDate: '2025-04-13T17:20:00Z',
    isEvaluated: false,
    isAwarded: false
  }
];