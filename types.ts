
export interface CompanyInfo {
  japan: string[];
  us: string[];
}

export interface Article {
  title: string;
  importance: string;
  originalText: string;
  summary: string;
  whyImportant: string;
  risks: string;
  companies: CompanyInfo;
}

export interface NewsResponse {
  articles: Article[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}
