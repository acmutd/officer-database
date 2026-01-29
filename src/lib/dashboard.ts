export interface DashboardCardData {
  title: string;
  description: string;
  link: string;
}

export const DASHBOARD_CARDS: DashboardCardData[] = [
    //Displayed on Officer, Director, and Exec Pages
    {
    title: "ACM Director Report Form",
    description: "Honest and transparent feedback is what makes our organization thrive! If you ever have feedback for our directors feel free to fill out this form or set up a meeting with the executive team!",
    link: "https://forms.gle/nJ8gDDnbQtkBJ2kH9",
    
  },
   {
    title: "ACM Reimbursement Form",
    description: "After making a purchase for a pre-approved expense on your division’s budget, fill out this form! Make sure you fill out the form within 15 days with a valid receipt.",
    link: "https://acmutd.typeform.com/to/hJFb8taq",
    
  },
   {
    title: "ACM Finance FAQ",
    description: "Our finances often raise many questions for all officers, feel free to look at these most commonly asked questions and answers!",
    link: "https://docs.google.com/document/d/1PcLNAx6bHoX4lwRlzhajomufGOif5HLOXjJJyxOC2g0/edit?usp=sharing",
    
  },

  //This is Just for Directors and Exec

   {
    title: "ACM Budget Spring 2026",
    description: " Here are the approved Spring 2026 finances for each division!",
    link: "https://docs.google.com/spreadsheets/d/14RVrfa7pBpnQ8fzUM0_l4uWOOHJnYeCxr4Gn1JgWOqc/edit?gid=0#gid=0",
    
  },
   {
    title: "ACM Media Request Form",
    description: "Our Media team works hard to get your events marketed to the public! Fill out this form, preferably 2 weeks in advance, to get all your media needs covered!",
    link: "https://acmutd.typeform.com/acmedia-request",
    
  },
  
];