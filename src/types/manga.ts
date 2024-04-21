export type MangaChapter = {
  index: number;
  name: string;
  total: number;
  prevIndex?: MangaChapter["index"];
  nextIndex?: MangaChapter["index"];
};

export type MangaInfo = {
  id: string;
  title: string;
  chapters: MangaChapter[];
  // TODO: 如果高度自适应会导致图片加载后移动，则增加「最匹配的图片比例」
};

export type MangaPageImage = {
  mangaId: MangaInfo["id"];
  /** 章节（由 1 开始） */
  chapterIndex: MangaChapter["index"];
  /** 页码（由 1 开始） */
  pageIndex: number;
};
