import { GetStaticPaths, GetStaticProps } from 'next';
import SinglePost from '@/components/Post/SinglePost';
import {
  getAllPosts,
  getPostsForTopPage,
  getPostsByPage,
  getNumberOfPages,
  getPostsByTagAndPage,
  getNumberOfPagesByTag,
  getAllTags,
} from '../../../../lib/notionAPI';
import Head from 'next/head';
import Pagenation from '@/components/Pagenation/Pagenation';

export const getStaticPaths: GetStaticPaths = async () => {
  const allTags = await getAllTags();
  let params = [];
await Promise.all(
  
)
  

};
export const getStaticProps: GetStaticProps = async (context) => {
  const currentPage: string = context.params?.page?.toString();
  const currentTag: string = context.params?.tag?.toString();

  const upperCaseCurrentTag =
    currentTag.charAt(0).toUpperCase() + currentTag.slice(1);

  const posts = await getPostsByTagAndPage(
    upperCaseCurrentTag,
    parseInt(currentPage, 10)
  );
  const numberOfPage = await getNumberOfPages();
  return {
    props: {
      posts,
    },
    revalidate: 60,
  };
};

const BlogTagPageList = ({ numberOfPage, posts }) => {
  return (
    <div className='container mx-auto h-full w-full'>
      <Head>
        <title>Notion-Blog</title>
        <meta name='description' content='Generated by create nextapp' />
        <link rel='icon' href='/favicon.icon' />
      </Head>

      <main className='w-ful container mt-16'>
        <h1 className='mb-16 text-center text-5xl font-medium'>
          Notion Blog🚀
        </h1>
        <section className=' sm:grid  grid-cols-2 w:5/6 gap-4 mx-auto'>
          {posts.map((post) => (
            <div key={post.id}>
              <SinglePost
                title={post.title}
                description={post.description}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
                isPaginationPage={true}
              />
            </div>
          ))}
        </section>
        <Pagenation numberOfPage={numberOfPage} />
      </main>
    </div>
  );
};

export default BlogTagPageList;