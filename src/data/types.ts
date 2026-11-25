export type Project = {
  id: string;
  name: string;
  client: string;
  category: string;
  filter: "Websites" | "Web Applications" | "E-commerce";
  description: string;
  technologies: string[];
  url: string;
  caseStudyUrl?: string;
  image: string;
  imageSmall?: string;
  imageAlt: string;
  imageType: "screenshot" | "placeholder";
  theme: string;
  completed: boolean;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  icon: "globe" | "app" | "phone" | "layers" | "code" | "pen";
  details: string;
  deliverables: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  company: string;
  review: string;
  image?: string;
  approved: boolean;
  video?: {
    url: string;
    type: "mp4" | "youtube" | "vimeo";
    thumbnail: string;
    captions?: string;
  };
};
