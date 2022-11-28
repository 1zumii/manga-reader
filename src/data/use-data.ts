import jsonData from './manga-info.json';

export type MangaChapter = {
  name: string;
  total: number;
}

export type MangaInfo = {
  id: string;
  title: string;
  coverUrl: string;
  chapters: MangaChapter[];
}

const useData = (): MangaInfo[] => jsonData as MangaInfo[];

export default useData;
