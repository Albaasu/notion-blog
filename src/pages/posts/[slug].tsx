import React from 'react';
import { getAllPosts, getSinglePost } from '../lib/notionAPI';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';

export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const paths = allPosts.map(({ slug }) => ({ params: { slug } }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }:any) => {
  const post = await getSinglePost(params.slug);

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

const Post = ({ post }:any) => {
  return (
    <section className='container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20'>
      <h2 className='w-full text-2xl font-medium'>{post.metadata.title}</h2>
      <div className='border-b-2 w-1/3 mt-1 border-sky-900'></div>
      <span className='text-gray-500'>Posted data at {post.metadata.date}</span>
      <br />
      {post.metadata.tags.map((tag: string) => (
        <p
          className='text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block mr-2'
          key={tag}
        >
          {tag}
        </p>
      ))}

      <div className='mt-10 font-medium'>
      <ReactMarkdown
          components={{
            code({ inline, className, children }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code>{children}</code>
              );
            },
          }}
        >
          {post.markdown}
        </ReactMarkdown>
        <Link href='/'>
          <span
            className='pb-20 block mt-3 text-sk
          '
          >
            ⇐Homeに戻る
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Post;
