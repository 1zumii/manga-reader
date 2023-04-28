export type MangaChapter = {
  index: number;
  name: string;
  total: number;
  prevIndex?: MangaChapter['index'];
  nextIndex?: MangaChapter['index'];
}

export type MangaInfo = {
  id: string;
  title: string;
  chapters: MangaChapter[];
}

export type MangaPageImage = {
  mangaId: MangaInfo['id'];
  /** 章节（由 1 开始） */
  chapterIndex: MangaChapter['index'];
  /** 页码（由 1 开始） */
  pageIndex: number;
}
