export interface Book {
  // key format: '/works/<id>' used to build detail route
  key: string;
  title: string;
  edition_count: number;
  cover_id: number;
  first_publish_year: number;
  subtitle: string;
  description: string;
}
