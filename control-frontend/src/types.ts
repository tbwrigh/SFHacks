export interface Course {
    title: string;
    description: string;
}

export interface CourseData {
    title: string;
    description: string;
    subdomain: string;
    icon: File | undefined; // Allow the icon to be a File or undefined
    primaryColor: string;
    secondaryColor: string;
  }