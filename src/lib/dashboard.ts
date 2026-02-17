export interface DashboardCardData {
  title: string;
  description: string;
  link: string;
  minLevel: number; // 1 is for officers, 2 is for directors, and 3 is for execs
}

export const DASHBOARD_CARDS: DashboardCardData[] = [
    //Displayed on Officer, Director, and Exec Pages
    {
    title: "Director Report Form",
    description: "Honest and transparent feedback is what makes our organization thrive! If you ever have feedback for our directors feel free to fill out this form or set up a meeting with the executive team!",
    link: "https://forms.gle/nJ8gDDnbQtkBJ2kH9",
    minLevel: 1
    
  },
   {
    title: "Reimbursement Form",
    description: "After making a purchase for a pre-approved expense on your division’s budget, fill out this form! Make sure you fill out the form within 15 days with a valid receipt.",
    link: "https://acmutd.typeform.com/to/hJFb8taq",
    minLevel: 1
    
  },
   {
    title: "Finance FAQ",
    description: "Our finances often raise many questions for all officers, feel free to look at these most commonly asked questions and answers!",
    link: "https://docs.google.com/document/d/1PcLNAx6bHoX4lwRlzhajomufGOif5HLOXjJJyxOC2g0/edit?usp=sharing",
    minLevel: 1
  },

  //This is Just for Directors and Exec

   {
    title: "Budget Spring 2026",
    description: "Use this form to request funding for ACM-related events, projects, or activities. Please provide detailed and accurate information to help the finance team review, approve, and allocate resources.",
    link: "https://docs.google.com/spreadsheets/d/14RVrfa7pBpnQ8fzUM0_l4uWOOHJnYeCxr4Gn1JgWOqc/edit?gid=0#gid=0",
    minLevel: 2
  },
   {
    title: "Media Request Form",
    description: "Use this to request graphic designs, promotional materials, or media coverage for ACM events and initiatives. Please submit your request in advance to allow sufficient time for and coordination with the content and media teams.",
    link: "https://acmutd.typeform.com/acmedia-request",
    minLevel: 2
  },
  
];