export interface Course {
    id: number;
    name: string;
    description: string;
    subdomain: string;
    owner_id: number;
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

export interface Question {
    id: number;
    question: string;
    answer: string;
    incorrect: string;
    position: number;
    module_id: number;
}