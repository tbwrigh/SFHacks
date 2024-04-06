export interface Course {
    id: number;
    name: string;
    description: string;
    subdomain: string;
    owner_id: number;
}

export interface CourseData {
    name: string;
    description: string;
    subdomain: string;
    icon: File | undefined; // Allow the icon to be a File or undefined
    iconPreview: string | undefined; // This will hold the URL for the preview
    primaryColor: string;
    secondaryColor: string;
  }

export interface Module {
    id: number;
    name: string;
    description: string;
    position: number;
}

export interface Material {
    id: number;
    name: string;
    description: string;
    position: number;
    module_id: number;
}