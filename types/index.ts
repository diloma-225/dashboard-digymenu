export interface Dish {
    id: number;
    name: string;
    price: number;
  }
  
export  interface Subcategory {
    id: number;
    name: string;
    dishes: Dish[];
}

export interface Category {
    id: number;
    name: string;
    subcategories: Subcategory[];
    dishes?: Dish[];
    isOpen?: boolean;
  }

export type Categories = Category[]

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  logo: string;
  cover: string;
  color_code:string
}