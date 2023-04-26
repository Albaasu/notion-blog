import { NUMBER_OF_POSTS_PER_PAGE } from '@/constants/constants';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export const getAllPosts = async () => {
  
  const posts = await notion.databases.query({
    database_id :process.env.NOTION_DATABASE_ID,
    page_size: 100,
    
  });
  const allPosts = posts.results;

  return allPosts.map((post) => {
    return getPageMetaData(post);
  });
};

const getPageMetaData = (post:any) => {
  const getTags = (tags:any) => {
    const allTags = tags.map((tag:any) => {
      return tag.name;
    });
    return allTags;
  };

  const getDescription = (richText:any) => {
    let plainText = '';
    richText.forEach((textObject:any) => {
      if (textObject.type === 'text') {
        plainText += textObject.text.content;
      }
    });
    return plainText;
  };

  return {
    id: post.id,
    title: post.properties.Name.title[0].plain_text,
    description: getDescription(post.properties.Description.rich_text),
    date: post.properties.Date.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
    tags: getTags(post.properties.Tags.multi_select),
  };
};

export const getSinglePost = async (slug:any) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: 'Slug',
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });
  const page = response.results[0];
  const metadata = getPageMetaData(page);
  const mbBlocks = await n2m.pageToMarkdown(page.id);
  const mbString = n2m.toMarkdownString(mbBlocks);
  console.log(mbString);
  return {
    metadata,
    markdown: mbString,
  };
};

//topページ用の記事取得４つ分
export const getPostsForTopPage = async (pageSize: number) => {
  const allPosts = await getAllPosts();
  const fourPosts = allPosts.slice(0, pageSize);
  return fourPosts;
};

//ページ番号に応じた記事取得

export const getPostsByPage = async (page: number) => {
  const allPosts = await getAllPosts();

  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;
  return allPosts.slice(startIndex, endIndex);
};

//動的ページ取得
export const getNumberOfPages = async () => {
  const allPosts = await getAllPosts();

  return (
    Math.floor(allPosts.length / NUMBER_OF_POSTS_PER_PAGE) +
    (allPosts.length % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1 : 0)
  );
};

export const getPostsByTagAndPage = async (tagName: string, page: number) => {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) =>
    post.tags.find((tag: string) => tag === tagName)
  );

  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;

  return posts.slice(startIndex, endIndex);
};

export const getNumberOfPagesByTag = async (tagName: string) => {
  const allPosts = await getAllPosts();

  const posts = allPosts.filter((post) => {
    post.tags.find((tag: string) => tag === tagName);
  });

  return (
    Math.floor(allPosts.length / NUMBER_OF_POSTS_PER_PAGE) +
    (allPosts.length % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1 : 0)
  );
};


export const getAllTags = async () => {
  const allPosts = await getAllPosts();
  const AllTagsDuplicationList = allPosts.flatMap((post) => post.tags);
  const set = new Set(AllTagsDuplicationList);
  const allTagsList = Array.from(set);
  return allTagsList;
}