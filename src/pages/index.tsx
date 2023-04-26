import { GetStaticProps } from 'next';
import SinglePost from '../components/Post/SinglePost';
import { getAllPosts, getPostsForTopPage } from './lib/notionAPI';
import Head from 'next/head';
import Link from 'next/link';

export const getStaticProps: GetStaticProps = async () => {
  const fourPosts = await getPostsForTopPage(4);

  return {
    props: {
      fourPosts,
    },
    revalidate: 60,
  };
};

export default function Home({ fourPosts }: any) {
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
        {fourPosts.map((post) => (
          <div className='mx-4' key={post.id}>
            <SinglePost
              title={post.title}
              description={post.description}
              date={post.date}
              tags={post.tags}
              slug={post.slug}
              isPaginationPage={false}
            />
          </div>
        ))}
        <h2>
          <Link
            href='/posts/page/1'
            className='mb-6 lg:w-1/2 mx-auto rounded-md px-5 block text-right'
          >
            ...もっと見る
          </Link>
        </h2>
      </main>
    </div>
  );
}
